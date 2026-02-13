/**
 * ChatService.js
 * 
 * Core service for handling AI interactions.
 * Responsibilities:
 * 1. Defines the 'TOOLS' schema (OpenAI Function Calling API format).
 * 2. Manages the conversation loop with OpenAI.
 * 3. Executes local tools (from ChatTools.js) when requested by the model.
 * 4. Feeds tool outputs back to the model to generate the final response.
 */

const OpenAI = require('openai');
const chatTools = require('./ChatTools');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Tool Definitions
 * ----------------
 * JSON Schemas describing available functions to the LLM.
 * The 'description' field is critical—it tells the model *when* and *why* to use a tool.
 */
const TOOLS = [
  {
    type: "function",
    function: {
      name: "get_student_profile",
      description: "Get the current student's profile information (name, email, WAM, etc). Use this when the user asks about themselves.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_enrolled_modules",
      description: "Get the list of modules the student is currently enrolled in. Use this for general course queries.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_schedule",
      description: "Get the class and exam schedule for the student within a specific date range. Use this for questions about time, dates, or venues. ALWAYS requires start_date and end_date.",
      parameters: {
        type: "object",
        properties: {
            start_date: { type: "string", description: "Start date in YYYY-MM-DD format" },
            end_date: { type: "string", description: "End date in YYYY-MM-DD format" }
        },
        required: ["start_date", "end_date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_module_info",
      description: "Get detailed information about a specific module (announcements, assignments). Requires a module code.",
      parameters: {
        type: "object",
        properties: {
          module_code: {
            type: "string",
            description: "The module code, e.g., 'CSIT321'",
          },
        },
        required: ["module_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_payments",
      description: "Get a list of the student's fee payments and their status (paid/pending). Use this for questions about tuition, fees, or outstanding balances.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_public_events",
      description: "Get a list of upcoming public campus events. Use this for guest queries about what is happening on campus.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_course_materials",
      description: "List all available files (Lecture Notes, Labs, Assignments) for a module. Use this first to see what topics are covered.",
      parameters: {
        type: "object",
        properties: {
          module_code: { type: "string", description: "The module code, e.g., 'CSIT321'" },
          category: { type: "string", description: "Optional filter: 'Lecture Notes', 'Labs', 'Assignments'" }
        },
        required: ["module_code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_material_content",
      description: "Read the full text content of a specific file. Use this to summarize a lecture or get details on an assignment found via 'list_course_materials'.",
      parameters: {
        type: "object",
        properties: {
          module_code: { type: "string" },
          file_title: { type: "string", description: "The title of the file to read (from the list)." }
        },
        required: ["module_code", "file_title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_course_materials",
      description: "Search for specific keywords across all course materials. Use this for specific fact-checking (e.g., 'deadline', 'recursion').",
      parameters: {
        type: "object",
        properties: {
          module_code: {
            type: "string",
            description: "The module code to search in (e.g., CSIT321).",
          },
          query: {
            type: "string",
            description: "The search keywords or phrase.",
          },
          category: {
             type: "string",
             description: "Optional category filter: 'Lecture Notes', 'Labs', 'Assignments'"
          }
        },
        required: ["module_code", "query"],
      },
    },
  },
];

/**
 * generateResponse
 * ----------------
 * Main entry point for generating a chat response.
 * Uses a 'while' loop to support multi-turn reasoning (Tool execution -> Result -> New Request).
 * 
 * @param {Array} messages - The conversation history (including system, user, and assistant messages).
 * @param {string} userId - Context for tool execution (whose data to fetch).
 * @param {string} requestId - For tracing logs.
 * @param {boolean} isGuest - Whether the user is a guest (restricts tool access).
 * @param {string} chatType - 'admin_support' or 'course_tutor'.
 * @returns {Object} The final message object from OpenAI.
 */
const generateResponse = async (messages, userId, requestId = 'UNKNOWN', isGuest = false, chatType = 'admin_support') => {
  try {
    console.log(`[ChatService] [${requestId}] Starting generation. Guest: ${isGuest}, Type: ${chatType}`);
    
    // Filter tools based on role and chat type
    let availableTools = [];

    if (isGuest) {
      // Guests only get public events
      availableTools = TOOLS.filter(t => t.function.name === 'get_public_events');
    } else if (chatType === 'course_tutor') {
      // Course Tutor gets material-related tools
      const tutorTools = ['list_course_materials', 'read_material_content', 'search_course_materials'];
      availableTools = TOOLS.filter(t => tutorTools.includes(t.function.name));
    } else {
      // Admin Support (Default) - Everything except specialized course tools
      const adminTools = ['get_student_profile', 'get_enrolled_modules', 'get_my_schedule', 'get_module_info', 'get_my_payments', 'get_public_events'];
      availableTools = TOOLS.filter(t => adminTools.includes(t.function.name));
    }

    // Create a mutable copy of messages to append tool inputs/outputs during the loop
    let currentMessages = [...messages];
    
    // Safety mechanism to prevent infinite loops if the model keeps requesting tools
    let turnCount = 0;
    const MAX_TURNS = 5; 

    while (turnCount < MAX_TURNS) {
      turnCount++;
      console.log(`[ChatService] [${requestId}] Turn ${turnCount}: Sending request to OpenAI (gpt-4.1-mini)...`);
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini", // Specific model version as requested
        messages: currentMessages,
        tools: availableTools.length > 0 ? availableTools : undefined,
        tool_choice: availableTools.length > 0 ? "auto" : undefined, // Let the model decide whether to use a tool or just reply
      });

      const message = completion.choices[0].message;
      console.log(`[ChatService] [${requestId}] Turn ${turnCount}: Received response. Role: ${message.role}`);

      // CHECK: Did the model return a final text response?
      if (!message.tool_calls) {
        console.log(`[ChatService] [${requestId}] No tool calls. Final response generated.`);
        console.log(`[ChatService] [${requestId}] Content: "${message.content ? message.content.substring(0, 100) + '...' : 'No content'}"`);
        return message;
      }

      // PROCESS: The model requested one or more tool executions
      console.log(`[ChatService] [${requestId}] Turn ${turnCount}: OpenAI requested ${message.tool_calls.length} tool(s)`);
      currentMessages.push(message); // Important: Add the "assistant" message requesting the tool to history

      // Execute each requested tool in sequence
      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgsRaw = toolCall.function.arguments;
        const functionArgs = JSON.parse(functionArgsRaw); // Parse JSON arguments generated by LLM
        
        console.log(`[ChatService] [${requestId}] Executing Tool: ${functionName}`);
        console.log(`[ChatService] [${requestId}] Arguments: ${functionArgsRaw}`);

        let toolResult;
        
        // Dispatcher: Map function name to actual implementation in ChatTools.js
        try {
          if (functionName === 'get_student_profile') {
            toolResult = await chatTools.get_student_profile({ user_id: userId, requestId });
          } else if (functionName === 'get_enrolled_modules') {
            toolResult = await chatTools.get_enrolled_modules({ user_id: userId, requestId });
          } else if (functionName === 'get_my_schedule') {
            toolResult = await chatTools.get_my_schedule({ 
                user_id: userId, 
                start_date: functionArgs.start_date, 
                end_date: functionArgs.end_date, 
                requestId 
            });
          } else if (functionName === 'get_module_info') {
            toolResult = await chatTools.get_module_info({ module_code: functionArgs.module_code, requestId });
          } else if (functionName === 'get_my_payments') {
            toolResult = await chatTools.get_my_payments({ user_id: userId, requestId });
          } else if (functionName === 'get_public_events') {
            toolResult = await chatTools.get_public_events({ requestId });
          } else if (functionName === 'list_course_materials') {
            toolResult = await chatTools.list_course_materials({ 
              module_code: functionArgs.module_code, 
              category: functionArgs.category, 
              requestId 
            });
          } else if (functionName === 'read_material_content') {
            toolResult = await chatTools.read_material_content({ 
              module_code: functionArgs.module_code, 
              file_title: functionArgs.file_title, 
              requestId 
            });
          } else if (functionName === 'search_course_materials') {
            toolResult = await chatTools.search_course_materials({ 
              module_code: functionArgs.module_code, 
              query: functionArgs.query, 
              category: functionArgs.category,
              requestId 
            });
          } else {
            console.warn(`[ChatService] [${requestId}] Unknown tool requested: ${functionName}`);
            toolResult = { error: "Unknown tool" };
          }
        } catch (err) {
          console.error(`[ChatService] [${requestId}] Tool execution error: ${err.message}`);
          toolResult = { error: err.message };
        }

        const resultString = JSON.stringify(toolResult);
        console.log(`[ChatService] [${requestId}] Tool Output (Length: ${resultString.length}): ${resultString.substring(0, 200)}...`);

        // Append the Tool Output to history with role "tool"
        // This informs the model of the result of its request
        currentMessages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: resultString,
        });
      }
      
      // Loop continues: OpenAI will now receive the tool outputs and generate the next response
    }
    
    console.error(`[ChatService] [${requestId}] Max conversation turns (${MAX_TURNS}) exceeded.`);
    throw new Error("Max conversation turns exceeded. The AI got stuck in a loop.");

  } catch (error) {
    if (error.response) {
      console.error(`[ChatService] [${requestId}] OpenAI API Error Response:`, error.response.data);
    } else {
      console.error(`[ChatService] [${requestId}] OpenAI API Error:`, error.message);
    }
    throw new Error(`Failed to generate response from OpenAI: ${error.message}`);
  }
};

module.exports = { generateResponse };
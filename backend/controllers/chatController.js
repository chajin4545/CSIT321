/**
 * chatController.js
 * 
 * Handles HTTP requests for the Chatbot feature.
 * 
 * Endpoints:
 * - POST /api/chat: Sends a message and gets a response (Streaming not implemented yet).
 * - GET /api/chat/history: Retrieves a list of past chat sessions.
 * - GET /api/chat/session/:sessionId: Retrieves the full message history for a specific session.
 * 
 * Dependencies:
 * - ChatService: Encapsulates OpenAI/RAG logic.
 * - ChatSession: MongoDB model for persisting conversation history.
 */

const chatService = require('../services/ChatService');
const ChatSession = require('../models/ChatSession');
const { randomUUID } = require('crypto');

/**
 * sendMessage
 * -----------
 * Main handler for processing user messages.
 * 
 * Flow:
 * 1. Validate User & Input.
 * 2. Retrieve existing ChatSession or Create new one.
 * 3. Append 'user' message to DB.
 * 4. Convert DB messages to OpenAI format.
 * 5. Call ChatService (which handles Tools/RAG).
 * 6. Append 'bot' response to DB.
 * 7. Return response to client.
 */
const sendMessage = async (req, res) => {
  // Generate a short Request ID for tracing logs across multiple services
  const requestId = randomUUID().substring(0, 8);
  console.log(`
[ChatController] [${requestId}] --- New Chat Request ---`);
  
  try {
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user.user_id : null;
    
    console.log(`[ChatController] [${requestId}] User: ${userId}, Session: ${sessionId || 'New'}`);
    console.log(`[ChatController] [${requestId}] User Message: "${message}"`);

    // Validation
    if (!userId) {
      console.warn(`[ChatController] [${requestId}] Unauthorized access attempt`);
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!message) {
      console.warn(`[ChatController] [${requestId}] Empty message received`);
      return res.status(400).json({ message: "Message content is required." });
    }

    let session;

    // 1. Try to find existing session if sessionId provided
    // This allows continuing a specific conversation context
    if (sessionId) {
      session = await ChatSession.findOne({ session_id: sessionId, user_id: userId });
      if (session) console.log(`[ChatController] [${requestId}] Found existing session: ${session.session_id}`);
      else console.log(`[ChatController] [${requestId}] Session ${sessionId} not found, creating new.`);
    }

    // 2. If no session found (or no ID provided), create new one
    // New sessions default to 'admin_support' type (can be expanded later)
    if (!session) {
      session = new ChatSession({
        session_id: sessionId || randomUUID(),
        user_id: userId,
        type: 'admin_support',
        title: message.substring(0, 50) || 'New Chat', // First message becomes title
        messages: []
      });
      console.log(`[ChatController] [${requestId}] Created new session: ${session.session_id}`);
    }

    // 3. Add User Message to DB (Persistence)
    session.messages.push({
      sender: 'user',
      content: message,
      timestamp: new Date()
    });

    // 4. Prepare context for OpenAI
    // The model needs the conversation history to understand context.
    // We map our MongoDB schema (sender: 'user'/'bot') to OpenAI schema (role: 'user'/'assistant').
    
    // Dynamic Date for Production
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const openAIMessages = [
      {
        role: "system",
        content: `You are an intelligent assistant for CampusBuddy, helping students of SIM UOW (University of Wollongong).
        
CURRENT DATE: ${currentDate}

IMPORTANT DOMAIN RULES:
1. This university DOES NOT have a GPA system. It uses WAM (Weighted Average Mark).
2. If a student asks "What is my GPA?", you MUST explicitly state that GPA does not exist at SIM UOW.
3. Instead, offer to show their WAM (Weighted Average Mark) based on their past enrollments.
4. Only show the WAM value if the user agrees or asks for it.
5. Use the 'get_student_profile' tool to retrieve the 'wam' value.
6. **CRITICAL: SCHEDULE & DATES**:
   - For ANY schedule query (e.g., "tomorrow", "this week", "next Monday"), you MUST:
     a) Identify the target date(s) relative to CURRENT DATE.
     b) Convert them to YYYY-MM-DD.
     c) Call 'get_my_schedule' with 'start_date' AND 'end_date' ALWAYS.
   - NEVER call 'get_my_schedule' without these parameters.
   - Example: Today is Sunday 2026-02-01. User asks "tomorrow". You MUST call get_my_schedule(start_date: "2026-02-02", end_date: "2026-02-02").
7. **LINKS & FORMATTING**:
   - ALWAYS provide links in Markdown format: [Link Text](URL).
   - When providing the payment guide, ensure [SIMConnect](https://simconnect.simge.edu.sg/) is a clickable link.
   - Use bold text for amounts and due dates to make them stand out.`
      },
      ...session.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    // 5. Generate Response
    // We pass userId so the service can fetch user-specific data (RAG)
    console.log(`[ChatController] [${requestId}] Delegating to ChatService...`);
    const aiResponse = await chatService.generateResponse(openAIMessages, userId, requestId);
    
    // 6. Add Bot Message to DB
    session.messages.push({
      sender: 'bot',
      content: aiResponse.content,
      timestamp: new Date()
    });

    // 7. Save Session
    session.last_active = Date.now();
    await session.save();
    
    console.log(`[ChatController] [${requestId}] Response saved. Sending to client.`);
    console.log(`[ChatController] [${requestId}] --- Request Completed ---
`);
    
    res.json({
      sessionId: session.session_id,
      message: { role: 'assistant', content: aiResponse.content }
    });
  } catch (error) {
    console.error(`[ChatController] [${requestId}] Error:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * getChatHistory
 * --------------
 * Retrieves high-level metadata for sidebar display.
 * Returns: session_id, title, last_active.
 */
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Sort by last_active descending to show most recent chats first
    const history = await ChatSession.find({ user_id: userId })
      .select('session_id title last_active')
      .sort({ last_active: -1 });

    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

/**
 * getSession
 * ----------
 * Retrieves the full content of a specific chat session.
 * Used when a user clicks a history item.
 */
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.user_id;

    const session = await ChatSession.findOne({ session_id: sessionId, user_id: userId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Map messages for frontend consumption
    // Frontend expects { role: 'user'/'assistant', content: ... }
    const formattedMessages = session.messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
      timestamp: m.timestamp
    }));

    res.json({
      sessionId: session.session_id,
      title: session.title,
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

module.exports = { sendMessage, getChatHistory, getSession };
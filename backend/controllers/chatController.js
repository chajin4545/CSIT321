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
    const aiResponse = await chatService.generateResponse(openAIMessages, userId, requestId, false);
    
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
 * guestMessage
 * ------------
 * Handler for guest chat interactions.
 * Enforces rate limits (5 questions) and restricted scope.
 */
const guestMessage = async (req, res) => {
  const requestId = randomUUID().substring(0, 8);
  console.log(`
[ChatController] [${requestId}] --- New Guest Chat Request ---`);

  try {
    const { message, sessionId } = req.body;
    console.log(`[ChatController] [${requestId}] Guest Session: ${sessionId || 'New'}`);

    if (!message) {
      return res.status(400).json({ message: "Message content is required." });
    }

    let session;

    // 1. Find or Create Session
    if (sessionId) {
      session = await ChatSession.findOne({ session_id: sessionId, is_guest: true });
    }

    if (!session) {
      session = new ChatSession({
        session_id: sessionId || randomUUID(),
        user_id: 'guest', // Placeholder
        is_guest: true,
        type: 'guest_support',
        title: message.substring(0, 50) || 'Guest Chat',
        messages: []
      });
      console.log(`[ChatController] [${requestId}] Created new GUEST session: ${session.session_id}`);
    }

    // 2. Rate Limiting Check (Rolling window: last 4 hours)
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const recentUserMessages = session.messages.filter(m => 
      m.sender === 'user' && m.timestamp > fourHoursAgo
    );

    if (recentUserMessages.length >= 5) {
      console.log(`[ChatController] [${requestId}] Guest rate limit reached (${recentUserMessages.length} messages in last 4h).`);
      return res.json({
        sessionId: session.session_id,
        message: { 
          role: 'assistant', 
          content: "You have reached the limit of 5 questions for guest users within a 4-hour period. Please wait a few more hours or [login](/login) to ask more questions and access personalized features." 
        },
        limitReached: true
      });
    }

    // 3. Add User Message
    session.messages.push({
      sender: 'user',
      content: message,
      timestamp: new Date()
    });

    // 4. Prepare Context
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const openAIMessages = [
      {
        role: "system",
        content: `You are the CampusBuddy Guest Assistant.
        
CURRENT DATE: ${currentDate}

RULES:
1. You can ONLY answer questions about PUBLIC EVENTS (using 'get_public_events') or general campus info.
2. You DO NOT have access to student data (grades, schedules, payments).
3. If a user asks about personal info (e.g., "What is my grade?", "My schedule", "Fees"), you MUST reply:
   "I cannot access personal student information. Please [login as a student](/login) to view your grades, schedule, and payments."
4. If a user asks for directions or how to get to a specific venue/event, you MUST:
   - Provide this link: [SIM Campus Facilities](https://www.sim.edu.sg/degrees-diplomas/life-at-sim/campus-facilities)
   - Ask the user to check the **Virtual Map** available on that page for detailed navigation.
5. If a user asks about enrollment, admissions, or how to apply for SIM UOW, you MUST:
   - Provide this link: [SIM UOW Programme Details](https://www.sim.edu.sg/degrees-diplomas/sim-global-education/university-partners-sim-ge/university-of-wollongong)
   - Inform them they can refer to the link to understand what SIM UOW is about.
   - Instruct them to click the **Apply Now** button on the top right side of that website to start their application.
6. Do not apologize excessively. Be helpful within your scope.
6. Use the 'get_public_events' tool if asked about events, what's happening, etc.`
      },
      ...session.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    // 5. Generate Response (isGuest = true)
    console.log(`[ChatController] [${requestId}] Delegating to ChatService (Guest Mode)...`);
    const aiResponse = await chatService.generateResponse(openAIMessages, 'guest', requestId, true);

    // 6. Save & Respond
    session.messages.push({
      sender: 'bot',
      content: aiResponse.content,
      timestamp: new Date()
    });
    session.last_active = Date.now();
    await session.save();

    res.json({
      sessionId: session.session_id,
      message: { role: 'assistant', content: aiResponse.content }
    });

  } catch (error) {
    console.error(`[ChatController] [${requestId}] Guest Error:`, error.message);
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

/**
 * submitFeedback
 * --------------
 * Saves user feedback (rating & comment) for a specific chat session.
 */
const submitFeedback = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const userId = req.user.user_id;

    if (!sessionId || !rating) {
      return res.status(400).json({ message: "Session ID and rating are required." });
    }

    // Optional: Verify session ownership
    const session = await ChatSession.findOne({ session_id: sessionId, user_id: userId });
    if (!session) {
      return res.status(404).json({ message: "Chat session not found or access denied." });
    }

    const Feedback = require('../models/Feedback');
    
    // Check if feedback already exists for this session (optional logic, allowing multiple for now or just one)
    // For now, we simply create a new one.

    const feedback = new Feedback({
      user_id: userId,
      target_type: 'chatbot',
      target_id: sessionId,
      rating: Number(rating),
      comment: comment
    });

    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
};

module.exports = { sendMessage, getChatHistory, getSession, submitFeedback, guestMessage };
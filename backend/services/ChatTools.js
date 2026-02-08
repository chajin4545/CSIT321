/**
 * ChatTools.js
 * 
 * This module defines the "Tools" (functions) that are exposed to the OpenAI model via Function Calling.
 * The model invokes these functions when it determines it needs external data (RAG - Retrieval Augmented Generation)
 * to answer a user's query.
 * 
 * Each function:
 * 1. Receives arguments parsed by the LLM.
 * 2. Performs a specific MongoDB query.
 * 3. Returns a JSON-serializable object strictly formatted for the LLM's context window.
 * 4. Includes 'requestId' logging for distributed tracing.
 */

const User = require('../models/User');
const Module = require('../models/Module');
const Enrollment = require('../models/Enrollment');
const Schedule = require('../models/Schedule');
const Payment = require('../models/Payment');
const Event = require('../models/Event');

/**
 * Tool: get_public_events
 * -----------------------
 * Fetches upcoming public events for guests.
 * Used when guests ask "What's happening on campus?", "Any events next week?".
 * 
 * @param {Object} params
 * @param {string} [params.requestId]
 * @returns {Array<Object>} List of upcoming events.
 */
const get_public_events = async ({ requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_public_events: Querying upcoming events`);
    const today = new Date();
    // Fetch events starting today or in the future
    const events = await Event.find({ start_date: { $gte: today } })
      .sort({ start_date: 1 })
      .limit(5); // Limit to 5 to save context
      
    if (!events || events.length === 0) {
      console.log(`[ChatTools] [${requestId}] get_public_events: No upcoming events`);
      return { message: "No upcoming public events found." };
    }
    
    return events.map(e => ({
      title: e.title,
      description: e.description,
      venue: e.venue,
      date: e.start_date.toISOString().split('T')[0],
      time: e.start_date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: e.category
    }));
  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_public_events Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: get_student_profile
 * -------------------------
 * Fetches basic profile information for the authenticated student.
 * Used when the user asks "Who am I?", "What is my GPA?", or "What is my email?".
 * 
 * @param {Object} params - Tool parameters.
 * @param {string} params.user_id - The ID of the currently authenticated user.
 * @param {string} [params.requestId] - Unique ID for request tracing.
 * @returns {Object} User profile data (excluding password) or error object.
 */
const get_student_profile = async ({ user_id, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_student_profile: Querying User for ${user_id}`);
    const user = await User.findOne({ user_id }).select('-password');
    if (!user) {
      console.warn(`[ChatTools] [${requestId}] get_student_profile: User not found`);
      return { error: "User not found" };
    }
    
    console.log(`[ChatTools] [${requestId}] get_student_profile: Found user ${user.full_name}`);
    
    // Return a subset of fields to minimize token usage while providing essential context
    return {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      wam: user.wam
    };
  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_student_profile Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: get_enrolled_modules
 * --------------------------
 * Lists all modules the student is actively enrolled in.
 * Steps:
 * 1. Query 'Enrollment' collection for 'enrolled' status.
 * 2. Extract module codes.
 * 3. Query 'Module' collection to get readable names and credit info.
 * 
 * @param {Object} params
 * @param {string} params.user_id
 * @param {string} [params.requestId]
 * @returns {Array<Object>} List of simplified module objects.
 */
const get_enrolled_modules = async ({ user_id, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_enrolled_modules: Querying Enrollments for ${user_id}`);
    const enrollments = await Enrollment.find({ student_id: user_id, status: 'enrolled' });
    
    if (!enrollments || enrollments.length === 0) {
      console.log(`[ChatTools] [${requestId}] get_enrolled_modules: No active enrollments`);
      return { message: "No active enrollments found." };
    }
    
    const moduleCodes = enrollments.map(e => e.module_code);
    console.log(`[ChatTools] [${requestId}] get_enrolled_modules: Found codes [${moduleCodes.join(', ')}]. Querying Module details...`);
    
    // Retrieve metadata for these modules
    const modules = await Module.find({ module_code: { $in: moduleCodes } })
      .select('module_code module_name credits prof_id');
      
    console.log(`[ChatTools] [${requestId}] get_enrolled_modules: Returned ${modules.length} modules`);
    return modules.map(m => ({
      module_code: m.module_code,
      module_name: m.module_name,
      credits: m.credits
    }));
  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_enrolled_modules Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: get_my_schedule
 * ---------------------
 * Retrieves the schedule for a specific date range using the Calendar-Based model.
 * All events now have a concrete 'specific_date'.
 * 
 * @param {Object} params
 * @param {string} params.user_id
 * @param {string} [params.start_date] - Start date in "YYYY-MM-DD" format.
 * @param {string} [params.end_date] - End date in "YYYY-MM-DD" format. Defaults to start_date.
 * @param {string} [params.requestId]
 * @returns {Array<Object>} List of specific schedule events with dates.
 */
const get_my_schedule = async ({ user_id, start_date, end_date, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_my_schedule: Calendar Query ${start_date} to ${end_date}`);
    
    // 1. Get Enrolled Modules
    const enrollments = await Enrollment.find({ student_id: user_id, status: 'enrolled' });
    const moduleCodes = enrollments.map(e => e.module_code);
    
    if (moduleCodes.length === 0) {
      return { message: "No enrolled modules." };
    }

    // 2. Define Date Range
    const start = start_date ? new Date(start_date) : new Date();
    const end = end_date ? new Date(end_date) : new Date(start);
    
    // Set to full day range (00:00:00 to 23:59:59)
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    // 3. Simple Range Query
    // Since we migrated to fully calendar-based, every class has a 'specific_date'.
    const events = await Schedule.find({
        module_code: { $in: moduleCodes },
        specific_date: { $gte: start, $lte: end }
    }).sort({ specific_date: 1, start_time: 1 });

    if (!events || events.length === 0) {
        console.log(`[ChatTools] [${requestId}] get_my_schedule: No events found in range.`);
        return { message: "No classes or exams found for this period." };
    }

    // 4. Format Output
    return events.map(e => {
        // Format date as YYYY-MM-DD for consistency
        // Since DB stores UTC midnight for dates, toISOString() correctly extracts the date part
        const dateStr = e.specific_date.toISOString().split('T')[0];
        
        return {
            date: dateStr,
            day: e.day_of_week, // e.g., "Monday"
            time: `${e.start_time} - ${e.end_time}`,
            module: e.module_code,
            type: e.type,
            venue: e.venue,
            group: e.group_id || 'N/A'
        };
    });

  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_my_schedule Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: get_module_info
 * ---------------------
 * Provides deep-dive information for a specific module.
 * Used for queries like "What assignments are due for CSIT321?" or "Any announcements for Algorithms?".
 * 
 * @param {Object} params
 * @param {string} params.module_code - The unique code of the module (e.g., 'CSIT321').
 * @param {string} [params.requestId]
 * @returns {Object} Detailed module info including assignments and recent announcements.
 */
const get_module_info = async ({ module_code, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_module_info: Querying Module ${module_code}`);
    const module = await Module.findOne({ module_code });
    if (!module) {
      console.warn(`[ChatTools] [${requestId}] get_module_info: Module not found`);
      return { error: `Module ${module_code} not found.` };
    }
    
    console.log(`[ChatTools] [${requestId}] get_module_info: Found module. Assignments: ${module.assignments?.length || 0}, Announcements: ${module.announcements?.length || 0}`);
    
    return {
      module_code: module.module_code,
      module_name: module.module_name,
      credits: module.credits,
      // Limit announcements to the most recent 3 to prevent context window overflow
      announcements: module.announcements ? module.announcements.slice(0, 3) : [], 
      assignments: module.assignments
    };
  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_module_info Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: get_my_payments
 * ---------------------
 * Retrieves outstanding payment/fee records for the student.
 * Used for queries like "How much do I owe?", "Have I paid my tuition?", "List my outstanding fees".
 * Automatically appends payment instructions.
 * 
 * @param {Object} params
 * @param {string} params.user_id
 * @param {string} [params.requestId]
 * @returns {Object} Object containing payments list and guide.
 */
const get_my_payments = async ({ user_id, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] get_my_payments: Querying Pending Payments for ${user_id}`);
    
    // Fetch only Pending or Overdue payments
    const payments = await Payment.find({ 
        student_id: user_id, 
        status: { $ne: 'paid' } 
    }).sort({ due_date: 1 });
      
    const guide = "To pay: Go to [SIMConnect](https://simconnect.simge.edu.sg/), login -> 'My Apps' -> Finances -> 'Make a payment'.";

    if (!payments || payments.length === 0) {
      console.log(`[ChatTools] [${requestId}] get_my_payments: No pending payments`);
      return { 
          message: "No outstanding payments found. You are all settled!",
          payment_guide: guide // Still useful to know where to check
      };
    }
    
    console.log(`[ChatTools] [${requestId}] get_my_payments: Found ${payments.length} pending records`);
    
    return {
        payments: payments.map(p => ({
            title: p.title,
            amount: p.amount,
            currency: p.currency,
            status: p.status, // 'pending', 'overdue'
            due_date: p.due_date ? p.due_date.toISOString().split('T')[0] : 'N/A'
        })),
        payment_guide: guide
    };
  } catch (error) {
    console.error(`[ChatTools] [${requestId}] get_my_payments Error: ${error.message}`);
    return { error: error.message };
  }
};

/**
 * Tool: search_course_materials
 * -----------------------------
 * Searches the extracted text content of uploaded course materials.
 * Used for Course Tutor queries like "What does the lecture say about recursion?".
 * 
 * @param {Object} params
 * @param {string} params.module_code - The module to search in.
 * @param {string} params.query - The search keyword/phrase.
 * @param {string} [params.requestId]
 * @returns {Array<Object>} List of matching text snippets from materials.
 */
const search_course_materials = async ({ module_code, query, requestId = 'tool' }) => {
  try {
    console.log(`[ChatTools] [${requestId}] search_course_materials: Searching '${query}' in ${module_code}`);
    
    if (!module_code || !query) {
      return { error: "Missing module_code or query." };
    }

    const module = await Module.findOne({ module_code });
    if (!module) {
      return { error: `Module ${module_code} not found.` };
    }

    const results = [];
    const searchRegex = new RegExp(query, 'i'); // Case-insensitive

    for (const material of module.materials) {
      if (material.text_content && searchRegex.test(material.text_content)) {
        // Find the index of the match
        const matchIndex = material.text_content.search(searchRegex);
        
        // Extract a snippet (e.g., 200 chars before and after)
        const start = Math.max(0, matchIndex - 200);
        const end = Math.min(material.text_content.length, matchIndex + 200 + query.length);
        const snippet = material.text_content.substring(start, end).replace(/\s+/g, ' ').trim(); // Clean whitespace

        results.push({
          source_title: material.title,
          category: material.category,
          snippet: `...${snippet}...`
        });
      }
    }

    if (results.length === 0) {
      console.log(`[ChatTools] [${requestId}] search_course_materials: No matches found.`);
      return { message: "No relevant information found in the course materials for this query." };
    }

    console.log(`[ChatTools] [${requestId}] search_course_materials: Found ${results.length} matches.`);
    // Limit to top 3 results to save context
    return results.slice(0, 3);

  } catch (error) {
    console.error(`[ChatTools] [${requestId}] search_course_materials Error: ${error.message}`);
    return { error: error.message };
  }
};

module.exports = {
  get_student_profile,
  get_enrolled_modules,
  get_my_schedule,
  get_module_info,
  get_my_payments,
  get_public_events,
  search_course_materials
};

const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

// Fallback models in order of preference
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

// Helper function to generate content with model fallback
const generateWithFallback = async (prompt) => {
  let lastError = null;
  
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const result = await genAI.models.generateContent({
        model: model,
        contents: prompt,
      });
      console.log(`Success with model: ${model}`);
      return { success: true, text: result.text, model };
    } catch (error) {
      console.log(`Model ${model} failed:`, error.message);
      lastError = error;
      
      // If it's not a rate limit error, don't try other models
      if (error.status !== 429) {
        break;
      }
    }
  }
  
  // All models failed, extract useful error info
  const errorInfo = parseRateLimitError(lastError);
  return { success: false, error: errorInfo };
};

// Parse rate limit error to get retry time
const parseRateLimitError = (error) => {
  if (error?.status === 429) {
    const message = error.message || "";
    const retryMatch = message.match(/retry in (\d+\.?\d*)/i);
    const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
    
    return {
      type: "RATE_LIMIT",
      message: `AI quota exceeded. Please try again in ${retrySeconds} seconds.`,
      retryAfter: retrySeconds
    };
  }
  
  return {
    type: "ERROR",
    message: "AI service temporarily unavailable. Please try again later."
  };
};

const genai = async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await generateWithFallback(prompt);
    
    if (result.success) {
      res.status(200).send(result.text);
    } else {
      res.status(429).json({ msg: result.error.message, retryAfter: result.error.retryAfter });
    }
  } catch (error) {
    res.status(400).send("Having an issue while generating :(");
  }
};

// Generate task title and content from a prompt
const generateTask = async (req, res) => {
  try {
    const { prompt } = req.body;

    const systemPrompt = `You are a task generation assistant. Based on the user's prompt, generate a task with a title and content/notes.
        
    Rules:
    - Title should be concise and action-oriented (max 40 characters)
    - Content should provide helpful details or steps (max 500 characters)
    - Return ONLY valid JSON in this exact format: {"title": "your title", "content": "your content"}
    - Do not include any other text, markdown, or explanation

    User prompt: ${prompt}`;

    const result = await generateWithFallback(systemPrompt);
    
    if (!result.success) {
      return res.status(429).json({ msg: result.error.message, retryAfter: result.error.retryAfter });
    }

    // Parse the JSON response
    const cleanText = result.text.replace(/```json\n?|\n?```/g, "").trim();
    const taskData = JSON.parse(cleanText);

    res.status(200).json({
      title: taskData.title?.substring(0, 40) || "",
      content: taskData.content?.substring(0, 500) || "",
    });
  } catch (error) {
    console.error("Task generation error:", error);
    res.status(400).json({ msg: "Failed to generate task. Please try again." });
  }
};

// Generate daily motivational quote
const getDailyMotivation = async (req, res) => {
  try {
    const { username } = req.body;

    const systemPrompt = `Generate a short, inspiring motivational quote about productivity, goals, or getting things done. 
        
        Rules:
        - Keep it under 100 characters
        - Make it encouraging and actionable
        - Personalize it slightly for "${username || "friend"}"
        - Return ONLY valid JSON: {"quote": "your quote", "emoji": "relevant emoji"}
        - No markdown or extra text`;

    const result = await generateWithFallback(systemPrompt);
    
    if (!result.success) {
      // Return default motivation instead of error for better UX
      return res.status(200).json({
        quote: "Every task completed is a step toward your goals!",
        emoji: "🚀",
      });
    }

    const cleanText = result.text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanText);

    res.status(200).json({
      quote: data.quote || "Every task completed is a step toward your goals!",
      emoji: data.emoji || "🚀",
    });
  } catch (error) {
    console.error("Motivation generation error:", error);
    res.status(200).json({
      quote: "Every task completed is a step toward your goals!",
      emoji: "🚀",
    });
  }
};

// Generate smart task suggestions based on existing tasks
const getSmartSuggestions = async (req, res) => {
  try {
    const { existingTasks } = req.body;

    const taskList =
      existingTasks
        ?.slice(0, 10)
        .map((t) => t.name)
        .join(", ") || "";

    const systemPrompt = `Based on these existing tasks: "${taskList}", suggest 3 new related tasks the user might want to add.

        Rules:
        - Each suggestion should be concise (max 40 characters)
        - Make them relevant and complementary to existing tasks
        - If no tasks provided, suggest general productivity tasks
        - Return ONLY valid JSON array: [{"title": "task1", "reason": "brief reason"}, ...]
        - No markdown or extra text`;

    const result = await generateWithFallback(systemPrompt);
    
    if (!result.success) {
      return res.status(429).json({ msg: result.error.message, retryAfter: result.error.retryAfter });
    }

    const cleanText = result.text.replace(/```json\n?|\n?```/g, "").trim();
    const suggestions = JSON.parse(cleanText);

    res.status(200).json({ suggestions: suggestions.slice(0, 3) });
  } catch (error) {
    console.error("Suggestions generation error:", error);
    res.status(400).json({ msg: "Failed to generate suggestions." });
  }
};

// Break down a complex task into subtasks
const breakdownTask = async (req, res) => {
  try {
    const { taskName, taskNotes } = req.body;

    const systemPrompt = `Break down this task into 3-5 smaller, actionable subtasks:
        Task: "${taskName}"
        ${taskNotes ? `Details: "${taskNotes}"` : ""}

        Rules:
        - Each subtask should be specific and actionable
        - Title max 40 characters, notes max 500 characters
        - Return ONLY valid JSON array: [{"title": "subtask title", "notes": "brief details"}, ...]
        - No markdown or extra text`;

    const result = await generateWithFallback(systemPrompt);
    
    if (!result.success) {
      return res.status(429).json({ msg: result.error.message, retryAfter: result.error.retryAfter });
    }

    const cleanText = result.text.replace(/```json\n?|\n?```/g, "").trim();
    const subtasks = JSON.parse(cleanText);

    res.status(200).json({
      subtasks: subtasks.slice(0, 5).map((t) => ({
        title: t.title?.substring(0, 40) || "",
        notes: t.notes?.substring(0, 500) || "",
      })),
    });
  } catch (error) {
    console.error("Task breakdown error:", error);
    res.status(400).json({ msg: "Failed to break down task." });
  }
};

module.exports = {
  genai,
  generateTask,
  getDailyMotivation,
  getSmartSuggestions,
  breakdownTask,
};

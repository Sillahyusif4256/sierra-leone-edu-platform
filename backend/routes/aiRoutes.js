// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// System prompt for EduShare AI
const SYSTEM_PROMPT = `You are EduShare AI, a friendly study assistant specifically designed for Sierra Leone students preparing for BECE and WASSCE examinations. You explain concepts clearly and simply, relate examples to Sierra Leone context where possible, and encourage students in their studies.

Guidelines:
- Keep responses concise and easy to understand
- Use Sierra Leone examples when relevant (e.g., local geography, culture, current events)
- Focus on BECE and WASSCE curriculum topics
- Be encouraging and supportive
- If you don't know something, admit it and suggest where the student can find more information
- Use simple language appropriate for secondary school students`;

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, subject, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Google Gemini API key is not configured' });
    }

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT;
    
    if (subject) {
      conversationContext += `\n\nCurrent Subject: ${subject}`;
    }

    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext += '\n\nPrevious conversation:\n';
      conversationHistory.forEach((msg, index) => {
        if (msg.role === 'user') {
          conversationContext += `Student: ${msg.content}\n`;
        } else {
          conversationContext += `EduShare AI: ${msg.content}\n`;
        }
      });
    }

    conversationContext += `\n\nCurrent question: ${message}`;

    // Call Google Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(conversationContext);
    const response = result.response;
    const aiResponse = response.text();

    res.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

module.exports = router;

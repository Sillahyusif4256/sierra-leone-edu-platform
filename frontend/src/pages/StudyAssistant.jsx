// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { useState, useRef, useEffect } from 'react';
import { FiSend, FiCopy, FiTrash2 } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const StudyAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Geography', 'ICT', 'Biology', 'Chemistry', 'Physics'];

  const suggestedQuestions = [
    "Explain photosynthesis",
    "Help me with quadratic equations",
    "Summarize the causes of WW2",
    "Practice WASSCE English questions"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSendMessage = async (messageText) => {
    const userMessage = messageText || input.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setTyping(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMessage,
        subject,
        conversationHistory: messages
      });

      setMessages([...newMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sl-blue to-sl-green p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-white text-2xl">✨</span>
                <h1 className="text-2xl font-bold text-white">EduShare AI Assistant</h1>
              </div>
              <button
                onClick={handleClearChat}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                <FiTrash2 />
                <span>Clear Chat</span>
              </button>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-white font-medium">Subject:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl text-sl-green mx-auto mb-4 block">✨</span>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome to EduShare AI!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your friendly study assistant for BECE and WASSCE preparation
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Try asking:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="px-4 py-2 bg-sl-green/10 text-sl-green rounded-lg hover:bg-sl-green/20 transition text-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-sl-blue text-white'
                      : 'bg-sl-green/10 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sl-green">EduShare AI</span>
                      <button
                        onClick={() => handleCopyResponse(message.content)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Copy response"
                      >
                        <FiCopy />
                      </button>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-sl-green/10 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-sl-green rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sl-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-sl-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your studies..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-sl-blue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FiSend />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyAssistant;

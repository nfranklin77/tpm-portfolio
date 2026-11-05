"use client";

import React, { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function RagChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "System initialized. Air-gapped connection established. How can I assist you with the NIST AI RMF guidelines today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom as new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user's message to the chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Add an empty AI message to the array
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let done = false;
      let fullAiResponse = ""; // <-- Create a local accumulator
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          fullAiResponse += chunk; // <-- Add chunk to the local string
          
          // Update state by overwriting with the fully accumulated string
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "ai",
              content: fullAiResponse
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "[Error: Unable to reach the local RAG engine.]" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold tracking-wide text-slate-200">Llama 3.2 Air-Gapped Engine</span>
        </div>
      </div>
      
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-emerald-900/40 text-emerald-100 border border-emerald-800/50 rounded-br-none" 
                  : "bg-slate-800 text-slate-300 border border-slate-700 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-800 bg-slate-950/50 p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Query the NIST AI RMF..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-4 pr-12 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-slate-950 transition-colors hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500"
          >
            <span className="text-lg font-bold">↑</span>
          </button>
        </div>
      </form>
      
    </div>
  );
}
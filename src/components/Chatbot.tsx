import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Vouchify assistant. How can I help you find the perfect offer today?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! I can help you find offers in Food & Drink, Beauty & Spa, Health & Fitness, and more. What are you interested in?",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-300"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-xl">
            <h3 className="font-bold text-lg">Vouchify Assistant</h3>
            <p className="text-sm opacity-90">We're here to help!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
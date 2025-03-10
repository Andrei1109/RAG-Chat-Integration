"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";

let socket: any;

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetch("/api/socket");
    socket = io({ path: "/api/socket" });

    socket.on("aiMessage", (data: { text: string }) => {
      setChatLog((prev) => [...prev, { sender: "AI", text: data.text }]);
      setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message) return;
    setChatLog((prev) => [...prev, { sender: "User", text: message }]);
    socket.emit("userMessage", { text: message });
    setMessage("");
    setIsTyping(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>RAG Chat Interface</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "400px",
          overflowY: "scroll",
        }}
      >
        {chatLog.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <strong>{msg.sender}: </strong>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isTyping && <em>AI is typing...</em>}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
}

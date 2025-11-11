"use client";

import { useState, useEffect } from "react";

type HistoryItem = {
  id: string;
  idea: string;
  prompt: string;
  timestamp: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "history">("home");
  const [idea, setIdea] = useState("");
  const [latestPrompt, setLatestPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("promptDostHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("promptDostHistory", JSON.stringify(history));
  }, [history]);

  const generatePrompt = async () => {
    if (!idea.trim()) {
      setError("कृपया कोई विचार लिखें!");
      return;
    }
    setError("");
    setLoading(true);
    setLatestPrompt(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: idea.trim(),
          referer: window.location.origin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          idea: idea.trim(),
          prompt: data.prompt,
          timestamp: Date.now(),
        };
        setHistory((prev) => [newItem, ...prev]);
        setLatestPrompt(data.prompt);
        setIdea("");
      } else {
        setError(data.error || "कुछ गड़बड़ हुई।");
      }
    } catch (err) {
      setError("नेटवर्क त्रुटि। इंटरनेट चेक करें।");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("प्रॉम्प्ट कॉपी हो गया!");
  };

  const clearHistory = () => {
    if (confirm("क्या आप पूरा इतिहास मिटाना चाहते हैं?")) {
      setHistory([]);
      localStorage.removeItem("promptDostHistory");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(to bottom, #f0f9ff, #e0f2fe)",
        minHeight: "100vh",
        paddingBottom: "70px",
        color: "#1e293b",
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ fontSize: "1.7rem", fontWeight: "700", color: "#4f46e5", margin: 0 }}>
          ✨ PromptDost
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          AI के लिए परफेक्ट प्रॉम्प्ट बनाएं
        </p>
      </header>

      <main style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
        {activeTab === "home" && (
          <div>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="जैसे: मुझे UPSC के लिए नोट्स चाहिए"
              style={{
                width: "100%",
                height: "120px",
                padding: "14px",
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                resize: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            />
            {error && <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>{error}</p>}
            <button
              onClick={generatePrompt}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "1rem",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              }}
            >
              {loading ? "बना रहा है... 🤖" : "प्रॉम्प्ट बनाएं"}
            </button>

            {latestPrompt && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>आपका प्रॉम्प्ट:</h3>
                <pre
                  style={{
                    background: "#f0f9ff",
                    padding: "16px",
                    borderRadius: "12px",
                    border: "1px solid #bae6fd",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "15px",
                    lineHeight: 1.5,
                  }}
                >
                  {latestPrompt}
                </pre>
                <button
                  onClick={() => copyToClipboard(latestPrompt)}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "12px",
                    background: "#dbeafe",
                    border: "1px solid #93c5fd",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  कॉपी ✅
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.4rem", margin: 0 }}>इतिहास</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  साफ़ करें
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "2rem" }}>
                अभी तक कोई इतिहास नहीं है।
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "16px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>
                      {formatDate(item.timestamp)} • विचार: {item.idea}
                    </div>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "15px",
                        margin: "8px 0",
                        lineHeight: 1.5,
                        background: "#f8fafc",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      {item.prompt}
                    </pre>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        onClick={() => copyToClipboard(item.prompt)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          borderRadius: "12px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        कॉपी ✅
                      </button>
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(item.prompt);
                          window.open(`https://wa.me/?text=${text}`, "_blank");
                        }}
                        style={{
                          flex: 1,
                          padding: "8px",
                          background: "#dcfce7",
                          border: "1px solid #bbf7d0",
                          borderRadius: "12px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        शेयर 📲
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px 0",
          borderTop: "1px solid #e2e8f0",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={() => setActiveTab("home")}
          style={{
            background: "none",
            border: "none",
            color: activeTab === "home" ? "#4f46e5" : "#94a3b8",
            fontSize: "14px",
            fontWeight: activeTab === "home" ? "600" : "normal",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>🏠</span>
          <span>होम</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            background: "none",
            border: "none",
            color: activeTab === "history" ? "#4f46e5" : "#94a3b8",
            fontSize: "14px",
            fontWeight: activeTab === "history" ? "600" : "normal",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>🕒</span>
          <span>इतिहास</span>
        </button>
      </nav>
    </div>
  );
}

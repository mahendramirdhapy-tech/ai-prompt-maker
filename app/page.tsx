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

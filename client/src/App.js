import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>Code Review AI</h1>
        <p>Get instant feedback on your code</p>
      </header>

      <div className="main">
        {/* LEFT PANEL */}
        <div className="panel">
          <h3>Input</h3>
          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button onClick={analyzeCode}>
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel output">
          <h3>Review</h3>

          {result ? (
            <pre>{result}</pre>
          ) : (
            <div className="empty">
              <p>No review yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
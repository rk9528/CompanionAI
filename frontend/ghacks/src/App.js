import React, { useState } from "react";
import SpeedGraph from "./components/SpeedGraph";
import AccuracyGraph from "./components/AccuracyGraph";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!audioFile || !duration) {
      alert("Upload audio file and enter duration");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("duration", duration);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Improvement message logic
  const getImprovementMessage = (res) => {
    const messages = [];

    if (res.wordAccuracy < 85)
      messages.push("Reduce filler words to improve clarity.");

    if (res.wpm < 110)
      messages.push("Try speaking slightly faster for better engagement.");

    if (res.wpm > 160)
      messages.push("Slow down your speech for better understanding.");

    if (res.pauseCount > 2)
      messages.push("Practice smoother sentence transitions.");

    if (messages.length === 0)
      messages.push("Excellent delivery. Maintain this speaking style.");

    return messages;
  };

  return (
    <div style={styles.container}>
      <h1>🎤 Interview Confidence Analyzer</h1>

      <div style={styles.card}>
        <input type="file" accept=".wav,.m4a" onChange={handleFileChange} />

        <input
          type="number"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Audio"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.result}>
          <h2> Analysis Result</h2>

          <h3>Confidence Score: {result.confidenceScore}/100</h3>

          <p><strong>Transcript:</strong></p>
          <p style={styles.transcript}>{result.transcript}</p>

          <ul>
            <li>Filler Words: {result.fillerCount}</li>
            <li>Speaking Speed: {result.speed} ({result.wpm} WPM)</li>
            <li>Pauses Detected: {result.pauseCount}</li>
            <li>Confidence Drop: {result.confidenceDrop ? "Yes" : "No"}</li>
            <li>Word Accuracy: {result.wordAccuracy}%</li>
          </ul>

          {/* Graph Section */}
          <div style={styles.graphContainer}>
            <div style={styles.graphBox}>
              <h3>Speaking Speed</h3>
              <SpeedGraph wpm={result.wpm} />
            </div>

            <div style={styles.graphBox}>
              <h3>Word Accuracy</h3>
              <AccuracyGraph accuracy={result.wordAccuracy} />
            </div>
          </div>

          {/* Suggestions */}
          <h3>Suggestions</h3>
          <ul>
            {getImprovementMessage(result).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  result: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #4caf50",
    borderRadius: "8px"
  },
  transcript: {
    background: "#f9f9f9",
    padding: "10px",
    borderRadius: "5px"
  },
  graphContainer: {
    display: "flex",
    gap: "40px",
    marginTop: "30px",
    flexWrap: "wrap"
  },
  graphBox: {
    width: "400px"
  },
  error: {
    color: "red",
    marginTop: "10px"
  }
};

export default App;

import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";

// Definitions for each sentiment
const definitions = {
  Positive: {
    description: "Expressing favorable, good, or happy sentiment.",
    examples: [
      "I love this!",
      "Amazing experience",
      "So happy with the results",
      "Fantastic job",
      "Feeling great today",
      "This is wonderful",
      "I am thrilled",
      "Best day ever",
      "Highly recommend",
      "Absolutely perfect",
    ],
  },
  Neutral: {
    description: "Neither positive nor negative sentiment.",
    examples: [
      "I went to the store today",
      "It is raining outside",
      "I have a meeting at 10am",
      "Just another day",
      "The event starts at 5pm",
      "I am reading a book",
      "The sky is cloudy",
      "I need to buy groceries",
      "Traffic is bad today",
      "Lunch was okay",
    ],
  },
  Negative: {
    description: "Expressing unfavorable, bad, or unhappy sentiment.",
    examples: [
      "I hate this",
      "This is terrible",
      "Feeling sad today",
      "Worst experience ever",
      "I am frustrated",
      "Absolutely disappointed",
      "So angry right now",
      "Not happy with this",
      "This ruined my day",
      "Very poor service",
    ],
  },
};

// History component with delete option
function History({ history, setHistory }) {
  const handleDelete = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  return (
    <div className="mt-5" style={{ maxWidth: "700px", margin: "auto" }}>
      <h3>Analysis History</h3>
      {history.length === 0 && <p>No history yet.</p>}
      {history.length > 0 && (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Tweet</th>
              <th>Sentiment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx}>
                <td>{item.text}</td>
                <td>{item.sentiment}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Sentiment Page Component
function SentimentPage({ sentiment }) {
  const data = definitions[sentiment];

  return (
    <div className="container mt-5">
      <h2>{sentiment} Sentiment</h2>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Examples:</strong></p>
      <ul>
        {data.examples.map((ex, idx) => (
          <li key={idx}>{ex}</li>
        ))}
      </ul>
    </div>
  );
}

// Home page with input and analysis
function Home({ history, setHistory }) {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState("");

  const analyzeTweet = async () => {
    if (!tweet.trim()) return;

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", {
        text: tweet,
      });
      const result = response.data.sentiment;

      setSentiment(result);
      setHistory([{ text: tweet, sentiment: result }, ...history]);
      setTweet("");
    } catch (error) {
      console.error(error);
      setSentiment("Error analyzing tweet");
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-3">Enter a Tweet for Sentiment Analysis</h2>
      <textarea
        className="form-control mb-3 mx-auto"
        style={{ maxWidth: "600px" }}
        rows="4"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="Type your tweet here..."
      />
      <button className="btn btn-primary mb-4" onClick={analyzeTweet}>
        Analyze Sentiment
      </button>

      {/* Sentiment Result */}
      {sentiment && (
      <div
        className="mb-4 p-3 rounded"
        style={{
          maxWidth: "600px",
          margin: "auto",
          backgroundColor:
            sentiment === "Positive"
              ? "#28a745"   // green
              : sentiment === "Negative"
              ? "#dc3545"   // red
              : "#6c757d",  // gray for Neutral
          color: "#ffffff", // white text for all for readability
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Sentiment: {sentiment}
      </div>
    )}

      {/* History */}
      <History history={history} setHistory={setHistory} />
    </div>
  );
}

// Main App Component
function App() {
  const [history, setHistory] = useState([]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">
      Twitter Sentiment
    </Link>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/positive">
            Positive
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/neutral">
            Neutral
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/negative">
            Negative
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>


      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home history={history} setHistory={setHistory} />} />
        <Route path="/positive" element={<SentimentPage sentiment="Positive" />} />
        <Route path="/neutral" element={<SentimentPage sentiment="Neutral" />} />
        <Route path="/negative" element={<SentimentPage sentiment="Negative" />} />
      </Routes>
    </div>
  );
}

export default App;



// import React, { useState } from "react";
// import axios from "axios";
//
// function App() {
//   const [tweet, setTweet] = useState("");
//   const [sentiment, setSentiment] = useState("");
//   const [history, setHistory] = useState([]);
//
//   const analyzeTweet = async () => {
//     if (!tweet.trim()) return;
//
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/analyze", {
//         text: tweet,
//       });
//       const result = response.data.sentiment;
//
//       setSentiment(result);
//       setHistory([{ text: tweet, sentiment: result }, ...history]); // add to history
//       setTweet(""); // clear input
//     } catch (error) {
//       console.error(error);
//       setSentiment("Error analyzing tweet");
//     }
//   };
//
//   const definitions = {
//     Positive: {
//       description: "Expressing favorable, good, or happy sentiment.",
//       examples: [
//         "I love this!",
//         "Amazing experience",
//         "So happy with the results",
//         "Fantastic job",
//         "Feeling great today",
//         "This is wonderful",
//         "I am thrilled",
//         "Best day ever",
//         "Highly recommend",
//         "Absolutely perfect",
//       ],
//     },
//     Neutral: {
//       description: "Neither positive nor negative sentiment.",
//       examples: [
//         "I went to the store today",
//         "It is raining outside",
//         "I have a meeting at 10am",
//         "Just another day",
//         "The event starts at 5pm",
//         "I am reading a book",
//         "The sky is cloudy",
//         "I need to buy groceries",
//         "Traffic is bad today",
//         "Lunch was okay",
//       ],
//     },
//     Negative: {
//       description: "Expressing unfavorable, bad, or unhappy sentiment.",
//       examples: [
//         "I hate this",
//         "This is terrible",
//         "Feeling sad today",
//         "Worst experience ever",
//         "I am frustrated",
//         "Absolutely disappointed",
//         "So angry right now",
//         "Not happy with this",
//         "This ruined my day",
//         "Very poor service",
//       ],
//     },
//   };
//
//   return (
//     <div className="container mt-5">
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             Twitter Sentiment
//           </a>
//           <div className="collapse navbar-collapse">
//             <ul className="navbar-nav ms-auto">
//               {Object.keys(definitions).map((key) => (
//                 <li className="nav-item dropdown" key={key}>
//                   <a
//                     className="nav-link dropdown-toggle"
//                     href="#"
//                     role="button"
//                     data-bs-toggle="dropdown"
//                   >
//                     {key}
//                   </a>
//                   <ul className="dropdown-menu">
//                     <li>
//                       <strong>Description:</strong> {definitions[key].description}
//                     </li>
//                     <li>
//                       <strong>Examples:</strong>
//                       <ul>
//                         {definitions[key].examples.map((ex, i) => (
//                           <li key={i}>{ex}</li>
//                         ))}
//                       </ul>
//                     </li>
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </nav>
//
//       {/* Main content */}
//       <div className="text-center">
//         <h2 className="mb-3">Enter a Tweet for Sentiment Analysis</h2>
//         <textarea
//           className="form-control mb-3 mx-auto"
//           style={{ maxWidth: "600px" }}
//           rows="4"
//           value={tweet}
//           onChange={(e) => setTweet(e.target.value)}
//           placeholder="Type your tweet here..."
//         />
//         <button className="btn btn-primary mb-4" onClick={analyzeTweet}>
//           Analyze Sentiment
//         </button>
//
//         {/* Sentiment Result */}
//         {sentiment && (
//           <div className="alert alert-info" style={{ maxWidth: "600px", margin: "auto" }}>
//             <h4>Sentiment: {sentiment}</h4>
//           </div>
//         )}
//
//         {/* History */}
//         {history.length > 0 && (
//           <div className="mt-5" style={{ maxWidth: "700px", margin: "auto" }}>
//             <h3>Analysis History</h3>
//             <table className="table table-striped table-bordered">
//               <thead>
//                 <tr>
//                   <th>Tweet</th>
//                   <th>Sentiment</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((item, idx) => (
//                   <tr key={idx}>
//                     <td>{item.text}</td>
//                     <td>{item.sentiment}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default App;


// import React, { useState } from "react";
// import axios from "axios";
//
// function App() {
//   const [tweet, setTweet] = useState("");
//   const [sentiment, setSentiment] = useState("");
//
//   const analyzeTweet = async () => {
//     if (!tweet.trim()) return; // ignore empty input
//
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/analyze", {
//         text: tweet,
//       });
//       setSentiment(response.data.sentiment);
//       setTweet(""); // reset textarea after getting sentiment
//     } catch (error) {
//       console.error(error);
//       setSentiment("Error analyzing tweet");
//     }
//   };
//
//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>Twitter Sentiment Analyzer</h1>
//       <textarea
//         rows="4"
//         cols="50"
//         value={tweet}
//         onChange={(e) => setTweet(e.target.value)}
//         placeholder="Enter a tweet here"
//       />
//       <br />
//       <button onClick={analyzeTweet} style={{ marginTop: "10px" }}>
//         Analyze Sentiment
//       </button>
//       <h2>
//         {sentiment && (
//           <>
//             Sentiment: <span>{sentiment}</span>
//           </>
//         )}
//       </h2>
//     </div>
//   );
// }
//
// export default App;

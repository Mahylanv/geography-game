import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FlagsQuiz from "./FlagsQuiz";
import CapitalsQuiz from "./CapitalsQuiz";

function Home() {
  return (
    <div>
      <h1>Bienvenue sur GeoDex</h1>
      <Link to="/flags"><button>Quiz Drapeaux</button></Link>
      <Link to="/capitals"><button>Quiz Capitales</button></Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flags" element={<FlagsQuiz />} />
        <Route path="/capitals" element={<CapitalsQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./Home";
import FlagsQuiz from "./FlagsQuiz";
import CapitalsQuiz from "./CapitalsQuiz";
import CountriesList from "./CountriesList";

function App() {
    return (
        <Router>
            <nav className="bg-gray-900 text-white py-4 shadow-lg">
                <div className="container mx-auto flex justify-center gap-6">
                    <NavLink to="/" className={({ isActive }) =>
                        `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                    }>🏠 Accueil</NavLink>

                    <NavLink to="/flags" className={({ isActive }) =>
                        `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                    }>🏳️ Quiz Drapeaux</NavLink>

                    <NavLink to="/capitals" className={({ isActive }) =>
                        `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                    }>🏛️ Quiz Capitales</NavLink>

                    <NavLink to="/countries" className={({ isActive }) =>
                        `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                    }>🌍 Liste des Pays</NavLink>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flags" element={<FlagsQuiz />} />
                <Route path="/capitals" element={<CapitalsQuiz />} />
                <Route path="/countries" element={<CountriesList />} />
            </Routes>
        </Router>
    );
}

export default App;

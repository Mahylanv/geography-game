import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import FlagsQuiz from "./FlagsQuiz";
import CapitalsQuiz from "./CapitalsQuiz";
import CountriesList from "./CountriesList";
import BlurredFlagsQuiz from "./BlurredFlagQuiz";


function App() {
    const [isOpen, setIsOpen] = useState(false);

    // Fermeture du menu sur "Échap"
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <Router>
            {/* Navbar */}
            <nav className="bg-gray-900 text-white py-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center px-4 md:px-0">

                    {/* Menu Desktop Centré */}
                    <div className="hidden md:flex flex-1 justify-center gap-6">
                        <NavLink to="/" className={({ isActive }) =>
                            `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                        }>🏠 Accueil</NavLink>

                        <NavLink to="/flags" className={({ isActive }) =>
                            `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                        }>🏳️ Quiz Drapeaux</NavLink>

                        <NavLink to="/capitals" className={({ isActive }) =>
                            `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                        }>🏛️ Quiz Capitales</NavLink>
                        <NavLink to="/blurred-flags" className={({ isActive }) =>
                            `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                        }>🌫️ Drapeau Flou</NavLink>
                        <NavLink to="/countries" className={({ isActive }) =>
                            `px-4 py-2 rounded ${isActive ? "bg-blue-800" : "hover:bg-gray-700"}`
                        }>🌍 Liste des Pays</NavLink>
                    </div>

                    {/* Bouton Burger Mobile (placé à droite) */}
                    <button
                        className="md:hidden focus:outline-none text-2xl"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✖" : "☰"}
                    </button>
                </div>

                {/* Menu Mobile */}
                {isOpen && (
                    <div
                        className="md:hidden bg-gray-800 text-center py-4 space-y-4 absolute w-full top-16 left-0 shadow-lg transition-all z-10"
                        onClick={() => setIsOpen(false)} // Ferme en cliquant sur un lien
                    >
                        <NavLink to="/" className="block hover:text-lime-400">🏠 Accueil</NavLink>
                        <NavLink to="/flags" className="block hover:text-lime-400">🏳️ Quiz Drapeaux</NavLink>
                        <NavLink to="/capitals" className="block hover:text-lime-400">🏛️ Quiz Capitales</NavLink>
                        <NavLink to="/blurred-flags" className="block hover:text-lime-400">🌫️ Drapeau flou</NavLink>
                        <NavLink to="/countries" className="block hover:text-lime-400">🌍 Liste des Pays</NavLink>
                    </div>
                )}
            </nav>

            {/* Contenu */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flags" element={<FlagsQuiz />} />
                <Route path="/capitals" element={<CapitalsQuiz />} />
                <Route path="/countries" element={<CountriesList />} />
                <Route path="/blurred-flags" element={<BlurredFlagsQuiz />} />
            </Routes>
        </Router>
    );
}

export default App;

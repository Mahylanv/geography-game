import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import FlagsQuiz from "./FlagsQuiz";
import CapitalsQuiz from "./CapitalsQuiz";
import CountriesList from "./CountriesList";
import BlurredFlagsQuiz from "./BlurredFlagQuiz";
import ContinentFlagsQuiz from "./continent/ContinentFlagQuizz";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setIsDropdownOpen(false);
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
                    {/* Menu Desktop  */}
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

                        {/*  Dropdown pour Continents */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
                            >
                                🌎 Continents ▾
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56">
                                    <NavLink to="/europe-flags" className="block px-4 py-2 hover:bg-gray-700">🇪🇺 Europe</NavLink>
                                    <NavLink to="/africa-flags" className="block px-4 py-2 hover:bg-gray-700">🌍 Afrique</NavLink>
                                    <NavLink to="/asia-flags" className="block px-4 py-2 hover:bg-gray-700">🌏 Asie</NavLink>
                                    <NavLink to="/north-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Nord</NavLink>
                                    <NavLink to="/south-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Sud</NavLink>
                                    <NavLink to="/oceania-flags" className="block px-4 py-2 hover:bg-gray-700">🌊 Océanie</NavLink>
                                </div>
                            )}
                        </div>
                    </div>

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
                        onClick={() => setIsOpen(false)}
                    >
                        <NavLink to="/" className="block hover:text-lime-400">🏠 Accueil</NavLink>
                        <NavLink to="/flags" className="block hover:text-lime-400">🏳️ Quiz Drapeaux</NavLink>
                        <NavLink to="/capitals" className="block hover:text-lime-400">🏛️ Quiz Capitales</NavLink>
                        <NavLink to="/blurred-flags" className="block hover:text-lime-400">🌫️ Drapeau flou</NavLink>
                        <NavLink to="/countries" className="block hover:text-lime-400">🌍 Liste des Pays</NavLink>

                        <div className="text-center">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="block w-full py-2 hover:text-lime-400"
                            >
                                🌎 Continents ▾
                            </button>
                            {isDropdownOpen && (
                                <div className="bg-gray-900 rounded shadow-lg py-2 w-full">
                                    <NavLink to="/europe-flags" className="block px-4 py-2 hover:bg-gray-700">🇪🇺 Europe</NavLink>
                                    <NavLink to="/africa-flags" className="block px-4 py-2 hover:bg-gray-700">🌍 Afrique</NavLink>
                                    <NavLink to="/asia-flags" className="block px-4 py-2 hover:bg-gray-700">🌏 Asie</NavLink>
                                    <NavLink to="/north-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Nord</NavLink>
                                    <NavLink to="/south-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Sud</NavLink>
                                    <NavLink to="/oceania-flags" className="block px-4 py-2 hover:bg-gray-700">🌊 Océanie</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flags" element={<FlagsQuiz />} />
                <Route path="/capitals" element={<CapitalsQuiz />} />
                <Route path="/countries" element={<CountriesList />} />
                <Route path="/blurred-flags" element={<BlurredFlagsQuiz />} />
                <Route path="/europe-flags" element={<ContinentFlagsQuiz continent="Europe" />} />
                <Route path="/africa-flags" element={<ContinentFlagsQuiz continent="Afrique" />} />
                <Route path="/asia-flags" element={<ContinentFlagsQuiz continent="Asie" />} />
                <Route path="/north-america-flags" element={<ContinentFlagsQuiz continent="Amérique du Nord" />} />
                <Route path="/south-america-flags" element={<ContinentFlagsQuiz continent="Amérique du Sud" />} />
                <Route path="/oceania-flags" element={<ContinentFlagsQuiz continent="Océanie" />} />
            </Routes>
        </Router>
    );
}

export default App;

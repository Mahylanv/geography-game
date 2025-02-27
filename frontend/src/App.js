import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import FlagsQuiz from "./FlagsQuiz";
import CapitalsQuiz from "./CapitalsQuiz";
import CountriesList from "./CountriesList";
import BlurredFlagsQuiz from "./BlurredFlagQuiz";
import ContinentFlagsQuiz from "./continent/ContinentFlagQuizz";
import ContinentCapitalsQuiz from "./continent/ContinentCapitalQuizz";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFlagsDropdownOpen, setIsFlagsDropdownOpen] = useState(false);
    const [isCapitalsDropdownOpen, setIsCapitalsDropdownOpen] = useState(false);

    // Fermeture du menu et des dropdowns avec "Échap"
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setIsFlagsDropdownOpen(false);
                setIsCapitalsDropdownOpen(false);
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

                    {/* 🖥️ Menu Desktop Centré */}
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

                        {/* 🌍 Dropdown pour les drapeaux par continent */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFlagsDropdownOpen(!isFlagsDropdownOpen)}
                                className="px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
                            >
                                🏳️ Drapeaux ▾
                            </button>
                            {isFlagsDropdownOpen && (
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

                        {/* 🏛️ Dropdown pour les capitales par continent */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCapitalsDropdownOpen(!isCapitalsDropdownOpen)}
                                className="px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
                            >
                                🏛️ Capitales ▾
                            </button>
                            {isCapitalsDropdownOpen && (
                                <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56">
                                    <NavLink to="/europe-capitals" className="block px-4 py-2 hover:bg-gray-700">🇪🇺 Europe</NavLink>
                                    <NavLink to="/africa-capitals" className="block px-4 py-2 hover:bg-gray-700">🌍 Afrique</NavLink>
                                    <NavLink to="/asia-capitals" className="block px-4 py-2 hover:bg-gray-700">🌏 Asie</NavLink>
                                    <NavLink to="/north-america-capitals" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Nord</NavLink>
                                    <NavLink to="/south-america-capitals" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Sud</NavLink>
                                    <NavLink to="/oceania-capitals" className="block px-4 py-2 hover:bg-gray-700">🌊 Océanie</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 🍔 Bouton Menu Mobile */}
                    <button className="md:hidden focus:outline-none text-2xl z-10" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? "✖" : "☰"}
                    </button>
                </div>
                {/* 📱 Menu Mobile */}
                {isOpen && (
                    <div className="md:hidden pt-20 fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center space-y-6 py-10 z-5">
                        <NavLink to="/" className="text-xl hover:text-lime-400" onClick={() => setIsOpen(false)}>🏠 Accueil</NavLink>
                        <NavLink to="/flags" className="text-xl hover:text-lime-400" onClick={() => setIsOpen(false)}>🏳️ Quiz Drapeaux</NavLink>
                        <NavLink to="/capitals" className="text-xl hover:text-lime-400" onClick={() => setIsOpen(false)}>🏛️ Quiz Capitales</NavLink>
                        <NavLink to="/blurred-flags" className="text-xl hover:text-lime-400" onClick={() => setIsOpen(false)}>🌫️ Drapeau Flou</NavLink>
                        <NavLink to="/countries" className="text-xl hover:text-lime-400" onClick={() => setIsOpen(false)}>🌍 Liste des Pays</NavLink>
                            <button
                                onClick={() => setIsFlagsDropdownOpen(!isFlagsDropdownOpen)}
                            className=" text-xl rounded hover:bg-gray-700 flex items-center gap-2"
                            >
                                🏳️ Drapeaux ▾
                            </button>
                            {isFlagsDropdownOpen && (
                                <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56">
                                    <NavLink to="/europe-flags" className="block px-4 py-2 hover:bg-gray-700">🇪🇺 Europe</NavLink>
                                    <NavLink to="/africa-flags" className="block px-4 py-2 hover:bg-gray-700">🌍 Afrique</NavLink>
                                    <NavLink to="/asia-flags" className="block px-4 py-2 hover:bg-gray-700">🌏 Asie</NavLink>
                                    <NavLink to="/north-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Nord</NavLink>
                                    <NavLink to="/south-america-flags" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Sud</NavLink>
                                    <NavLink to="/oceania-flags" className="block px-4 py-2 hover:bg-gray-700">🌊 Océanie</NavLink>
                                </div>
                            )}

                            <button
                                onClick={() => setIsCapitalsDropdownOpen(!isCapitalsDropdownOpen)}
                            className="text-xl rounded hover:bg-gray-700 flex items-center gap-2"
                            >
                                🏛️ Capitales ▾
                            </button>
                            {isCapitalsDropdownOpen && (
                                <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56">
                                    <NavLink to="/europe-capitals" className="block px-4 py-2 hover:bg-gray-700">🇪🇺 Europe</NavLink>
                                    <NavLink to="/africa-capitals" className="block px-4 py-2 hover:bg-gray-700">🌍 Afrique</NavLink>
                                    <NavLink to="/asia-capitals" className="block px-4 py-2 hover:bg-gray-700">🌏 Asie</NavLink>
                                    <NavLink to="/north-america-capitals" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Nord</NavLink>
                                    <NavLink to="/south-america-capitals" className="block px-4 py-2 hover:bg-gray-700">🌎 Amérique du Sud</NavLink>
                                    <NavLink to="/oceania-capitals" className="block px-4 py-2 hover:bg-gray-700">🌊 Océanie</NavLink>
                                </div>
                            )}
                    </div>
                )}
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/flags" element={<FlagsQuiz />} />
                <Route path="/capitals" element={<CapitalsQuiz />} />
                <Route path="/countries" element={<CountriesList />} />
                <Route path="/blurred-flags" element={<BlurredFlagsQuiz />} />

                {/* Routes pour les drapeaux par continent */}
                <Route path="/europe-flags" element={<ContinentFlagsQuiz continent="Europe" />} />
                <Route path="/africa-flags" element={<ContinentFlagsQuiz continent="Afrique" />} />
                <Route path="/asia-flags" element={<ContinentFlagsQuiz continent="Asie" />} />
                <Route path="/north-america-flags" element={<ContinentFlagsQuiz continent="Amérique du Nord" />} />
                <Route path="/south-america-flags" element={<ContinentFlagsQuiz continent="Amérique du Sud" />} />
                <Route path="/oceania-flags" element={<ContinentFlagsQuiz continent="Océanie" />} />

                {/* Routes pour les capitales par continent */}
                <Route path="/europe-capitals" element={<ContinentCapitalsQuiz continent="Europe" />} />
                <Route path="/africa-capitals" element={<ContinentCapitalsQuiz continent="Afrique" />} />
                <Route path="/asia-capitals" element={<ContinentCapitalsQuiz continent="Asie" />} />
                <Route path="/north-america-capitals" element={<ContinentCapitalsQuiz continent="Amérique du Nord" />} />
                <Route path="/south-america-capitals" element={<ContinentCapitalsQuiz continent="Amérique du Sud" />} />
                <Route path="/oceania-capitals" element={<ContinentCapitalsQuiz continent="Océanie" />} />

                {/* Gestion des erreurs 404 */}
                <Route path="*" element={<h1 className="text-center text-3xl text-red-500 mt-10">Page non trouvée</h1>} />
            </Routes>
        </Router>
    );
}

export default App;

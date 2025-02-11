import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white text-center">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Bienvenue sur <span className="text-yellow-300">GeoDex</span></h1>
            <p className="text-lg mb-6">Testez vos connaissances en géographie !</p>
            <div className="flex gap-4">
                <Link to="/flags" className="px-8 py-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
                    🏳️ Quiz Drapeaux
                </Link>
                <Link to="/capitals" className="px-8 py-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
                    🏛️ Quiz Capitales
                </Link>
            </div>
        </div>
    );
};

export default Home;

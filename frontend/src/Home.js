import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center h-screen bg-gradient-to-r from-blue-400 to-indigo-800 text-white text-center pt-36 sm:pt-48 px-4">
            {/* 🌍 Image animée */}
            <img
                src="https://static.vecteezy.com/system/resources/thumbnails/011/578/174/small_2x/earth-ball-graphic-isolated-png.png"
                alt="Earth"
                className="w-32 h-32 mb-12 animate-bounce"
            />

            {/* 🏆 Titre */}
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Bienvenue sur <span className="text-lime-400">GeoDex</span>
            </h1>
            <p className="text-lg mb-6">Testez vos connaissances en géographie !</p>

            {/* 📌 Boutons responsive */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
                <div className="m-auto flex gap-5">
                    <Link
                        to="/flags"
                        className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition text-lg text-center"
                    >
                        🏳️ Quiz Drapeaux
                    </Link>

                    <Link
                        to="/capitals"
                        className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition text-lg text-center"
                    >
                        🏛️ Quiz Capitales
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;

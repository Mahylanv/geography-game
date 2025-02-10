import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Bienvenue sur GeoDex</h1>
            <p>Choisissez votre mode de jeu :</p>
            <div className="buttons">
                <Link to="/flags" className="btn">Drapeaux</Link>
                <Link to="/capitals" className="btn">Capitales</Link>
            </div>
        </div>
    );
};

export default Home;

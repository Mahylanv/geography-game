import React, { useState, useEffect } from "react";
import axios from "axios";

function FlagsQuiz() {
    const [countries, setCountries] = useState([]);
    const [current, setCurrent] = useState({});
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/countries").then((res) => {
            setCountries(res.data);
            setCurrent(res.data[Math.floor(Math.random() * res.data.length)]);
        });
    }, []);

    function checkAnswer() {
        if (answer.toLowerCase() === current.name.toLowerCase()) {
            setMessage("✅ Correct !");
            setTimeout(() => setCurrent(countries[Math.floor(Math.random() * countries.length)]), 1000);
        } else {
            setMessage("❌ Incorrect !");
        }
    }

    return (
        <div>
            <h2>Quel est ce pays ?</h2>
            <img src={current.flag} alt="Drapeau" width="200" />
            <input type="text" onChange={(e) => setAnswer(e.target.value)} />
            <button onClick={checkAnswer}>Valider</button>
            <p>{message}</p>
        </div>
    );
}

export default FlagsQuiz;

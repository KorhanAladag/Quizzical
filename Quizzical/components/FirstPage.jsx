import React from "react"

export default function Firstpage({handleClick}){
    return (
            <div className="first-page">
                <h1 className="quizzical-tittle">Quizzical</h1>
                <p className="start-info">A trivia game to improve your knowledge</p>
                <button className="start-button" onClick={() => handleClick(false)}>Start quiz</button>
            </div>
    )
}
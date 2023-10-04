import React from 'react'

export default function Questions( {questionId, questionText, answers, setSelected, isRevealed }) {
        const answerElements = answers.map(answer => {
            const classRevealed = isRevealed ? "revealed" : 0
            const classCorrect = (answer.isCorrect && isRevealed) ? "correct" : "" 
            const classIncorrect = (answer.isSelected && !answer.isCorrect && isRevealed) ?"incorrect" : ""
        return(
            <div key={answer.answerId}>
                <input 
                    type="radio" 
                    id={answer.answerId}
                    name={questionId}
                    checked={answer.isSelected}
                    onChange={() => setSelected(questionId, answer.answerId)}
                    className={`${classRevealed} ${classCorrect} ${classIncorrect}`}
                />
                <label htmlFor={answer.answerId}>
                    {answer.text}
                </label>
            </div>
        )
    })
    
    return (
        <div className="quiz-question">
            <h2 className="quiz-question-header">
                {questionText}
            </h2>
            <div className="quiz-question-options">
                {answerElements}
            </div>
        </div>
    )
    
    
    
    
}

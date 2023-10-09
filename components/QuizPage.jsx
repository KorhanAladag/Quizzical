import React from "react"
import {nanoid} from "nanoid"
import {decode} from 'html-entities';

import Background from './Background.jsx'
import Questions from './Questions.jsx'
import LoadingPage from './LoadingPage.jsx'

export default function QuizPage({newQuiz}){
    const [quizData, setQuizData] = React.useState([])
    const [numQuizQuestions, setNumQuizQuestions] = React.useState(5)
    const [allAnswered, setAllAnswered] = React.useState(false)
    const [answersRevealed, setAnswersRevealed] = React.useState(false)
    const [score, setScore] = React.useState(0)

    async function fetchData() {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=${numQuizQuestions}`)
            if (!response.ok) {
                throw new Error("Server response was not ok")
            }
            const data = await response.json()
            loadQuiz(data.results)
        }
        
        catch (error) {
            console.error("There was a problem with the fetch operation")
        }
    }
    
    React.useEffect(function(){
        fetchData()
    }, [])
     
     React.useEffect(function checkAllQuestionsAnswered() {
        setAllAnswered(quizData.every(item => item.isAnswered))
    }, [quizData])
    
    function loadQuiz(data){
        const newQuizData = data.map((quiz, index) => ({
                questionId: index,
                isAnswered: false,
                question: decode(quiz.question),
                answers:randomizeAnswers(quiz.incorrect_answers, quiz.correct_answer)
            }))
        setQuizData(newQuizData)
    }
    
        function randomizeAnswers(incorrectAnswers, correctAnswer) {
        const answersObjArr = setIncorrectAnswersObjArr(incorrectAnswers)
        const correctAnswerObj = setCorrectAnswerObj(correctAnswer)
        answersObjArr.splice(setRandomIndex(answersObjArr), 0, correctAnswerObj)
        return answersObjArr
    }
    
    function setIncorrectAnswersObjArr(incorrectAnswers) {
        return incorrectAnswers.map(answer => ({
            answerId: nanoid(),
            text: decode(answer),
            isCorrect: false,
            isSelected: false,
        }))
    }
    
    function setCorrectAnswerObj(correctAnswer) {
        return {
            answerId: nanoid(),
            text: decode(correctAnswer),
            isCorrect: true,
            isSelected: false
        }
    }
    
    function setRandomIndex(answersObjArr) {
        return Math.floor(Math.random()*(answersObjArr.length+1))
    }
    
    function setSelected(questionId, targetId) {
        if(!answersRevealed) {
            setQuizData(prevQuizData => {
                const newQuizData = [...prevQuizData]
                newQuizData[questionId].isAnswered = true
                newQuizData[questionId].answers = newQuizData[questionId].answers.map(item => (
                    item.answerId === targetId ? {...item, isSelected: true} 
                                            : {...item, isSelected: false}
                ))
                return newQuizData
            })
        }
    }
    
    function handleClick(){
        answersRevealed ? newQuiz(true) : calculateScore() 
    }
    
    function calculateScore() {
        setAnswersRevealed(true)
        let pointsScored = 0
        quizData.forEach(question => {
            question.answers.forEach(answer => {
                if(answer.isSelected && answer.isCorrect){ pointsScored++ }
            })
        })
        setScore(pointsScored)
    }
    
    
    const questionElements = quizData.map(item => {
        return (
            <Questions 
                key={item.questionId}
                questionId={item.questionId}
                questionText={item.question}
                answers={item.answers}
                setSelected={setSelected}
                isRevealed={answersRevealed}
            />
        )
    })
    
    return (
            <div className="quiz-page">
            <Background />
                {quizData.length === 0 ? ( <LoadingPage /> ) : (
                    <>
                        <div className="quiz-container">
                            {questionElements}
                        </div>
                        <div className="quiz-button-container">
                            {answersRevealed && 
                            <h3 className="quiz-score">
                                You scored {score}/{numQuizQuestions} correct answers
                            </h3>}
                            <button disabled={!allAnswered} onClick={() => handleClick()}>
                                {answersRevealed ? "Play again" : "Check answers"}
                            </button>
                        </div>
                   </>
                )}
            </div>

    )
}

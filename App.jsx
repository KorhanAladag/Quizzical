import React from "react"
import Background from "./components/Background"
import FirstPage from "./components/FirstPage"
import QuizPage from "./components/QuizPage"

export default function App(){
    const [newInstance, setNewInstance] = React.useState(true)
    
    function handleInstance(arg){
        setNewInstance(arg)
    }

    
    return (
        
        newInstance ? <FirstPage handleClick={handleInstance}/> //
                    : <QuizPage newQuiz={handleInstance}/>
    )

    
 
}
import React, { useState, useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import axios from 'axios'

import './css/main.css'

function App() {
  const [data, setData] = useState([])
  const [score, setScore] = useState(0)
  const [allAnswers, setAllAnswers] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState()
  const [question, setQuestion] = useState()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple'
      )
      setData(result.data.results)
    }
    fetchData()
  }, [])

  const getSingleItem = () => {
    if (index === 10) {
      setIndex(0)
      const inCorrect = data[0].incorrect_answers
      const correct = data[0].correct_answer
      const allAnswers = [...inCorrect, correct]
      const singleQuestion = data[0].question
      setAllAnswers(allAnswers)
      setQuestion(singleQuestion)
      setCorrectAnswer(correct)
    } else {
      setIndex(index + 1)
      const inCorrect = data[index].incorrect_answers
      const correct = data[index].correct_answer
      const allAnswers = [...inCorrect, correct]
      const singleQuestion = data[index].question
      setAllAnswers(allAnswers)
      setQuestion(singleQuestion)
      setCorrectAnswer(correct)
    }
  }

  const handleScore = e => {
    const target = e.target.innerHTML
    const answer = correctAnswer

    if (target === answer) setScore(score + 1)
  }

  return (
    <div className='App'>
      <div className='game-container'>
        <h1>Movie Quiz</h1>
        {index === 10 ? (
          <div className='game-over'>
            <h3>Your score is {score} out of 10</h3>
            <h2>G A M E - O V E R</h2>
            <button onClick={getSingleItem} className='start-btn'>
              GO AGAIN!
            </button>
          </div>
        ) : (
          <div className='bottom-section'>
            <div className='question-score'>
              <div className='score'>
                <p>SCORE: {score} / 10</p>
              </div>
              <div className='question-box'>
                {question ? <p>{ReactHtmlParser(question)}</p> : null}
              </div>
            </div>
            <div className='answer-container'>
              {allAnswers.length !== 0
                ? allAnswers.map((answer, index) => (
                    <button
                      key={index}
                      className='answer'
                      onClick={e => {
                        handleScore(e)
                        getSingleItem()
                      }}
                    >
                      {ReactHtmlParser(answer)}
                    </button>
                  ))
                : null}

              <div className='start-div'>
                {allAnswers.length === 0 ? (
                  <button onClick={getSingleItem} className='start-btn'>
                    Get Questions
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

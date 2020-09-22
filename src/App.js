import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './app.css';
import axios from 'axios' // For å bruke api

// Før jeg begynner å lage appen. Tenk: Hva er de forskjellige komponentene jeg trenger for å bygge appen?
// Jeg trenger:
// - En header seksjon med form inputs
// - En liste med alle flashcardsene
// - En individuell flashcard for alle flashcards
// Alt om disse komponentene skal inn i App()

function App() {
    // Setter default state til SAMPLE_FLASHCARDS
    const [flashcards, setFlashcards] = useState([])
    const [categories, setCategories] = useState([])

    const categoryEl = useRef()
    const amountEl = useRef()
    
    useEffect(() => {
        axios
            .get('https://opentdb.com/api_category.php')
            .then(res => {
                setCategories(res.data.trivia_categories)
            })
    }, [])

    // En hack for å konvertere HTML tekst til vanlig string tekst
    // Lager et element, kopierer teksten i elementet og gir teksten tilbake
    function decodeString(str) {
        const textArea = document.createElement('textarea')
        textArea.innerHTML = str
        return textArea.value
    }

    // Tvinger onSubmit til å gå igjennom react koden isteden for å gjøre det på den vanlige måten
    function handleSubmit(e) {
        e.preventDefault()
        axios
            .get('https://opentdb.com/api.php', {
                params: {
                    amount: amountEl.current.value,
                    category: categoryEl.current.value
                }
            })
            .then(res => {
                setFlashcards(res.data.results.map((questionItem, index) => {
                    const answer = decodeString(questionItem.correct_answer)
                    const options = [
                        ...questionItem.incorrect_answers.map(a => decodeString(a)),
                         answer]
                    return {
                        id: `${index}-${Date.now()}`, // bruker Date.now for å være sikker på at våre indentifiers ikke kræsjer med hverandre
                        question: decodeString(questionItem.question),
                        answer: answer,
                        options: options.sort(() => Math.random() - .5)
                    }
                }))
                console.log(res.data)
            })
    }

    // Render FlashcardList
    // Sender inn en av hvert flashcard fra flashcard arrayet
    return (
        <>
        <form className="header" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" ref={categoryEl}>
                    {categories.map(category => {
                        return <option value={category.id} key={category.id}>{category.name}</option>
                    })}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="amount">Number of Questions</label>
                <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
            </div>
            <div className="form-group">
                <button className="btn">Generate</button>
            </div>
        </form>
        <div className="container">
            <FlashcardList flashcards={flashcards} />
        </div>
        </>
    );
}

// lager statiske flashcards
// Sender inn dette arrayet med spm og sender det inn til vår FlashcardList komponent
/*
const SAMPLE_FLASHCARDS = [
    {
        id: 1,
        question: 'what is 2 + 2?',
        answer: '4',
        options: [
            '2',
            '3',
            '4',
            '5'
        ]
    },
    {
        id: 2,
        question: 'Question 2?',
        answer: 'Answer',
        options: [
            'Answer',
            'Answer 2',
            'Answer 3',
            'Answer 4'
        ]
    }
]
*/

export default App;

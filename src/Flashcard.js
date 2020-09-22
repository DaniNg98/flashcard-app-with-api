import React, { useState, useEffect, useRef } from 'react'

// Flashcard({ flashcard }) gjør at vi ikke trenger å aksessere flashcard fra props
// så vi slipper props.flashcards. Kalles destructuring.
export default function Flashcard({ flashcard }) {
    const [flip, setFlip] = useState(false)
    const [height, setHeight] = useState('initial') /* lagrer høyden */

    const frontEl = useRef()
    const backEl = useRef()

    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height  /* setter høyden på forsiden av kortet */
        const backHeight = backEl.current.getBoundingClientRect().height /* setter høyden på baksiden av kortet */
        setHeight(Math.max(frontHeight, backHeight, 100))   /* setter default høyde på kortet til 100 */
    }

    // Kalkulerer høyden på flashcarden ut i fra hvor lang teksten er
    useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
    
    // Skalerer størrelsen på flashcardsene når vi resizer vinduet
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight)
        return () => window.removeEventListener('resize', setMaxHeight)
    }, [])

    // className inneholder en statisk klasse card og en variabel klasse flip
    // Så hvis flip er true er className satt til flip, hvis den er false er className satt til default.
    // På innsiden av flashcard="front" displayer vi spørsmålene
    // På innsiden av flashcard="flashcard-options" looper vi gjennom alle svaralternativene.
    // På innsiden av flashcard="front" displayer vi svarene
    return (
        <div 
            className={`card ${flip ? 'flip' : ''}`}
            style={{ height: height }}                  // setting hight
            onClick={() => setFlip(!flip)}
        >
            <div className="front" ref={frontEl}>
                {flashcard.question}
                <div className="flashcard-options"> 
                    {flashcard.options.map(option => {
                        return <div className="flashcard-option" key={option}>{option}</div>
                    })}
                </div>
            </div>
            <div className="back" ref={backEl}>{flashcard.answer}</div>
        </div>
    )
}

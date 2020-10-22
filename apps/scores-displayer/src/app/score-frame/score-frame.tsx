import React, { useState, useEffect } from 'react';
import './score-frame.scss';

const ScoreFrame = (props: {team: string, score: number, rank: string, onDisplayedScoreChanged: (displayedScore: number) => void}) => {

    const [amount, setAmount] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => setCurrentScore(currentScore + amount), 5);
        return () => clearTimeout(timeoutId);
    }, [ currentScore, amount ]);

    useEffect(() => {
        let amount: number;
        if (Math.abs(props.score - currentScore) < 10) {
            amount = props.score - currentScore;
        } else {
            amount = ((props.score - currentScore) / 100) | 0;
            if (amount === 0) {
                amount = ((props.score - currentScore) / 10) | 0;
                if (amount === 0) {
                    amount = props.score - currentScore;
                }
            }
        }
        setAmount(amount);
    }, [ props.score, currentScore ]);

    useEffect(() => {
        props.onDisplayedScoreChanged(currentScore);
    }, [ currentScore ]);
    
    return (
        <div className={`score-frame team-${props.team}`} >
            <div className="header">
                <em>
                    {props.team}
                </em>
                <em>
                    {props.rank}
                </em>
            </div>
            <div className="body">
                {currentScore} point{currentScore >= 2 ? 's': ''}
            </div>
        </div>
    )
}

export default ScoreFrame;
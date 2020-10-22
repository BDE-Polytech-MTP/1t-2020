import React, { useState, useEffect } from 'react';
import ScoreFrame from '../score-frame/score-frame';
import './scoreboard.scss';

interface Scores { 
    sam: number; 
    alex: number; 
    clover: number; 
};

const Scoreboard = (props: { scores: Scores }) => {

    const [displayedScores, setDisplayedScores] = useState<Scores>({ sam: 0, alex: 0, clover: 0});
    const [ranks, setRanks] = useState<{ sam: string, alex: string, clover: string}>({ sam: '1er', alex: '1er', clover: '1er'});

    const calculateRank = (team: 'clover' | 'alex' | 'sam'): string => {
        const rank = [displayedScores.alex, displayedScores.clover, displayedScores.sam].filter((score) => score > displayedScores[team]).length + 1;
        switch (rank) {
            case 1:
                return '1er';
            case 2:
                return '2ème';
            case 3:
                return '3ème';
            default:
                return 'Inconnu';
        }
    };

    useEffect(() => {
        setRanks({
            alex: calculateRank('alex'),
            clover: calculateRank('clover'),
            sam: calculateRank('sam'),
        });
    }, [displayedScores]);

    const displayedScoreChanged = (team: string) => (newScore: number) => {
        setDisplayedScores({
            ... displayedScores,
            [team]: newScore,
        });
    };


    return (
        <div className="scoreboard">
            <ScoreFrame team="clover" score={props.scores.clover} rank={ranks.clover} onDisplayedScoreChanged={displayedScoreChanged('clover')} />
            <ScoreFrame team="sam" score={props.scores.sam} rank={ranks.sam} onDisplayedScoreChanged={displayedScoreChanged('sam')} />
            <ScoreFrame team="alex" score={props.scores.alex} rank={ranks.alex} onDisplayedScoreChanged={displayedScoreChanged('alex')} />
        </div>
    );
};

export default Scoreboard;
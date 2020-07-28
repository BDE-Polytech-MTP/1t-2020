import React from 'react';
import ScoreFrame from '../score-frame/score-frame';
import './scoreboard.scss';

interface Scores { 
    sam: number; 
    alex: number; 
    clover: number; 
};

const Scoreboard = (props: { scores: Scores }) => {

    return (
        <div className="scoreboard">
            <ScoreFrame team="clover" score={props.scores.clover} />
            <ScoreFrame team="sam" score={props.scores.sam} />
            <ScoreFrame team="alex" score={props.scores.alex} />
        </div>
    );
};

export default Scoreboard;
import React, { useEffect, useState } from 'react';
import Task from '../task/task';
import './tasks-list.scss';
import { Challenge } from '@1t/api-interfaces';
import ChallengeForm from '../challenge-form/challenge-form';

const TasksList = (
    props: { 
        challenges: Challenge[], 
        updateChallenge: (challenge: Challenge) => void, 
        token?: string,
        deleteChallenge: (challenge: Challenge) => void
    }
) => {

    const [elements, setElements] = useState([]);

    useEffect(() => {
        const wholeBody = [];
        let currentCat = [];
        for (let i = 0; i < props.challenges.length; i++) {
            const chall = props.challenges[i];
            if (currentCat.length > 0 && props.challenges[i - 1].category !== chall.category) {
                const prevChall = props.challenges[i - 1];
                if (props.challenges[i - 1].category != null) {
                    wholeBody.push(<TaskCategory key={prevChall.category} category={prevChall.category} />);
                }
                wholeBody.push(
                    <div className="body" key={'body-' + prevChall.category}>
                        {currentCat}
                    </div>
                );
                currentCat = [];
            }

            currentCat.push(<Task challenge={chall} key={chall.uuid} updateChallenge={props.updateChallenge} token={props.token} deleteChallenge={props.deleteChallenge} />);
        }

        if (currentCat.length > 0) {
            const chall = props.challenges[props.challenges.length - 1];
            if (chall.category !== null) {
                wholeBody.push(<TaskCategory key={chall.category} category={chall.category} />);
            }
            wholeBody.push(
                <div className="body" key={'body-' + chall.category}>
                    {currentCat}
                </div>
            );
        }

        setElements(wholeBody);

    }, [props.challenges]);
/*
    const tasks = props.challenges.map(chall => (
        <Task challenge={chall} key={chall.uuid} updateChallenge={props.updateChallenge} token={props.token} deleteChallenge={props.deleteChallenge} />
    ));
*/
    return (
        <>
            <div className="tasks-list">
                <div className="header">
                    Défis
                </div>
                    {
                        props.token ?
                            <div className="body">
                                <ChallengeForm updateChallenge={props.updateChallenge} token={props.token} />
                                <hr />
                            </div> 
                        : null
                    }
                {elements.length ? elements : <div className="body"><PlaceHolder /></div>}
            </div>

        </>
    );
};

const PlaceHolder = () => {
    return (
        <>
            <h2 className="placeholder">Pas de défis</h2>
        </>
    )
};

const TaskCategory = (props: { category: string}) => {
    return (
        <>
            <div className="task-category">
                {props.category}
            </div>
        </>
    )
}

export default TasksList;
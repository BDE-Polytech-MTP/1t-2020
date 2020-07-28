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

    const [challenges, setChallenges] = useState([]);

    useEffect(() => {

        if (props.token) {
            setChallenges(props.challenges);
            return;
        }

        const challenges = props.challenges;

        const titleGrouped: {[title: string]: { chall: Challenge, count: number }} = challenges.reduce((prev: object, current) => {
            const title = `${current.title}|${current.sam}|${current.alex}|${current.clover}|${current.score}`;
            if (!prev[title]) {
                prev[title] = {
                    chall: current,
                    count: 0,
                };
            }

            prev[title].count++;

            return prev;
        }, {});

        const newChallenges: Challenge[] = [];
        for (let key in titleGrouped) {
            const data = titleGrouped[key];
            if (data.count > 1) {
                newChallenges.push({
                    ... data.chall ,
                    title: `${data.chall.title} (x${data.count})`
                });
            } else {
                newChallenges.push(data.chall);
            }
        }

        setChallenges(newChallenges);

    }, [props.challenges, props.token]);

    const tasks = challenges.map(chall => (
        <Task challenge={chall} key={chall.uuid} updateChallenge={props.updateChallenge} token={props.token} deleteChallenge={props.deleteChallenge} />
    ));

    return (
        <>
            <div className="tasks-list">
                <div className="header">
                    Défis
                </div>
                <div className="body">
                    {
                        props.token ? <>
                            <ChallengeForm updateChallenge={props.updateChallenge} token={props.token} />
                            <hr />
                        </> : null
                    }
                    {tasks.length ? tasks : <PlaceHolder />}
                </div>
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

export default TasksList;
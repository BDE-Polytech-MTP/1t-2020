import React, { useState } from 'react';
import './task.scss';
import { Challenge } from '@1t/api-interfaces';
import { environment } from '../../environments/environment';

const Task = (props: { challenge: Challenge, updateChallenge: (chall: Challenge) => void, token?: string, deleteChallenge: (challenge: Challenge) => void }) => {

    const {challenge, updateChallenge} = props;
    const [dialogOpened, setDialogOpened] = useState(false);

    const update = (name: 'clover' | 'sam' | 'alex') => {
        if (!props.token) {
            return;
        }

        const newValue = !challenge[name];
        updateChallenge({ ... props.challenge, [name]: newValue });
        fetch(`${environment.apiURL}/api/challenges/${challenge.uuid}`, {
            method: 'PATCH',
            body: JSON.stringify({
                [name]: newValue
            }),
            headers: {
                'Content-Type': 'application/json',
                'www-authenticate': props.token,
            },
        })
        .then((res) => res.json())
        .then((chall) => updateChallenge(chall))
        .catch(e => {
            updateChallenge({ ... props.challenge, [name]: !newValue });
            console.error(e);
        })
    };

    const deleteChallenge = () => {
        setDialogOpened(false);
        const challenge = props.challenge;
        props.deleteChallenge(challenge);
        fetch(`${environment.apiURL}/api/challenges/${challenge.uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'www-authenticate': props.token,
            },
        }).catch((e) => {
            console.error(e);
            updateChallenge(challenge);
        });
    };
    
    return (
        <>
            <div className="task">
                <div className="text">
                <strong>{challenge.score} point{challenge.score >= 2 ? 's': ''}</strong> : {challenge.title}
                </div>
                <div className="boxes">
                    <div className={`checkbox ${challenge.clover ? 'done': ''}`} onClick={
                        () => update('clover')
                    }></div>
                    <div className={`checkbox ${challenge.sam  ? 'done': ''}`} onClick={
                        () => update('sam')
                    }></div>
                    <div className={`checkbox ${challenge.alex  ? 'done': ''}`} onClick={
                        () => update('alex')
                    }></div>
                    {
                        props.token ? 
                            <div className="delete" onClick={() => setDialogOpened(true)}>
                                Supprimer
                            </div>
                            : null
                    }
                </div>
                {
                    props.token && dialogOpened ? 
                        <ConfirmDialog challenge={props.challenge} onCancel={() => setDialogOpened(false)} onConfirm={deleteChallenge} /> : null
                }
            </div>
        </>
    );
};

const ConfirmDialog = (props: { challenge: Challenge, onCancel: () => void, onConfirm: () => void }) => {

    return (
        <>
            <div className="confirm-dialog">
                <div className="dialog-background" onClick={props.onCancel}></div>
                <div className="content">
                    <p>Voulez-vous vraiment supprimer le challenge : <strong>{props.challenge.title}</strong></p>
                    <button className="cancel" onClick={props.onCancel}>Non, je ne veux pas le supprimer</button>
                    <button className="confirm" onClick={props.onConfirm}>Oui, je veux le supprimer</button>
                </div>
            </div>
        </>
    )

}

export default Task;
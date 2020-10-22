import React, { useState } from 'react';
import './task.scss';
import { Challenge } from '@1t/api-interfaces';
import { environment } from '../../environments/environment';

const Task = (props: { challenge: Challenge, updateChallenge: (chall: Challenge) => void, token?: string, deleteChallenge: (challenge: Challenge) => void }) => {

    const {challenge, updateChallenge} = props;
    const [deleteDialogOpened, setDialogOpened] = useState(false);
    const [editDialogOpened, setEditDialogOpened] = useState<'clover' | 'sam' | 'alex' | null>(null);

    const update = (name: 'clover' | 'sam' | 'alex', value: number) => {
        if (!props.token) {
            return;
        }

        const oldValue = challenge[name];

        updateChallenge({ ... props.challenge, [name]: value });
        fetch(`${environment.apiURL}/api/challenges/${challenge.uuid}`, {
            method: 'PATCH',
            body: JSON.stringify({
                [name]: value
            }),
            headers: {
                'Content-Type': 'application/json',
                'www-authenticate': props.token,
            },
        })
        .then((res) => res.json())
        .then((chall) => updateChallenge(chall))
        .catch(e => {
            updateChallenge({ ... props.challenge, [name]: oldValue });
            console.error(e);
        });
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

    const displayIfGreaterThanZero = (value: number) => value > 0 ? value : '';
    
    return (
        <>
            <div className="task">
                <div className="text">
                <strong>{challenge.score} point{challenge.score >= 2 ? 's': ''}</strong> : {challenge.title}
                </div>
                <div className="boxes">
                    <div className={`checkbox ${challenge.clover ? 'done': ''}`} onClick={
                        () => setEditDialogOpened('clover')
                    }>{ displayIfGreaterThanZero(challenge.clover) }</div>
                    <div className={`checkbox ${challenge.sam  ? 'done': ''}`} onClick={
                        () => setEditDialogOpened('sam')
                    }>{ displayIfGreaterThanZero(challenge.sam) }</div>
                    <div className={`checkbox ${challenge.alex  ? 'done': ''}`} onClick={
                        () => setEditDialogOpened('alex')
                    }>{ displayIfGreaterThanZero(challenge.alex) }</div>
                    {
                        props.token ? 
                            <div className="delete" onClick={() => setDialogOpened(true)}>
                                Supprimer
                            </div>
                            : null
                    }
                </div>
                {
                    props.token && deleteDialogOpened ? 
                        <ConfirmDialog challenge={props.challenge} onCancel={() => setDialogOpened(false)} onConfirm={deleteChallenge} /> : null
                }
                {
                    props.token && editDialogOpened ?
                        <EditDialog challenge={props.challenge} onCancel={() => setEditDialogOpened(null)} onConfirm={
                            (newValue) => {
                                update(editDialogOpened, newValue);
                                setEditDialogOpened(null);
                            }
                        } team={editDialogOpened} /> : null
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

const EditDialog = (props: { challenge: Challenge, onCancel: () => void, onConfirm: (newValue: number) => void, team: 'clover' | 'sam' | 'alex' }) => {

    const [value, setValue] = useState(props.challenge[props.team]);

    const valueInput = <input type="number" onChange={e => setValue(
        Math.max(0, parseInt(e.target.value))
    )} value={value}></input>;

    return (
        <div className="confirm-dialog">
            <div className="dialog-background" onClick={props.onCancel}></div>
            <div className="content">
                <p>Modification du challenge : <strong>{props.challenge.title}</strong></p>
                { valueInput }
                <button className="cancel" onClick={props.onCancel}>Annuler</button>
                <button className="confirm" onClick={() => props.onConfirm(valueInput.props.value)}>Confirmer</button>
            </div>
        </div>
    )

};

export default Task;
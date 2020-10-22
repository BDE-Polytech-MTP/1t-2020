import React, { useState } from 'react';
import { Challenge } from '@1t/api-interfaces';
import './challenge-form.scss';
import { environment } from '../../environments/environment';

const ChallengeForm = (props: { updateChallenge: (c: Challenge) => void, token: string }) => {

    const [formData, setFormData] = useState({ name: '', score: '', category: '' });
    const [sending, setSending] = useState(false);

    const createChallenge = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        const challenge = {
            title: formData.name,
            score: parseInt(formData.score, 10) | 0,
            category: formData.category.trim().length ? formData.category.trim() : null,
        };

        setSending(true);

        fetch(`${environment.apiURL}/api/challenges`, {
            method: 'POST',
            body: JSON.stringify(challenge),
            headers: {
                'Content-Type': 'application/json',
                'www-authenticate': props.token,
            }
        })
        .then(res => res.json())
        .then(chall => {
            props.updateChallenge(chall);
            setSending(false);
        })
        .catch(e => {
            console.error(e);
            setSending(false);
        })
    };

    return (
        <form className="challenge-form">
            <h3>Ajouter un challenge</h3>

            <div className="form-group">
                <label htmlFor="title">Catégorie</label>
                <input 
                    type="text" 
                    minLength={0}  
                    name="category" 
                    id="category" 
                    placeholder="Catégorie (optionnelle)" 
                    value={formData.category} 
                    onChange={(e) => setFormData({ category: e.target.value, score: formData.score, name: formData.name })}
                />
            </div>

            <div className="form-group">
                <label htmlFor="title">Titre</label>
                <input 
                    type="text" 
                    minLength={0} 
                    required 
                    name="title" 
                    id="title" 
                    placeholder="Titre" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ name: e.target.value, score: formData.score, category: formData.category })}
                />
            </div>

            <div className="form-group">
                <label htmlFor="score">Nombre de points</label>
                <input 
                    type="number" 
                    min="0" 
                    required 
                    name="score" 
                    id="score" 
                    placeholder="Points"
                    value={formData.score} 
                    onChange={(e) => setFormData({ score: e.target.value, name: formData.name, category: formData.category })}
                />
            </div>

            <button 
                className="valid" 
                type="submit"
                disabled={sending || formData.name.length === 0 || isNaN(parseInt(formData.score))}
                onClick={createChallenge}
            >Ajouter</button>
            <button className="reset" type="reset" onClick={() => setFormData({name: '', score: null, category: ''})}>Vider le formulaire</button>
        </form>
    );
};

export default ChallengeForm;
import React, { useState, useEffect } from 'react';
import Scoreboard from './scoreboard/scoreboard';
import TasksList from './tasks-list/tasks-list';
import './app.scss';
import { Challenge } from '@1t/api-interfaces';
import { environment } from '../environments/environment';

export const App = () => {

  const token = /^\?token=[a-zA-Z0-9-]{36}$/.test(window.location.search) ? window.location.search.substring(7) : undefined;

  const [switchState, doSwitch] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [scores, setScores] = useState<{ sam: number, clover: number, alex: number}>({ sam: 0, clover: 0, alex: 0});

  const reorderChallenges = (challenges: Challenge[]) => {
    challenges.sort((ch1: Challenge, ch2: Challenge) => {
      // Sort by category
      if (ch1.category === null && ch2.category !== null) {
        return -1;
      }

      if (ch1.category !== null && ch2.category === null) {
        return 1;
      }

      if (ch1.category !== null && ch2.category !== null) {
        const order = ch1.category.localeCompare(ch2.category);
        if (order !== 0) {
          return -order;
        }
      }

      // Sort by score
      if (ch1.score !== ch2.score) {
        return ch1.score < ch2.score ? -1 : 1;
      }

      // Sort by name
      const nameOrder = ch1.title.localeCompare(ch2.title);
      if (nameOrder !== 0) {
        return nameOrder;
      }

      // Sort by UUID
      return ch1.uuid.localeCompare(ch2.uuid);
    });
  };

  const updateChallenge = (challenge: Challenge) => {
    const challIndex = challenges.map(c => c.uuid).indexOf(challenge.uuid);
    if (challIndex < 0) {
      const newChallenges = [ ... challenges, challenge ];
      reorderChallenges(newChallenges);
      setChallenges(newChallenges);
    } else {
      const firstPart = challenges.slice(0, challIndex);
      const secondPart = challenges.slice(challIndex + 1, challenges.length);
      const result = [ ... firstPart, challenge, ... secondPart ];
      setChallenges(result);
    }
  };

  const deleteChallenge = (challenge: Challenge) => {
    setChallenges(challenges.filter((c) => c.uuid !== challenge.uuid));
  };

  const fetchAllChallenges = () => fetch(`${environment.apiURL}/api/challenges`).then((res) => res.json()).then((challs) => setChallenges(challs));

  useEffect(() => { 
    fetchAllChallenges();
    const timeoutId = setTimeout(() => doSwitch(!switchState), 5000);
    return () => clearTimeout(timeoutId);
   }, [switchState]);

  useEffect(() => {
    let computedScores = { sam: 0, clover: 0, alex: 0};

    challenges.forEach((challenge) => {
      computedScores.sam += challenge.score * challenge.sam;
      computedScores.clover += challenge.score * challenge.clover;
      computedScores.alex += challenge.score * challenge.alex;
    });

    setScores(computedScores);
  }, [challenges]);

  return (
    <>
      <div className="app">
        <h1>Tableau des scores</h1>
        <Scoreboard scores={scores} />
        <TasksList challenges={challenges} updateChallenge={updateChallenge} token={token} deleteChallenge={deleteChallenge} />
      </div>
    </>
  );
};

export default App;

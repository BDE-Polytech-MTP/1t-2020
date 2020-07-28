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

  const updateChallenge = (challenge: Challenge) => {
    const challIndex = challenges.map(c => c.uuid).indexOf(challenge.uuid);
    if (challIndex < 0) {
      setChallenges([ ... challenges, challenge ]);
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
      if (challenge.sam) {
        computedScores.sam += challenge.score;
      }

      if (challenge.clover) {
        computedScores.clover += challenge.score;
      }

      if (challenge.alex) {
        computedScores.alex += challenge.score;
      }
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

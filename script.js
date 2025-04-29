/*jslint devel */
/*jshint esnext: true */
// https://jsbin.com/jebiputove/edit?js,console
// old: https://jsbin.com/durayeseke/edit?js,console
// older: https://jsbin.com/layetuneqe/edit?js,console
// older: https://jsbin.com/tutuhayesi/edit?js,console

(function () {
   'use strict';

   const calcAverage = (array) => array.reduce(
      (totalSoFar, element) => totalSoFar + element,
      0
   ) / array.length;

   const isDecisive = (array, value) => (
      array.every(
         (cutoff) => value >= cutoff
      ) && array.some(
         (cutoff) => value > cutoff
      )
   ) || (
      array.every(
         (cutoff) => value <= cutoff
      ) && array.some(
         (cutoff) => value < cutoff
      )
   );

   const findDecisiveCutoff = (array, value) => (
      array.length <= 0
      ? Number.NaN
      : (
         Number.isFinite(array[0])
         && array[0] !== value
      )
      ? array[0]
      : (
         Array.isArray(array[0])
         && isDecisive(array[0], value)
      )
      ? calcAverage(array[0])
      : findDecisiveCutoff(array.slice(1), value)
   );

   const decideApproval = (cardinalPreference, cutoff, defaultVote) => (
      cardinalPreference > cutoff
      ? 1
      : cardinalPreference < cutoff
      ? 0
      : defaultVote
   );

   const applyStrategyA = function (cardinalPreferences, poll, lastBallot) {
      console.log('---------------------------');
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => poll[candidate] >= pollTotal
         )
      );
      console.log('topCandidates:', topCandidates);
      const cutoffs = topCandidates.map(
         (candidateSet) => calcAverage(
            candidateSet.map(
               (candidate) => cardinalPreferences[candidate]
            )
         )
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => decideApproval(
            cardinalPreferences[candidate],
            findDecisiveCutoff(
               cutoffs,
               cardinalPreferences[candidate]
            ),
            lastBallot[candidate]
         )
      );
   };

   const applyStrategyB = function (cardinalPreferences, poll, lastBallot) {
      console.log('---------------------------');
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => poll[candidate] >= pollTotal
         )
      );
      console.log('topCandidates:', topCandidates);
      const cutoffs = [
         topCandidates[1].map(
            (candidate) => cardinalPreferences[candidate]
         )
      ];
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => decideApproval(
            cardinalPreferences[candidate],
            findDecisiveCutoff(
               cutoffs,
               cardinalPreferences[candidate]
            ),
            lastBallot[candidate]
         )
      );
   };

   const applyStrategyT = function (cardinalPreferences, poll, lastBallot) {
      console.log('---------------------------');
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => poll[candidate] >= pollTotal
         )
      );
      console.log('topCandidates:', topCandidates);
      const cutoffs = [
         Math.max(
            ...topCandidates[1].map(
               (candidate) => cardinalPreferences[candidate]
            )
         ),
         ...topCandidates.map(
            (candidateSet) => calcAverage(
               candidateSet.map(
                  (candidate) => cardinalPreferences[candidate]
               )
            )
         )
      ];
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => decideApproval(
            cardinalPreferences[candidate],
            findDecisiveCutoff(
               cutoffs,
               cardinalPreferences[candidate]
            ),
            lastBallot[candidate]
         )
      );
   };

   const applyStrategyW = function (cardinalPreferences, poll, lastBallot) {
      console.log('---------------------------');
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => poll[candidate] >= pollTotal
         )
      );
      console.log('topCandidates:', topCandidates);
      const cutoffs = topCandidates.map(
         (candidateSet) => calcAverage(
            candidateSet.map(
               (candidate) => cardinalPreferences[candidate]
            )
         )
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => decideApproval(
            cardinalPreferences[candidate],
            findDecisiveCutoff(
               cutoffs.slice(
                  topCandidates.findIndex(
                     (candidateSet) => candidateSet.includes(
                        candidate
                     )
                  )
               ),
               cardinalPreferences[candidate]
            ),
            lastBallot[candidate]
         )
      );
   };

   const numCandidates = 10;
   const cardinalPreferences = Array.from(
      {length: numCandidates},
      () => Math.floor(Math.random() * 101)
   );
   const poll = Array.from(
      {length: numCandidates},
      () => Math.floor(Math.random() * 11)
   );
   const lastBallot = cardinalPreferences.map(() => 0.5);
   console.log('cardinalPreferences:', cardinalPreferences);
   console.log('poll:', poll);
   console.log('lastBallot:', lastBallot);
   const ballotA = applyStrategyA(cardinalPreferences, poll, lastBallot);
   console.log('ballotA:', ballotA);
   const ballotB = applyStrategyB(cardinalPreferences, poll, lastBallot);
   console.log('ballotB:', ballotB);
   const ballotT = applyStrategyT(cardinalPreferences, poll, lastBallot);
   console.log('ballotT:', ballotT);
   const ballotW = applyStrategyW(cardinalPreferences, poll, lastBallot);
   console.log('ballotW:', ballotW);
   console.log('strategy W approves:', cardinalPreferences.filter(
      (ignore, candidate) => ballotW[candidate] > 0.5
   ).toSorted(
      (x, y) => y - x
   ));
   console.log('strategy W disapproves:', cardinalPreferences.filter(
      (ignore, candidate) => ballotW[candidate] < 0.5
   ).toSorted(
      (x, y) => y - x
   ));
}());

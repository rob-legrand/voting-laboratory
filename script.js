/*jslint devel */
/*jshint esnext: true */
// https://jsbin.com/durayeseke/edit?js,console
// old: https://jsbin.com/layetuneqe/edit?js,console
// older: https://jsbin.com/tutuhayesi/edit?js,console

(function () {
   'use strict';

   const firstNotEqualTo = (array, value) => (
      array.length <= 0
      ? Number.POSITIVE_INFINITY
      : array[0] !== value
      ? array[0]
      : firstNotEqualTo(array.slice(1), value)
   );

   const applyStrategyA = function (cardinalPreferences, poll) {
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
         (candidateSet) => candidateSet.reduce(
            (totalSoFar, candidate) => totalSoFar + cardinalPreferences[candidate],
            0
         ) / candidateSet.length
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => (
            cardinalPreferences[candidate] > firstNotEqualTo(
               cutoffs,
               cardinalPreferences[candidate]
            )
            ? 1
            : 0
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
      const topCandidates = candidates.filter(
         (candidate) => poll[candidate] === orderedPollTotals[0]
      );
      console.log('topCandidates:', topCandidates);
      const nextTopCandidates = candidates.filter(
         (candidate) => poll[candidate] === orderedPollTotals[1]
      );
      console.log('nextTopCandidates:', nextTopCandidates);
      const topCandPrefs = topCandidates.map(
         (candidate) => cardinalPreferences[candidate]
      ).toSorted(
         (x, y) => y - x
      );
      console.log('topCandPrefs:', topCandPrefs);
      const nextTopCandPrefs = nextTopCandidates.map(
         (candidate) => cardinalPreferences[candidate]
      ).toSorted(
         (x, y) => y - x
      );
      console.log('nextTopCandPrefs:', nextTopCandPrefs);
      const cutoffs = (
         topCandidates.length > 1
         ? [
            topCandPrefs.reduce(
               (totalSoFar, candPref, index) => totalSoFar + candPref * index,
               0
            ) / (topCandidates.length * (topCandidates.length - 1) / 2),
            topCandPrefs.toReversed().reduce(
               (totalSoFar, candPref, index) => totalSoFar + candPref * index,
               0
            ) / (topCandidates.length * (topCandidates.length - 1) / 2)
         ]
         : [
            nextTopCandPrefs.reduce(
               (totalSoFar, candPref) => totalSoFar + Math.min(topCandPrefs[0], candPref),
               0
            ) / nextTopCandidates.length,
            nextTopCandPrefs.reduce(
               (totalSoFar, candPref) => totalSoFar + Math.max(topCandPrefs[0], candPref),
               0
            ) / nextTopCandidates.length
         ]
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => (
            cutoffs.every(
               (cutoff) => cardinalPreferences[candidate] <= cutoff
            )
            ? 0
            : cutoffs.every(
               (cutoff) => cardinalPreferences[candidate] >= cutoff
            )
            ? 1
            : lastBallot[candidate]
         )
      );
   };

   const applyStrategyT = function (cardinalPreferences, poll) {
      console.log('---------------------------');
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = candidates.filter(
         (candidate) => poll[candidate] === orderedPollTotals[0]
      );
      console.log('topCandidates:', topCandidates);
      const nextTopCandidates = candidates.filter(
         (candidate) => poll[candidate] === orderedPollTotals[1]
      );
      console.log('nextTopCandidates:', nextTopCandidates);
      const topCandPrefs = topCandidates.map(
         (candidate) => cardinalPreferences[candidate]
      ).toSorted(
         (x, y) => y - x
      );
      console.log('topCandPrefs:', topCandPrefs);
      const nextTopCandPrefs = nextTopCandidates.map(
         (candidate) => cardinalPreferences[candidate]
      ).toSorted(
         (x, y) => y - x
      );
      console.log('nextTopCandPrefs:', nextTopCandPrefs);
      const cutoffs = (
         topCandidates.length > 1
         ? [
            topCandPrefs.reduce(
               (totalSoFar, candPref, index) => totalSoFar + candPref * index,
               0
            ) / (topCandidates.length * (topCandidates.length - 1) / 2),
            topCandPrefs.toReversed().reduce(
               (totalSoFar, candPref, index) => totalSoFar + candPref * index,
               0
            ) / (topCandidates.length * (topCandidates.length - 1) / 2)
         ]
         : [
            nextTopCandPrefs.reduce(
               (totalSoFar, candPref) => totalSoFar + Math.min(topCandPrefs[0], candPref),
               0
            ) / nextTopCandidates.length,
            nextTopCandPrefs.reduce(
               (totalSoFar, candPref) => totalSoFar + Math.max(topCandPrefs[0], candPref),
               0
            ) / nextTopCandidates.length
         ]
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => (
            (cutoffs.every(
               (cutoff) => cardinalPreferences[candidate] >= cutoff
            ) && !cutoffs.every(
               (cutoff) => cardinalPreferences[candidate] <= cutoff
            ))
            ? 1
            : 0
         )
      );
   };

   const applyStrategyW = function (cardinalPreferences, poll) {
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
         (candidateSet) => candidateSet.reduce(
            (totalSoFar, candidate) => totalSoFar + cardinalPreferences[candidate],
            0
         ) / candidateSet.length
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => (
            cardinalPreferences[candidate] > firstNotEqualTo(
               cutoffs.slice(
                  topCandidates.findIndex(
                     (candidateSet) => candidateSet.includes(
                        candidate
                     )
                  )
               ),
               cardinalPreferences[candidate]
            )
            ? 1
            : 0
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

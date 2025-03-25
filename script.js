/*jslint devel */
/*jshint esnext: true */
// https://jsbin.com/tutuhayesi/edit?js,console

(function () {
   'use strict';

   const firstNotEqualTo = (array, value) => (
      array.length <= 0
      ? Number.POSITIVE_INFINITY
      : array[0] !== value
      ? array[0]
      : firstNotEqualTo(array.slice(1), value)
   );

   const findStrategicBallot = function (cardinalPreferences, poll) {
      const candidates = poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = [...new Set(poll)].toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => poll[candidate] === pollTotal
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

   const numCandidates = 10;
// const cardinalPreferences = [100, 20, 0];
// const poll = [80, 65, 35];
   const cardinalPreferences = Array.from(
      {length: numCandidates},
      () => Math.floor(Math.random() * 101)
   );
   const poll = Array.from(
      {length: numCandidates},
      () => Math.floor(Math.random() * 11)
   );
   console.log('cardinalPreferences:', cardinalPreferences);
   console.log('poll:', poll);
   const ballot = findStrategicBallot(cardinalPreferences, poll);
   console.log('ballot:', ballot);
}());

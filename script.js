/*jslint devel */
/*jshint esnext: true */
// https://jsbin.com/tiboyoqude/edit?js,console
// old: https://jsbin.com/siqasuxiyo/edit?js,console
// older: https://jsbin.com/hedaluquce/edit?js,console
// older: https://jsbin.com/jebiputove/edit?js,console
// older: https://jsbin.com/durayeseke/edit?js,console
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

   const findStrategicBallot = function (args) {
      const candidates = args.poll.map(
         (ignore, index) => index
      );
      console.log('candidates:', candidates);
      const orderedPollTotals = args.poll.toSorted(
         (x, y) => y - x
      );
      console.log('orderedPollTotals:', orderedPollTotals);
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => args.poll[candidate] >= pollTotal
         )
      );
      console.log('topCandidates:', topCandidates);
      const cutoffs = (
         args.strategy === 'B'
         ? [
            topCandidates[1].map(
               (candidate) => args.cardinalPreferences[candidate]
            )
         ]
         : args.strategy === 'F'
         ? args.cardinalPreferences.toSorted(
            (x, y) => y - x
         )
         : args.strategy === 'H'
         ? [args.cardinalPreferences.toSorted(
            (x, y) => y - x
         ).slice(
            Math.floor((args.cardinalPreferences.length - 1) / 2),
            Math.ceil((args.cardinalPreferences.length + 1) / 2)
         )]
         : args.strategy === 'J'
         ? [
            topCandidates[1].map(
               (candidate) => args.cardinalPreferences[candidate]
            ),
            calcAverage(
               args.cardinalPreferences
            )
         ]
         : args.strategy === 'R'
         ? [
            calcAverage([
               Math.min(...args.cardinalPreferences),
               Math.max(...args.cardinalPreferences)
            ])
         ]
         : args.strategy === 'T'
         ? [
            Math.max(
               ...topCandidates[1].map(
                  (candidate) => args.cardinalPreferences[candidate]
               )
            ),
            ...topCandidates.map(
               (candidateSet) => calcAverage(
                  candidateSet.map(
                     (candidate) => args.cardinalPreferences[candidate]
                  )
               )
            )
         ]
         : args.strategy === 'Z'
         ? [
            calcAverage(
               args.cardinalPreferences
            )
         ]
         : topCandidates.map(
            (candidateSet) => calcAverage(
               candidateSet.map(
                  (candidate) => args.cardinalPreferences[candidate]
               )
            )
         )
      );
      console.log('cutoffs:', cutoffs);
      return candidates.map(
         (candidate) => decideApproval(
            args.cardinalPreferences[candidate],
            findDecisiveCutoff(
               (
                  args.strategy === 'W'
                  ? cutoffs.slice(
                     topCandidates.findIndex(
                        (candidateSet) => candidateSet.includes(
                           candidate
                        )
                     )
                  )
                  : cutoffs
               ),
               args.cardinalPreferences[candidate]
            ),
            args.lastBallot[candidate]
         )
      );
   };

   const printStrategyResults = function (args) {
      console.log('--------- STRATEGY ' + args.strategy + ': ---------');
      const ballot = findStrategicBallot(args);
      console.log(
         'ballot:',
         ballot,
         {
            approved: args.cardinalPreferences.filter(
               (ignore, candidate) => ballot[candidate] > 0.5
            ).toSorted(
               (x, y) => y - x
            ),
            disapproved: args.cardinalPreferences.filter(
               (ignore, candidate) => ballot[candidate] < 0.5
            ).toSorted(
               (x, y) => y - x
            )
         }
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
   const strategies = 'ABFHJRTWZ';
   [...strategies].forEach(function (strategy) {
      printStrategyResults({
         cardinalPreferences: cardinalPreferences,
         strategy: strategy,
         poll: poll,
         lastBallot: lastBallot
      });
   });
}());

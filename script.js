/*jslint devel */
/*jshint esnext: true */
// https://jsbin.com/memaqiqaka/edit?js,console
// old: https://jsbin.com/mikifufamu/edit?js,console
// older: https://jsbin.com/tiboyoqude/edit?js,console
// older: https://jsbin.com/siqasuxiyo/edit?js,console
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

   const calcRange = (array) => Math.max(
      ...array
   ) - Math.min(
      ...array
   );

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
      const orderedPollTotals = args.poll.toSorted(
         (x, y) => y - x
      );
      if (args.verbose) {
         console.log('orderedPollTotals:', orderedPollTotals);
      }
      const topCandidates = orderedPollTotals.map(
         (pollTotal) => candidates.filter(
            (candidate) => args.poll[candidate] >= pollTotal
         )
      );
      if (args.verbose) {
         console.log('topCandidates:', topCandidates);
      }
      const cutoffs = (
         args.strategy === 'D'
         ? [
            calcAverage(
               topCandidates[0].map(
                  (candidate) => args.cardinalPreferences[candidate]
               )
            ),
            ...args.cardinalPreferences.toSorted(
               (x, y) => x - y
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
         : args.strategy === 'Q'
         ? [
            calcAverage(
               topCandidates[0].map(
                  (candidate) => args.cardinalPreferences[candidate]
               )
            ),
            ...args.cardinalPreferences.toSorted(
               (x, y) => y - x
            )
         ]
         : args.strategy === 'R'
         ? [
            calcAverage([
               Math.min(...args.cardinalPreferences),
               Math.max(...args.cardinalPreferences)
            ])
         ]
         : (
            args.strategy === 'B'
            || args.strategy === 'J'
            || args.strategy === 'T'
         )
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
      if (args.verbose) {
         console.log('cutoffs:', cutoffs);
      }
      const defaultBallot = (
         args.strategy === 'J'
         ? findStrategicBallot({
            cardinalPreferences: args.cardinalPreferences,
            strategy: 'Z',
            poll: args.poll,
            lastBallot: args.lastBallot
         })
         : args.lastBallot
      );
      return (
         (
            (
               args.strategy === 'B'
               || args.strategy === 'J'
            )
            && calcRange(
               defaultBallot.filter(
                  (ignore, candidate) => topCandidates[1].includes(
                     candidate
                  )
               )
            ) >= 1
         )
         ? defaultBallot
         : candidates.map(
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
   const strategies = 'ABDFHJQRTWZ';
   [...strategies].forEach(function (strategy) {
      console.log('--------- STRATEGY ' + strategy + ': ---------');
      console.log('cardinalPreferences:', cardinalPreferences);
      console.log('poll:', poll);
      console.log('lastBallot:', lastBallot);
      const ballot = findStrategicBallot({
         cardinalPreferences: cardinalPreferences,
         strategy: strategy,
         poll: poll,
         lastBallot: lastBallot,
         verbose: true
      });
      console.log(
         'ballot:',
         ballot,
         {
            approved: cardinalPreferences.filter(
               (ignore, candidate) => ballot[candidate] > 0.5
            ).toSorted(
               (x, y) => y - x
            ),
            disapproved: cardinalPreferences.filter(
               (ignore, candidate) => ballot[candidate] < 0.5
            ).toSorted(
               (x, y) => y - x
            )
         }
      );
   });
}());

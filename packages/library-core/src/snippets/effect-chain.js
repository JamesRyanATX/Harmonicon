export const effectChainSnippet = async ({ library }) => {

  await library.snippet('effect-chain', ({ snippet }) => {
    snippet.source('// effect-chain');
  });

};

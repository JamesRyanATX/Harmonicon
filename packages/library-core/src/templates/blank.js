export const blankTemplate = async ({ library }) => {

  await library.template('Blank', async ({ template }) => {
    template.source(`

session('my-song', async ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(120)
    .swing(0)
    .key('c')
    .scale('major');

});

    `.trim());
  });

};

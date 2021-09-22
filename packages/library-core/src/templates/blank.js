export const blankTemplate = ({ library }) => {

  library.template('Blank', ({ template }) => {
    template.source(`

session('my-song', ({ session }) => {
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

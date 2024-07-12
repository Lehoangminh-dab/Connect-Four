it('should not have class "player-two" for square 21', () => {
  cy.get('.grid .grid-square').eq(21).should('not.have.class', 'player-two');
});
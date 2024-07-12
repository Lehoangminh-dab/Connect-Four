/// <reference types="cypress" />

describe('Access game page', () => {
  
  it('should allow the user to access the game page with loaded content', () => {
    cy.visit('/index.html');

    cy.get('.grid').should('exist');
    cy.get('.grid .grid-square').should('have.length', 42);
    cy.get('.player-turn-display').should('contain.text', 'Current Player: 1');
  });
});

describe('Take Unwinning Square', () => {
  beforeEach(() => {
    cy.visit('/index.html');
  });

  it('should allow the user to take an untaken square that is right above a taken square', () => {
    cy.get('.grid .grid-square').eq(35).click();
    cy.get('.player-turn-display').should('contain.text', 'Current Player: 2');
    cy.get('.grid .grid-square').eq(28).click();

    cy.get('.player-turn-display').should('contain.text', 'Current Player: 1');
    cy.get('.grid .grid-square').eq(35).should('have.class', 'player-one');
    cy.get('.grid .grid-square').eq(28).should('have.class', 'player-two');
  });

  it('should not allow the user to take an untaken square that is not right above a taken square', () => {
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contain('Invalid Action!');
    })

    cy.get('.grid .grid-square').eq(35).click();
    cy.get('.player-turn-display').should('contain.text', 'Current Player: 2');
    cy.get('.grid .grid-square').eq(21).click();

    cy.get('.player-turn-display').should('contain.text', 'Current Player: 2');    
    cy.get('.grid .grid-square').eq(35).should('have.class', 'player-one');
    cy.get('.grid .grid-square').eq(21).should('not.have.class', 'player-two');
  });

  it('should not allow the user to take a taken square', () => {
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contain('Invalid Action!');
    })

    cy.get('.grid .grid-square').eq(35).click();
    cy.get('.player-turn-display').should('contain.text', 'Current Player: 2');
    cy.get('.grid .grid-square').eq(35).click();

    cy.get('.player-turn-display').should('contain.text', 'Current Player: 2');    
    cy.get('.grid .grid-square').eq(35).should('have.class', 'player-one');
    cy.get('.grid .grid-square').eq(35).should('not.have.class', 'player-two');
  });
});

describe('Take Winning Square', () => {
  beforeEach(() => {
    cy.visit('/index.html');
  });

  it('should allow player one to make a horizontal winning square line with no broken lines on the row', () => {
    cy.get('.grid .grid-square').then(squares => {
        cy.wrap(squares).eq(35).click();
        cy.wrap(squares).eq(28).click();
        cy.wrap(squares).eq(36).click();
        cy.wrap(squares).eq(29).click();
        cy.wrap(squares).eq(37).click();
        cy.wrap(squares).eq(30).click();
        cy.wrap(squares).eq(38).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player one to make a horizontal winning square line with broken lines on the row', () => {
    cy.get('.grid .grid-square').then(squares => {
        cy.wrap(squares).eq(35).click();
        cy.wrap(squares).eq(28).click();
        cy.wrap(squares).eq(36).click();
        cy.wrap(squares).eq(37).click();
        cy.wrap(squares).eq(38).click();
        cy.wrap(squares).eq(31).click();
        cy.wrap(squares).eq(39).click();
        cy.wrap(squares).eq(32).click();
        cy.wrap(squares).eq(40).click();
        cy.wrap(squares).eq(33).click();
        cy.wrap(squares).eq(41).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player one to make a horizontal winning square line that is above the bottom row', () => {
    cy.get('.grid .grid-square').then(squares => {
        cy.wrap(squares).eq(35).click();
        cy.wrap(squares).eq(36).click();
        cy.wrap(squares).eq(28).click();
        cy.wrap(squares).eq(37).click();
        cy.wrap(squares).eq(29).click();
        cy.wrap(squares).eq(21).click();
        cy.wrap(squares).eq(30).click();
        cy.wrap(squares).eq(38).click();
        cy.wrap(squares).eq(31).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player one to make a vertical winning square line that with no broken lines on the column', () => {
    cy.get('.grid .grid-square').then(squares => {
        cy.wrap(squares).eq(35).click();
        cy.wrap(squares).eq(36).click();
        cy.wrap(squares).eq(28).click();
        cy.wrap(squares).eq(37).click();
        cy.wrap(squares).eq(21).click();
        cy.wrap(squares).eq(38).click();
        cy.wrap(squares).eq(14).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player one to make a vertical winning square line with broken lines on the column', () => {
      cy.get('.grid .grid-square').then(squares => {
          cy.wrap(squares).eq(35).click();
          cy.wrap(squares).eq(28).click();
          cy.wrap(squares).eq(21).click();
          cy.wrap(squares).eq(36).click();
          cy.wrap(squares).eq(14).click();
          cy.wrap(squares).eq(37).click();
          cy.wrap(squares).eq(7).click();
          cy.wrap(squares).eq(38).click();
          cy.wrap(squares).eq(0).click();
      });

      cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player one to make a vertical winning square line at the rightmost column', () => {
    cy.get('.grid .grid-square').then(squares => {
        cy.wrap(squares).eq(41).click();
        cy.wrap(squares).eq(35).click();
        cy.wrap(squares).eq(34).click();
        cy.wrap(squares).eq(36).click();
        cy.wrap(squares).eq(27).click();
        cy.wrap(squares).eq(37).click();
        cy.wrap(squares).eq(20).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 1 Won!');
  });

  it('should allow player two to make a diagonal winning square line from left to right', () => {
    cy.get('.grid .grid-square').then(squares => {
      cy.wrap(squares).eq(38).click();
      cy.wrap(squares).eq(36).click();
      cy.wrap(squares).eq(37).click();
      cy.wrap(squares).eq(30).click();
      cy.wrap(squares).eq(31).click();
      cy.wrap(squares).eq(24).click();
      cy.wrap(squares).eq(39).click();
      cy.wrap(squares).eq(32).click();
      cy.wrap(squares).eq(25).click();
      cy.wrap(squares).eq(18).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 2 Won!');
  });

  it('should allow player two to make a diagonal winning square line from right to left', () => {
    cy.get('.grid .grid-square').then(squares => {
      cy.wrap(squares).eq(37).click();
      cy.wrap(squares).eq(38).click();
      cy.wrap(squares).eq(36).click();
      cy.wrap(squares).eq(30).click();
      cy.wrap(squares).eq(35).click();
      cy.wrap(squares).eq(29).click();
      cy.wrap(squares).eq(28).click();
      cy.wrap(squares).eq(22).click();
      cy.wrap(squares).eq(21).click();
      cy.wrap(squares).eq(14).click();
    });

    cy.get('.player-turn-display').should('contain.text', 'Player 2 Won!');
  });
});
describe('Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    cy.visit(''); // cypress.json, baseUrl
  })

  it ('side bar and primary pain', () => {
    // tow main parts: sideBar and primary pain
    cy.get('.layout-pane-primary').should('be.visible');
    // side bar should be hidden
    cy.get('.sideBar').should('not.exist');

    // toggle SideBar
    cy.get('[aria-label="Menu"]').click();
    cy.get('.layout-pane-primary').should('not.be.visible');
    cy.get('.sideBar').should('be.visible');

    cy.get('[aria-label="ArrowBack"]').click();
    cy.get('.layout-pane-primary').should('be.visible');
    cy.get('.sideBar').should('not.exist');
  });
});

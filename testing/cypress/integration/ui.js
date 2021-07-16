describe('UI', () => {
  beforeEach(() => {
    cy.visit(''); // cypress.json, baseUrl
  })

  it ('side bar and primary pain', () => {
    // tow main parts: sideBar and primary pain
    cy.get('.layout-pane-primary').should('be.visible');
    cy.get('.sideBar').should('be.visible');

    // toggle SideBar
    cy.get('[aria-label="Menu"]').click();
    cy.get('.sideBar').should('not.exist');

    cy.get('[aria-label="Menu"]').click();
    cy.get('.sideBar').should('be.visible');
  });

  it ('languages', () => {
    // default: English
    cy.get('[id="settingButton"]').contains('Setting');
    // change language
    cy.get('#settingButton').click();
    cy.get('#languageSeletc').click();
    cy.get('[data-value="zhHans"]').click();
    cy.get('button:contains("完成")').click();
  });
});

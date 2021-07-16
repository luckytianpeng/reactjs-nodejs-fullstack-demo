describe('Log In', () => {
  beforeEach(() => {
    cy.visit(''); // cypress.json, baseUrl
  })

  it ('', () => {
    // open log in dialog
    cy.get('button:contains("Account")').click();

    // type in email and password
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('test');

    // click 'Log In' button
    cy.get('button:contains("Log In")').should('be.enabled').click();

    // see the 'success' snach bar
    cy.get('[role="alert"]').should('be.visible');
    cy.get('div:contains("Success")').should('be.visible');

    // check cookie
    cy.getCookie('enchanted-notebook').should('exist');
  });
});

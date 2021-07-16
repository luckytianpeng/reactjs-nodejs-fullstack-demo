describe('Sign Up', () => {
  beforeEach(() => {
    cy.visit(''); // cypress.json, baseUrl
  })

  it ('', () => {
    cy.get('button:contains("Account")').click();

    cy.get('#email').type('test@test.com');
    cy.get('#password').type('test');
    cy.get('#repeatPassword').type('test');
    cy.get('#fullName').type('Tester');

    cy.get('button:contains("Sign Up")').should('be.enabled').click();

    cy.get('[role="alert"]').should('be.visible');
    cy.get('div:contains("Email has already existed")').should('be.visible');
  });
});

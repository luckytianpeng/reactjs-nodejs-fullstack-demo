describe('File System', () => {
  beforeEach(() => {
    cy.visit(''); // cypress.json, baseUrl
  })

  it ('', () => {
    // log in
    cy.get('button:contains("Account")').click();
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('test');
    cy.get('button:contains("Log In")').should('be.enabled').click();
    cy.getCookie('enchanted-notebook').should('exist');
    cy.get('button:contains("Done")').click();

    // file system:
    // operat the TreeView:
    cy.get('[path="~"]').click();

    // working directory is home - '~'
    cy.get('#wd').contains('~');

    // add an temporary directory
    // click the floating action button (FAB)
    cy.get('[aria-label="add"]').click();
    // choose the 'New Folder' MenuItem
    cy.get('li:contains("New Folder")').click();
    // type in the name
    cy.get('#name').type('temp');
    // confirm - click 'Ok' button
    cy.get('button:contains("Ok")').click();
    // see the 'success' snach bar
    cy.get('[role="alert"]').should('be.visible');
    cy.get('div:contains("Success")').should('be.visible');

    // enter 'temp'
    cy.get('.MuiListItem-container:contains("temp")').click();
    cy.get('#wd').contains('temp');

    // upload files
    // click the FAB
    cy.get('[aria-label="add"]').click();
    // choose the 'New Folder' MenuItem
    cy.get('li:contains("File Upload")').click();
    cy.get('#files').attachFile([
        'Pictures/049C57BF-08D8-4F7B-8FC0-EB6261C7D207.jpeg', 
        'Pictures/whats that.jpeg'
    ]);

    // rename
    cy.get('.MuiListItem-container:contains("whats that.jpeg") button').click();
    cy.get('li:contains("Rename")').click();
    // type in the name
    cy.get('#name').clear().type('for little pixies and fairies.jpeg');
    cy.get('button:contains("Ok")').click();

    cy.get('.MuiListItem-container:contains("the 1919 solar eclipse.jpg")').click();

    // back to '~'
    cy.get('#parentButton').click();
    
    // delete the temporary directory
    cy.get('li:contains("temp") button').click();
    cy.get('li:contains("Remove")').click();
  });
});

Cypress.Commands.add('login', (
    user = Cypress.env('user_name'),
    password = Cypress.env('user_password'),
    { cacheSession = true } = {},
) => {
    const login = () => {
        cy.visit('/users/sign_in')

        cy.get("[data-qa-selector='login_field']").type(user)
        cy.get("[data-qa-selector='password_field']").type(password, { log: false })
        cy.get("[data-qa-selector='sign_in_button']").click()
    }

    const validate = () => {
        cy.visit('/')
        cy.location('pathname', { timeout: 1000 })
            .should('not.eq', '/users/sign_in')
    }

    const options = {
        cacheAcrossSpecs: true,
        validate,
    }

    if (cacheSession) {
        cy.session(user, login, options)
    } else {
        login()
    }
})

Cypress.Commands.add('logout', () => {
    cy.get('img.qa-user-avatar').click()
    cy.contains('Sign out').click()
})

Cypress.Commands.add('gui_createProject', (project) => {
    cy.visit('/projects/new')
    cy.get('#project_name').type(project.name)
    cy.get('#project_description').type(project.description)
    cy.get('input#project_initialize_with_readme').check()
    cy.contains('Create project').click()
})

Cypress.Commands.add('gui_createIssue', (issue) => {
    cy.visit(`/${Cypress.env('user_name')}/${issue.project.name}/issues/new`)
    cy.get('input.qa-issuable-form-title').type(issue.title)
    cy.get('textarea.qa-issuable-form-description').type(issue.description)
    cy.get('input[value="Submit issue"]').click()

    cy.get('div.issue-details')
        .should('contain', issue.title)
        .and('contain', issue.description)
})

Cypress.Commands.add('gui_setLabelOnIssue', (label) => {
    cy.get('a.qa-edit-link-labels').click()
    cy.contains(label.name).click()
    cy.get('div.content-wrapper').click()
})

Cypress.Commands.add('gui_setMilestoneOnIssue', (milestone) => {
    cy.get('.block.milestone a').click()
        cy.contains(`milestone-${milestone.name}`).click()
})
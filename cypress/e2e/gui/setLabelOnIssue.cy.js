import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

describe('Set label on issue', options, () => {
    const issue = {
        title: `issue-${faker.datatype.uuid()}`,
        description: faker.random.words(3),
        project: {
            name: `project-${faker.datatype.uuid()}`,
            description: faker.random.words(5)
        }
    }

    const label = {
        name: `label-${faker.random.word()}`,
        color: '#ffaabb'
      }

    beforeEach(() => {
        cy.api_deleteProject()
        cy.login()
        cy.api_createIssue(issue)
            .then(response => {
                cy.api_createLabel(response.body.project_id, label)
            })
        cy.visit(`/${Cypress.env('user_name')}/${issue.project.name}/issues`)
    })
    it('successfully', () => {
        cy.contains(issue.title).click()
        cy.gui_setLabelOnIssue(label)
        cy.get('div.qa-labels-block span')
            .should('have.attr', 'style', `background-color: ${label.color}; color: #333333;`)
    })
});
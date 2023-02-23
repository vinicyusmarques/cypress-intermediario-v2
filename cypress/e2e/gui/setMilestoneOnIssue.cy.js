import { faker } from '@faker-js/faker'

const options = { env: { snapshotOnly: true } }

const accessToken = `Bearer ${Cypress.env('gitlab_access_token')}`

describe('Set a milestone on issue', options, () => {
    const issue = {
        title: `issue-${faker.datatype.uuid()}`,
        description: faker.random.words(3),
        project: {
            name: `project-${faker.datatype.uuid()}`,
            description: faker.random.words(5)
        }
    }

    const milestone = {
        name: `milestone-${faker.random.word()}`
    }


    beforeEach(() => {
        cy.api_deleteProject()
        cy.login()
        cy.api
        cy.api_createIssue(issue)
            .then(response => {
                cy.api_createMilestone(response.body.project_id, milestone)
                cy.visit(`${Cypress.env('user_name')}/${issue.project.name}/issues/${response.body.iid}`)
            })

    })
    it('successfully', () => {
        cy.contains(issue.title).click()
        cy.gui_setMilestoneOnIssue(milestone)
        cy.get('div.milestone')
            .should('contain', milestone.name)
    });
});
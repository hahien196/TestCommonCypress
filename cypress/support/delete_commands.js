/**
 * 
 */


Cypress.Commands.add("createAIssuingAgency", function() {
	cy.get('[ng-click = "showCreateIssuingAgencyModal()"]').click()
	cy.get('[ng-model="issuing_agency.name"]').type('Cơ sở 1')
	cy.get('[ng-model="issuing_agency.province_id"]').click()
	  .find('li[role="option"]')
	  .contains('An Giang').first().click();
	cy.get('[ng-model="issuing_agency.district_id"]').click()
	  .find('li[role="option"]')
	  .contains('An Phú').first().click();
	cy.get('[ng-model="issuing_agency.ward_id"]').click()
	  .find('li[role="option"]')
	  .contains('Khánh An').first().click()
	cy.get('.fa.fa-save').click()
	cy.wait(2000)
})

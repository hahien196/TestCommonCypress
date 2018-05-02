/**
 * 
 */

Cypress.Commands.add("validateAddFirst", function(inputs){
	
	let isValid = function(variable) {
		return (variable != null && variable != undefined && variable != ""
		|| (typeof variable === "number" && variable != NaN))
	};	
	cy.get('.pagination-last > .ng-binding').click();
	
	inputs.forEach(input => {
		if(isValid(input.index)){
			cy.get('.table>tbody> :first-child>:nth-child('+input.index+')')
			  .should('contain', input.value)
		}
	})
	
})

Cypress.Commands.add("validateAddLast", function(inputs){
	
	let isValid = function(variable) {
		return (variable != null && variable != undefined && variable != ""
		|| (typeof variable === "number" && variable != NaN))
	};
	cy.wait(4000);
	// đến trang danh sach cuối cùng
	/*
	cy.get('.pagination-last > .ng-binding').then(($btn)=>{
		if($btn.have.Attr('disabled')
			cy.log('btn disable');
		else 
			$btn.click();
			cy.wait(3000);
	})
	*/
	cy.get('.pagination-last > .ng-binding').click();
	cy.wait(3000);
	
	inputs.forEach(input => {
		if(isValid(input.index)){
			cy.get('.table>tbody>:last-child>:nth-child('+input.index+')')
			  .should('contain', input.value)
	
		}
			
	})
})

// validate fields get exactly text input
Cypress.Commands.add("validateInputField", function(testcase){
	
	testcase.inputs.forEach(input=>{
		if(input.type == "select")
			cy.get('div[ng-model="' + input.selector + '"]').find('a span')
			  .should('contain',input.value);
	})
	// click button Đóng
	cy.get('input[ng-click = "close()"]').click();
})
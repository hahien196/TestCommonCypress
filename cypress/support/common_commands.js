/*
 * created by hienht
 * date: 23/3/2018
 */

// click button 'Add/Update/Delete'
Cypress.Commands.add("clickButton", function(url){
	if (url.modal != undefined && url.modal != "")
		cy.get('a[ng-click="' + url.modal + '"]')
		  .first().click();
})

Cypress.Commands.add("getValueOfRow", function(index) {
	let arr = [];
	const numOfRow = cy.get('tbody>tr').length;
	const numOfColumn = cy.get('tbody>tr').eq(index-1).find('td').length;
	
	// lưu các trường dữ liệu của dòng vào mảng
	for(let i = 0; i < numOfColumn; i++){
		arr[i] = cy.get('tbody>:nth-child('+index+')>:nth-child('+(i+1)+')');
	}
	return arr;
})

Cypress.Commands.add("doLogin", function(user) {
	cy.get('input[name="email"]').type(user.email);
	cy.get('input[name="password"]').type(user.password)
	  .get('button[type="submit"]').click();
	cy.wait(1000);
	cy.url().should('not.include', '/signin');
})


// fill all required fields with values
Cypress.Commands.add("fillDatas", function(inputs){
	
	if (inputs != undefined && inputs.length > 0)
		inputs.forEach(input => {
			switch (input.type) {
				case "text":
					cy.get('[ng-model="'+ input.selector +'"]').clear()
					  .type(input.value)
					break;
				case "select":
					if (input.value != undefined){
						cy.get('[ng-model="' + input.selector + '"]').first().click()
						  .find('li[role="option"]')
						  .contains(input.value).first().click();
					}
					break;
			}
		});
		
})



Cypress.Commands.add("validateDeleteSuccessfully", function(url){
	/* Khoi tao 1 arraylist
	 * tinh maxColumnLengh cua table, vi du co 8 dong, gia su xoa dong 2
	 * for tu 0 den 7 de get cac value cua dong 2 vao arrayList
	 * 
	 * de validate khong con trong bang nua
	 * tao 1 bien falg ton tai = 0
	 * for tu dong 1 den dong cuoi cung i
	 * for tu cot 1 den cot cuoi cung j {
	 *  { neu cell [i][j] cua table ma co value khac voi array[j] thi break ra khoi vong for thu 2
	 *  neu j = cot cuoi cung va cell[i][i] = array[j] -> flag = true thi break }
	 *  neu flag = true break
	 * }
	 * validate: new falg = 0 thi true , =1 thi test case fail
	 * 
	*/ 
	// biến đánh dấu phần tử đã xóa xuất hiện
	let flag = false;
	
	let cell = [[]];
	
	for(let i = 0; i < numOfRow; i++){
		for(let j = 0; j < numOfColumn; j++){
			if(cell[i][j] != arr[j] ) break;
			
			if ((j == numOfColumn-1) && (cell[i][j] == arr[j])){
				flag = true;
				break;
			}
		}
		if (flag == 1) break;
	}
	
	expect(flag).to.be.false;
	
})
// validate text in toast message
Cypress.Commands.add("validateToastMessage", function(assert){
	cy.get('div.toast-message')//.trigger('mouseover') 
	  .should(assert.type, assert.data);
})

// validate error text when input invalid email/password
Cypress.Commands.add("validateInvalidText", function(assert){
	switch (assert.check){
	case "email":
		cy.get('div.toast-message')
		  .should(assert.type, assert.text);
		break;
	case "password":
		cy.get('div.text-error.ng-active>div')
		  .should(assert.type, assert.text);
		break;
	}
	
})

// validate first field of input is not exist at the all records
Cypress.Commands.add("validateAValueNotExist", function(testcase){
	//const numOfCollumn = cy.get('tbody tr').eq(1).find('td').length;
	
		let isValid = function(variable) {
			return (variable != null && variable != undefined && variable != ""
			|| (typeof variable == "number" && variable != NaN))
		};
		
		switch (testcase.pos){
			case "first":{
				testcase.inputs.forEach(input=>{
					if(isValid(input.index)){
						cy.get('.table>tbody>:first-child>:nth-child('
								+ input.index +')').should('not.contain',input.value);
					}
					
				})
				break;
				
			}
			case "last":{
				cy.get('.pagination-last > .ng-binding').click();
				cy.wait(3000);
				testcase.inputs.forEach(input=>{
					if(isValid(input.index))
						cy.get('.table>tbody>:last-child>:nth-child('
							+ input.index +')').should('not.contain',input.value);
				
				})
				break;
			}
		}
})



	

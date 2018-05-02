const delSuccess = require("../fixtures/Del_success.json");
const delCancel = require("../fixtures/Del_cancel.json");
const delChangeStt = require("../fixtures/Del_change_status.json");

const DeleteSuccess = [];
DeleteSuccess.push(delSuccess);
const DeleteCancel = [];
DeleteCancel.push(delCancel);
const DeleteChangeStt = [];
DeleteChangeStt.push(delChangeStt);

let isValid = function(variable) {
	return (variable != null && variable != undefined && variable != ""
	|| (typeof variable === "number" && variable != NaN))
};

describe('Deleteing change status successfully', function () {
	DeleteChangeStt.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+ url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);								
									// go to create form 
									cy.visit(url.path);
								})
								// change status of record to "Hoạt động" after deleting
								let after = url.after;
								afterEach(function(){
									cy.wait(6000);
									cy.get('[ng-click="'+after.modal+'"]').eq(testcase.pos-1).click();
									cy.wait(2000);
									cy.get('[ng-model="'+after.status_selector+'"]').click()
									  .find('li[role="option"]').contains('Hoạt động').click()
								})
								let assert = testcase.assert;
								it('Change status after deleting', function() {
									const buttonDelete = cy.get('a[ng-click="' + url.modal + '"]')
														  .eq(testcase.pos-1);//based index of eq = 0
									switch (assert.check){
										case 0:{
											if((assert.data == "Bạn chắc chắn muốn xóa")&&(isValid(assert.index))){
												//validate text message
												//cy.validateConfirmMessage(url);
												cy.get('tbody > :nth-child('+testcase.pos+') > :nth-child('+assert.index+')')
												  .invoke('text').then(function(text){
													  cy.log(text);
													  //const text = html;
													  cy.get('a[ng-click="' + url.modal + '"]').eq(testcase.pos-1).click();
													  cy.get('.bootbox-body').should(assert.type, assert.data +' "'+text+'"?');
													  cy.get('.modal-footer>button').contains('Đồng ý').click();	
												})
												
											} else {
												buttonDelete.click();
												cy.get('.modal-footer>button').contains('Đồng ý').click();
												cy.validateToastMessage(assert);
											}
											break;
										}
										case 1:
										{
											if(testcase.pos==0){
												/*
												 * validate for delete last record
												 * 1. navigate to last page of all records
												 * 2. click button "Xóa" and select "Đồng ý"
												 * 3. validate status of last record is changed to "Tạm dừng" 
												 */
												cy.get('.pagination-last > .ng-binding').click();
												cy.wait(2000);
												cy.get('a[ng-click="' + url.modal + '"]').last().click(); //click button "Xóa"
												cy.get('.modal-footer>button').contains('Đồng ý').click(); //  click button "Đồng ý"
												cy.wait(1000);
												cy.get('tbody>:last-child>:nth-child('+assert.index+')')
												  .should(assert.type, assert.data);
											}
											else {
												buttonDelete.click();
												cy.get('.modal-footer>button').contains('Đồng ý').click();
												cy.wait(3000);
												cy.get('tbody>:nth-child('+testcase.pos+')>:nth-child('+assert.index+')')
												  .should(assert.type, assert.data);	
											}
											break;
										}	
									}
								})
							})
						});
					})
				});
			})
		});
	});
})

describe('Deleteing successfully', function () {
	DeleteSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+ url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								// go to signin page, login as user and navigate to path
								beforeEach(function () {
									cy.visit("/signin")
									  .doLogin(user)	
									  .visit(url.path)
									  .wait(2000);
									cy.createAIssuingAgency();
								})
								//let validate = function(variable){
									
								
								let assert = testcase.assert;
								it("Validate case delete successfully", function(){
									const buttonDelete = cy.get('a[ng-click="' + url.modal + '"]')
									  					   .eq(testcase.pos-1);
									switch (assert.check){
										case 0:{
											if((assert.data == "Bạn chắc chắn muốn xóa")&&(isValid(assert.index))){
												//validate text message
												//cy.validateConfirmMessage(url);
												cy.get('tbody > :nth-child('+testcase.pos+') > :nth-child('+assert.index+')')
												  .invoke('text').then(function(text){
													  cy.log(text);
													  //const text = html;
													  cy.get('a[ng-click="' + url.modal + '"]').eq(testcase.pos-1).click();
													  cy.get('.bootbox-body').should(assert.type, assert.data +' "'+text+'"?');
													  cy.get('.modal-footer>button').contains('Đồng ý').click();	
												})
												
											} else {
												buttonDelete.click();
												cy.get('.modal-footer>button').contains('Đồng ý').click();
												cy.validateToastMessage(assert);
											}
											break;
										}
										case 1:{
											if(assert.data == ""){
												cy.get('tbody > :nth-child('+testcase.pos+') > :nth-child('+assert.index+')')
												  .invoke('html').then(function(text){
													  cy.log(text);
													  //const text = html;
													  cy.get('a[ng-click="' + url.modal + '"]')
													  .eq(testcase.pos-1).click();
													  cy.get('.modal-footer>button').contains('Đồng ý').click();
													  cy.wait(3000);
													  cy.get('tbody>:nth-child('+testcase.pos+')>:nth-child('+assert.index+')')
														.should(assert.type, text);
												})
											} else{
												cy.get('tbody >> :nth-child('+assert.index+')').contains(assert.data)
												  .parent().find(':nth-child(1)').invoke('html').then(function(html){
													cy.log(html)
													cy.get('a[ng-click="' + url.modal + '"]').eq(html-1).click();
													cy.get('.modal-footer>button').contains('Đồng ý').click();
													  cy.wait(3000);
													  cy.get('tbody>>:nth-child('+assert.index+')')
														.should(assert.type, assert.data);
												})
											}
										}
									}
								})
							})
						});
					})
				});
			})
		});
	});
})

describe('Cancel deleteing', function () {
	DeleteCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
			   	context('Account: '+ user.email, function(){
					user.urls.forEach(url =>{
						let testcase = url.testcases
						context(testcase.casename+'_'+url.path , function(){
							beforeEach(function () {
								// login
								cy.visit("/signin");
								cy.doLogin(user);
								// go to create form 
								cy.visit(url.path);
							})
							
							it('Validate no record is deleted', function() {
								cy.get('tbody > :nth-child('+testcase.pos+')> :nth-child('+testcase.index+')')
								  .invoke('text').then(function(text){
									cy.log(text)
									// Click button "Thêm"
									cy.get('a[ng-click="' + url.modal + '"]')
			  					      .eq(testcase.pos-1).click()
			  					    // Click button "Không đồng ý"
			  					    cy.get('.modal-footer>button').contains('Không đồng ý').click();
									// validate no record is not deleted
									cy.get('tbody > :nth-child('+testcase.pos+')> :nth-child('+testcase.index+')')
										.should('contain',text);
								})
								
							})
						})
					})
				})
			})
		})
	})
 })
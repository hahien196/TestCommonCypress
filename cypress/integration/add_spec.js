const addSuccess = require("../fixtures/Add_success.json");
const addFail = require("../fixtures/Add_fail.json");
const addCancel = require("../fixtures/Add_cancel.json");

const AddSuccess = [];
AddSuccess.push(addSuccess);

const AddFail = [];
AddFail.push(addFail);

const AddCancel = [];
AddCancel.push(addCancel);

let isValid = function(variable) {
	return (variable != null && variable != undefined && variable != ""
	|| (typeof variable === "number" && variable != NaN))
};

describe('Adding successfully', function () {
	AddSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+ url.path, function(){
						url.testcases.forEach(testcase =>{
							context('Testcase: '+ testcase.casename , function(){
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);								
									// go to create form 
									cy.visit(url.path);
								})
								let assert = testcase.assert;
								it('Validate add successfully', function() {
									
									// Click button "Thêm"
									cy.clickButton(url);
										
									// fill all required data
									cy.fillDatas(testcase.inputs);
									
									// validate add success
									
									if(assert.data == "input.value"){
										cy.validateInputField(testcase);
									}
									else {
										// click btn Lưu
										
										
										switch (assert.check){
											 case "1": {
                                                cy.get('i.fa-save').click();
                                                cy.wait(2000);
												 if(url.pos == "first")
														cy.validateAddFirst(testcase.inputs);
													 else 
														cy.validateAddLast(testcase.inputs);
													 break;
											 }
												 
											 case "0":{
												 cy.get('i.fa-save').click();
												 cy.validateToastMessage(assert);
												 break;
											 }
												 
										 }
									}
									
								})
								
								/* delete record in url.pos row
								afterEach(function(){
									
									cy.deleteByPos(url);
								})
								*/
							})
							
						});
					})
					
				});
			})
		});
   })

})

describe('Adding fail', function () {
	AddFail.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								
								before(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);
									
									// go to create form 
									cy.visit(url.path);
								})
								
								it('Validate display error text when input invalid email/password', function() {
									
									// Click button "Thêm"
									cy.clickButton(url);
									
									// fill some data
									cy.fillDatas(url.inputs);
									
									// fill email and password
									cy.fillDatas(testcase.datas);
									
									// Click button "Lưu"
									cy.get('i.fa-save').click();
									
									// validate text when input invalid datas
									cy.validateInvalidText(testcase.assert);
									
								})
							})
						});
					})
				});
			})
		});
   })
})

describe('Cancel adding', function () {
	AddCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.testcases.forEach(testcase =>{
					context(testcase.casename+'_'+testcase.path , function(){
						
						beforeEach(function () {
							// login
							cy.visit("/signin");
							cy.doLogin(user);
							
							// go to create form 
							cy.visit(testcase.path);
						})
						
						it('Validate no record is created', function() {
							
							// Click button "Thêm"
							cy.clickButton(testcase);
							
							// fill all required datas
							cy.fillDatas(testcase.inputs);
							
							// Click button "Đóng"
							cy.get('input[ng-click = "close()"]').click();
							
							// validate record is not created
							cy.validateAValueNotExist(testcase);
							
						})
					})
				});
			})
		});
   })

})
const success = require('../fixtures/Update_success.json');
const fail = require('../fixtures/Update_fail.json');
const cancel = require("../fixtures/Update_cancel.json");

const UpdateSuccess = [];
UpdateSuccess.push(success);

const UpdateFail = [];
UpdateFail.push(fail);

const UpdateCancel = [];
UpdateCancel.push(cancel);
//const UpdateCancel = [];
//UpdateCancel.push(updateCancel);

let isValid = function(variable) {
	return (variable != null && variable != undefined && variable != ""
	|| (typeof variable === "number" && variable != NaN))
};


let compareArrays = function (arr1, arr2){
	let flag = true;
	if(arr1.length != arr2.length) {
		flag = false;
	}
	for(let i = 0; i < arr1.length; i++){
		if (arr1[i] != arr2[i]) flag = false
	}
	return flag;
}

describe('Updating successfully', function () {
	UpdateSuccess.forEach(page=>{
	   page.users.forEach(user=>{
		   	context('Account: '+ user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);								
									// go to update form 
									cy.visit(url.path);
									cy.log('login done!');
								})
								
								it('Validate update successfully', function() {
									// validate update success
									let assert = testcase.assert;
									if(assert.data == "input.value"){
										switch (assert.check){
											case "1": {
												// Click icon "Sửa"
												cy.clickButton(url);
												// fill all required data
												cy.fillDatas(testcase.inputs);
												// click btn Lưu
												cy.get('i.fa-save').click();
												testcase.inputs.forEach(input=>{
													if(isValid(input.index))
                                                        cy.get('.table>tbody>:nth-child(' + testcase.pos
                                                            + ')>:nth-child(' + input.index + ')')
														   .should('contain', input.value);
												})	
												break;
											 }	
											 case "0":{
												const numOfRow = cy.get('tbody>tr').length;
												const numOfColumn = cy.get('tbody>tr').eq(1).find('td').length;
												let arr1 = [];
												// save all fields datas to array before updating to validate 
												for(let i = 0; i < numOfColumn; i++){
                                                    arr1[i] = cy.get('tbody>:nth-child(' + url.pos
                                                        + ')>:nth-child(' + (i + 1) + ')');
												}
												// Click icon "Sửa"
												if (url.modal != undefined && url.modal != "")
													cy.get('a[ng-click="' + url.modal + '"]')
													  .first().click();
												// click btn Lưu
												cy.get('i.fa-save').click();
												cy.wait(3000);
												let arr2 = [];
												// save all fields datas to array after updating to compare with array 1
												for(let i = 0; i < numOfColumn; i++){
													arr2[i] = cy.get('tbody>:nth-child('+url.pos+')>:nth-child('+(i+1)+')');
												}
												let validate = compareArrays(arr1, arr2);
												cy.log('compare done!');
												expect(validate).to.be.true;
											 }
											 break;
										}
									}
									else {
										// Click icon "Sửa"
										cy.clickButton(url);
										// fill all required data
										cy.fillDatas(testcase.inputs);
										// click btn Lưu
										cy.get('i.fa-save').click();
										cy.validateToastMessage(assert);
									}	
								})
							})
						});
					})
				});
			})
		});
   })
})

describe('Updating fail', function () {
	UpdateFail.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.urls.forEach(url =>{
					context('Path: '+url.path, function(){
						url.testcases.forEach(testcase =>{
							context(testcase.casename , function(){
								
								beforeEach(function () {
									// login
									cy.visit("/signin");
									cy.doLogin(user);
									
									// go to create form 
									cy.visit(url.path);
								})
								
								it('Validate display error text when input invalid email/password', function() {
									
									// Click icon "Sửa"
									cy.clickButton(url);
									
									// fill email and password
									let data = testcase.datas
									switch (data.type) {
										case "text":
											cy.get('[ng-model="'+ data.selector +'"]').clear().type(data.value)
											break;
										case "select":
											if (data.value != undefined){
												cy.get('[ng-model="' + data.selector + '"]').first().click()
												.find('li[role="option"]').contains(data.value).first().click();
											}
											break;
									}
									cy.log('fill data done');
									
									// Click button "Lưu"
									cy.get('i.fa-save').click();
									
									// validate text when input invalid datas
									cy.validateInvalidText(testcase.assert);
									
									cy.get('input[ng-click = "close()"]').click();
									
								})
							})
						});
					})
				});
			})
		});
   })
})

describe('Cancel updateing', function () {
	UpdateCancel.forEach(page=>{
	   page.users.forEach(user=>{
			context('Account: '+user.email, function(){
				user.urls.forEach(url =>{
					
					context(url.testcases.casename , function(){
						
						beforeEach(function () {
							// login
							cy.visit("/signin");
							cy.doLogin(user);
							
							// go to create form 
							cy.visit(url.path);
						})
						
						it('Validate no record is created', function() {
							
							// lưu các trường dữ liệu của dòng url.pos trước khi cập nhật vào mảng arr1
							const numOfRow = cy.get('tbody>tr').length;
							const numOfColumn = cy.get('tbody>tr').eq(1).find('td').length;
							
							let arr1 = [];
							
							for(let i = 0; i < numOfColumn; i++){
								cy.get('tbody>:nth-child('+url.pos+')>:nth-child('+(i+1)+')').invoke("html").then(function(html){
									arr1[i] = html;
									//cy.log(arr1[1]);
								})
							}
							
							// Click icon "Sửa"
							cy.clickButton(url);
							
							cy.get('input[ng-click = "close()"]').click();
							cy.wait(3000);
							
							let arr2 = [];
							
							// lưu các trường dữ liệu dòng url.pos sau khi hủy cập nhật vào mảng arr2
							for(let i = 0; i < numOfColumn; i++){
								cy.get('tbody>:nth-child('+url.pos+')>:nth-child('+(i+1)+')').invoke("html").then(function(html){
									arr2[i] = html;
								})
								//arr2[i] = cy.get('tbody>:nth-child('+url.pos+')>:nth-child('+(i+1)+')').invoke("html");
							}
							
							expect(compareArrays(arr1, arr2)).to.be.true;
							
							
							cy.log('Compare done!')
							
							
						})
					})
				});
			})
		});
   })
})

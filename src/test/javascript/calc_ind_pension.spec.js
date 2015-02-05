xdescribe("Pension Calculator", function(){

	describe("State Employee Retirement System", function(){
		beforeEach(function(){
			vals = new SERSVars();
			spyOn(vals, "getSystem").and.returnValue("SERS");
			person = pension.person();
			
		});
		
		describe("System Tiers", function(){			
			it("Should use Tier 1 for hire date before 1/1/2011", function(){
				person.hireDate = new PC.Date("1/1/1984");
				expect(pension.SERS.getTier(person)).toBe(1);
			});
			
			it("Should use Tier 2 for hire date after 1/1/2011", function(){
				person.hireDate = new PC.Date("1/1/2011");
				expect(pension.SERS.getTier(person)).toBe(2);
			});
		});
		
		describe("Multiplier", function(){
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(2);	
					person = pension.person();
				});
			
				it("Should fail if you are retiring at less than 62", function(){
					person.ageAtRetirement = 61;
					try{
						pension.SERS.constructModelData(person);
						expect(true).toBe(false);
					}catch(err){
						expect(err).toContain("You must be at least 62");
					}
				});

				it("Should fail if you have less than 10 years of service", function(){
					person.ageAtRetirement = 63;
					person.yearsOfService = 9;
					try{
						pension.SERS.constructModelData(person);
						expect(true).toBe(false);
					}catch(err){
						expect(err).toContain("You must have at least 10 years of service");
					}
				});	

				it("Should be 0.167 for someone with 10 years of service and eligible for social security ", function(){					
					person.ageAtRetirement = 63;
					person.yearsOfService = 10;
					model = pension.SERS.constructModelData(person);

					expect(model.getMultiplier()).toBeCloseTo(0.167);
				});	
				
				it("Should be 0.22 for someone with 10 years of service and not eligible for social security ", function(){
					person.ageAtRetirement = 63;
					person.yearsOfService = 10;
					person.occupation = 'policeOfficer';
					model = pension.SERS.constructModelData(person);
					
					expect(model.getMultiplier()).toBeCloseTo(0.22);
				});					
				
				it("Should Max out at .75", function(){
					person.ageAtRetirement = 63;
					person.yearsOfService = 55;
					model = pension.SERS.constructModelData(person);
					
					expect(model.getMultiplier()).toBeCloseTo(0.75);
				});					
			});
			
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(1);	
					person = pension.person();
				});

				it("Should fail if years of service and age at retirement don't add to 85 in order to retire before age 55", function(){
					person.ageAtRetirement = 54;
					person.yearsOfService = 30;
					
					try{
						pension.SERS.constructModelData(person);
						expect(true).toBe(false);
					}catch(err){
						expect(err).toContain("Your years of service and age at retirement must add to 85 in order to retire before age 55");
					}
				
				});				
			
				it("Should fail if less than 25 years of service in order to retire before age 60", function(){
					person.ageAtRetirement = 59;
					person.yearsOfService = 24;
					
					try{
						pension.SERS.constructModelData(person);
						expect(true).toBe(false);
					}catch(err){
						expect(err).toContain("You must have at least 25 years of service in order to retire");
					}			
				});
				
			it("Should fail if less than 8 years of service", function(){
				person.ageAtRetirement = 65;
				person.yearsOfService = 7;
					
				try{
					pension.SERS.constructModelData(person);
					expect(true).toBe(false);
				}catch(err){
					expect(err).toContain("You must have at least 8 years of service in order to retire");
				}
				
				});				
			});
		});
		
		describe("Benefit Reduction", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(1);	
					person = pension.person();
				});
				
				it("Should be zero if retire after age 60", function(){
					person.ageAtRetirement = 60;
					model = pension.SERS.constructModelData(person);
					expect(model.benefitReduction).toBe(0);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(2);	
					person = pension.person();
				});
				
				it("Should be zero if retire after age 67", function(){
					person.ageAtRetirement = 67;
					model = pension.SERS.constructModelData(person);					
					expect(model.benefitReduction).toBe(0);
				});
			});			
		});
			
		describe("Annual Pension Benefit", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(1);	
					person = pension.person();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					person.finalAverageSalary = 125000;
					model = pension.SERS.constructModelData(person);	
					spyOn(model, "getMultiplier").and.returnValue(0.25);
					model.benefitReduction = 0.0;
					expect(model.getAnnualPensionBenefit()).toBeCloseTo(31250);
				});
				
				it("Should not have a maximum", function(){
					person.finalAverageSalary = 500000;
					model = pension.SERS.constructModelData(person);						
					spyOn(model, "getMultiplier").and.returnValue(0.25);
					model.benefitReduction = 0.0;
					expect(model.getAnnualPensionBenefit()).toBeCloseTo(125000);
				});
				
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(2);	
					person = pension.person();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					person.finalAverageSalary = 125000;
					model = pension.SERS.constructModelData(person);						
					spyOn(model, "getMultiplier").and.returnValue(0.25);
					model.benefitReduction = 0.0;
					expect(model.getAnnualPensionBenefit()).toBeCloseTo(31250);
				});
				
				it("Should max out at $106,800", function(){
					person.finalAverageSalary = 500000;
					model = pension.SERS.constructModelData(person);						
					spyOn(model, "getMultiplier").and.returnValue(0.25);
					model.benefitReduction = 0.0;
					expect(model.getAnnualPensionBenefit()).toBeCloseTo(106800);
				});
			});			
		});
		
		
		describe("Cost of Living Adjustment (COLA)", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(1);	
					person = pension.person();
				});
				
				it("Should always start in year one", function(){
					person.ageAtRetirement = 65;
					model = pension.SERS.constructModelData(person);						
					expect(model.COLA.start).toBe(1);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(2);	
					person = pension.person();
				});
				
				it("Should start once retiree reaches the age of 67", function(){
					person.ageAtRetirement = 62;
					model = pension.SERS.constructModelData(person);						
					expect(model.COLA.start).toBe(67-62);
					
					person.ageAtRetirement = 68;
					model = pension.SERS.constructModelData(person);						
					expect(model.COLA.start).toBe(1);
					
				});
			});			
		});
		
		
		describe("Salary model", function(){
			beforeEach(function(){
				person = pension.person();
				
			});
			it("Should say I've worked 25 years if today is 2014 and I started in 1989", function(){
				person.hireYear=1989;
				expect(person.getYearsOfSvcAtYear(2014)).toBe(25);
			});
			
			it("Should say I retired after 25 years if I started in 1989, was born in 1949 and retired at age 65", function(){
				person.hireYear=1989;
				person.birthYear = 1949;
				person.ageAtRetirement = 65;
				expect(person.getYearsAtRetirement()).toBe(25);
			});
			
			describe("Salary at year", function(){
				
				beforeEach(function(){
					person.hireYear=1989;
					simYear = 2014;
					person.birthYear = 1949;
					person.ageAtRetirement = 65;
					
					person.initialSalary = 30000;
					person.currentSalary = 67000;
					person.finalAverageSalary = 75000;
					
				});
				
				it("Should be zero if the year is after retirement", function(){
					person.ageAtRetirement = 65;
					expect(person.getSalaryAtYear(26, simYear)).toBe(0);
				});
				
				it("Should be my initial salery my first year", function(){
					expect(person.getSalaryAtYear(0, simYear)).toBeCloseTo(30000);					
				});
				
				it("Should be my current salary if measured today", function(){
					simYear = 2000; // 11 years after hire date
					expect(person.getSalaryAtYear(11, simYear)).toBeCloseTo(67000);					
				});
				
				it("Should be my final salary if measured on my last year", function(){
					simYear = 2000; // 11 years after hire date
					expect(person.getSalaryAtYear(25, simYear)).toBeCloseTo(75000);					
				});				
				
			});
			
		});
		
		describe("Salary History", function(){
			beforeEach(function(){
				person.hireYear =1989;
				simYear = 2014;
				person.birthYear = 1949;
				person.ageAtRetirement = 65;
				
				person.initialSalary = 30000;
				person.currentSalary = 67000;
				person.finalAverageSalary = 75000;				
			});
			
			it("Should create 25 elements", function(){
				person.generateDefaultSalaryHistory(simYear);
				expect(person.salaryHistory.length).toBe(25);
			});
			
		});
		describe("Pension Annuity", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(pension.SERS, "getTier").and.returnValue(1);	
					person = pension.person();
					env = pension.environment();

				});
				
				it("Should be the annual benefit if you die the year after retirement", function(){
					person.ageAtRetirement = 65;
					person.ageAtDeath = 66;
														
					model = pension.SERS.constructModelData(person);		
					spyOn(model, "getAnnualPensionBenefit").and.returnValue(1000);
					
					var result = model.calculate(env);
					
					expect(result.annuity).toBeCloseTo(1000, 0);
					expect(result.benefitHistory.length).toBe(1);
				});
											
				it("Should match manhatten calculator", function(){
					person.ageAtRetirement = 65;
					person.finalAverageSalary = 75000;
					person.yearsOfService = 20;
					person.ageAtDeath = 85;
					
					env = pension.environment();
				
					model = pension.SERS.constructModelData(person);						
					var result = model.calculate(env);
					
					//expect(result.annuity).toBeCloseTo(548937, 0);
					expect(result.benefitHistory.length).toBe(85 - 65);

				});
			});
		});
			
		
		describe("Employee contribution", function(){
			it("Should be $8,000 for a year where I made $100,000 and I don't participate in social security", function(){
				person = pension.person();
				person.salaryHistory = [{"year":2014,"salary":100000,"yearsOfService":1}];
				
				spyOn(pension.SERS, "isCoveredBySocialSecurity").and.returnValue(false);
				spyOn(pension.SERS, "getTier").and.returnValue(2);	
				
				var model = pension.SERS.constructModelData(person);
				model.generateContributionHistory(person);				
				expect(model.contributionHistory[0].contribution).toBe(8000);
			});
			
			it("Should be $4,000 for a year where I made $100,000 and I do participate in social security", function(){
				person = pension.person();
				person.salaryHistory = [{"year":2014,"salary":100000,"yearsOfService":1}];
				
				spyOn(pension.SERS, "isCoveredBySocialSecurity").and.returnValue(true);
				spyOn(pension.SERS, "getTier").and.returnValue(2);	
				
				var model = pension.SERS.constructModelData(person);
				model.generateContributionHistory(person);				
				expect(model.contributionHistory[0].contribution).toBe(4000);
			});
			
			it("Should be a total lifetime contribution of $100,000 if employee contributes $4,000 for each of their 25 years", function(){
				person = pension.person();
				person.salaryHistory = [];
				for(var i = 0; i < 25; i++){
					person.salaryHistory.push({"year":1980+i,"salary":100000,"yearsOfService":i});				
				}
				spyOn(pension.SERS, "isCoveredBySocialSecurity").and.returnValue(true);
				spyOn(pension.SERS, "getTier").and.returnValue(2);	
				
				var model = pension.SERS.constructModelData(person);
				model.generateContributionHistory(person);				
				expect(model.totalContributions).toBe(100000);
			});

		});
	});

});
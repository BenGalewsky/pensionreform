describe("Pension Calculator", function(){

	describe("State Employee Retirement System", function(){
		beforeEach(function(){
			vals = new SERSVars();
			spyOn(vals, "getSystem").and.returnValue("SERS");
		});
		
		describe("System Tiers", function(){			
			it("Should use Tier 1 for hire date before 1/1/2011", function(){
				vals.hireDate = new PC.Date("1/1/1984");
				expect(vals.getTier()).toBe(1);
			});
			
			it("Should use Tier 2 for hire date after 1/1/2011", function(){
				vals.hireDate = new PC.Date("1/1/2011");
				expect(vals.getTier()).toBe(2);
			});
		});
		
		describe("Multiplier", function(){
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(2);	
					model = new SERSModel();

				});
			
				it("Should fail if you are retiring at less than 62", function(){
					vals.ageAtRetirement = 61;
					var rslt = model.multiplier(vals);
					
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must be at least 62");
				});

				it("Should fail if you have less than 10 years of service", function(){
					vals.ageAtRetirement = 63;
					vals.yearsOfService = 9;
					
					var rslt = model.multiplier(vals);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must have at least 10 years of service");
				});	

				it("Should be 0.167 for someone with 10 years of service and eligible for social security ", function(){
					vals.ageAtRetirement = 63;
					vals.yearsOfService = 10;
					expect(model.multiplier(vals)).toBeCloseTo(0.167);
				});	
				
				it("Should be 0.22 for someone with 10 years of service and not eligible for social security ", function(){
					vals.ageAtRetirement = 63;
					vals.yearsOfService = 10;
					vals.occupation = 'policeOfficer';
					expect(model.multiplier(vals)).toBeCloseTo(0.22);
				});					
				
				it("Should Max out at .75", function(){
					vals.ageAtRetirement = 63;
					vals.yearsOfService = 55;
					expect(model.multiplier(vals)).toBeCloseTo(0.75);
				});					
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(1);	
					model = new SERSModel();

				});

				it("Should fail if years of service and age at retirement don't add to 85 in order to retire before age 55", function(){
					vals.ageAtRetirement = 54;
					vals.yearsOfService = 30;
					
					var rslt = model.multiplier(vals);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("Your years of service and age at retirement must add to 85 in order to retire before age 55");
				
				});				
			
				it("Should fail if less than 25 years of service in order to retire before age 60", function(){
					vals.ageAtRetirement = 59;
					vals.yearsOfService = 24;
					
					var rslt = model.multiplier(vals);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must have at least 25 years of service in order to retire");
				
				});
				
			it("Should fail if less than 8 years of service", function(){
					vals.ageAtRetirement = 65;
					vals.yearsOfService = 7;
					
					var rslt = model.multiplier(vals);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must have at least 8 years of service in order to retire");
				
				});				
			});
		});
		
		describe("Benefit Reduction", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(1);	
					model = new SERSModel();
				});
				
				it("Should be zero if retire after age 60", function(){
					vals.ageAtRetirement = 60;
					expect(model.benefitReduction(vals)).toBe(0);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(2);	
					model = new SERSModel();
				});
				
				it("Should be zero if retire after age 67", function(){
					vals.ageAtRetirement = 67;
					expect(model.benefitReduction(vals)).toBe(0);
				});
			});			
		});
			
		describe("Annual Pension Benefit", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(1);	
					model = new SERSModel();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					vals.finalAverageSalary = 125000;
					spyOn(model, "multiplier").and.returnValue(0.25);
					spyOn(model, "benefitReduction").and.returnValue(0);
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(31250);
				});
				
				it("Should not have a maximum", function(){
					vals.finalAverageSalary = 500000;
					spyOn(model, "multiplier").and.returnValue(0.25);
					spyOn(model, "benefitReduction").and.returnValue(0);	
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(125000);

				});
				
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(2);	
					model = new SERSModel();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					vals.finalAverageSalary = 125000;
					spyOn(model, "multiplier").and.returnValue(0.25);
					spyOn(model, "benefitReduction").and.returnValue(0);
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(31250);
				});
				
				it("Should max out at $106,800", function(){
					vals.finalAverageSalary = 500000;
					spyOn(model, "multiplier").and.returnValue(0.25);
					spyOn(model, "benefitReduction").and.returnValue(0);	
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(106800);

				});
			});			
		});
		
		
		describe("Cost of Living Adjustment (COLA)", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(1);	
					model = new SERSModel();
				});
				
				it("Should always start in year one", function(){
					var cola = model.COLA(vals);
					expect(cola.start).toBe(1);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(2);	
					model = new SERSModel();
				});
				
				it("Should start once retiree reaches the age of 67", function(){
					vals.ageAtRetirement = 55;
					var cola = model.COLA(vals);
					expect(cola.start).toBe(67-55);
					
					vals.ageAtRetirement = 68;
					var cola = model.COLA(vals);
					expect(cola.start).toBe(1);
					
				});
			});			
		});
		
		
		describe("Salary model", function(){
			it("Should say I've worked 25 years if today is 2014 and I started in 1989", function(){
				vals.hireDate=new PC.Date("1/1/1989");
				
				var simDate = new PC.Date("1/1/2014");
				expect(vals.getYearsOfSvcAtDate(simDate)).toBe(25);
			});
			
			it("Should say I retired after 25 years if I started in 1989, was born in 1949 and retired at age 65", function(){
				vals.hireDate=new PC.Date("1/1/1989");				
				simDate = new PC.Date("1/1/2014");
				vals.birthDate = new PC.Date("1/1/1949");
				vals.ageAtRetirement = 65;
				expect(vals.getYearsAtRetirement()).toBe(25);
			});
			
			describe("Salary at year", function(){
				
				beforeEach(function(){
					vals.hireDate=new PC.Date("1/1/1989");				
					simDate = new Date("1/1/2014");
					vals.birthDate = new PC.Date("1/1/1949");
					vals.ageAtRetirement = 65;
					
					vals.initialSalary = 30000;
					vals.currentSalary = 67000;
					vals.finalAverageSalary = 75000;
					
				});
				
				it("Should be zero if the year is after retirement", function(){
					vals.ageAtRetirement = 65;
					expect(vals.getSalaryAtYear(26, simDate)).toBe(0);
				});
				
				it("Should be my initial salery my first year", function(){
					expect(vals.getSalaryAtYear(0, simDate)).toBeCloseTo(30000);					
				});
				
				it("Should be my current salary if measured today", function(){
					simDate = new PC.Date("1/1/2000"); // 11 years after hire date
					expect(vals.getSalaryAtYear(11, simDate)).toBeCloseTo(67000);					
				});
				
				it("Should be my final salary if measured on my last year", function(){
					simDate = new PC.Date("1/1/2000"); // 11 years after hire date
					expect(vals.getSalaryAtYear(25, simDate)).toBeCloseTo(75000);					
				});				
				
			});
			
		});
		
		describe("Pension Annuity", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").and.returnValue(1);	
					model = new SERSModel();
					calculator = pension.calculator(model);
				});
				
				it("Should match manhatten calculator", function(){
					vals.ageAtRetirement = 65;
					vals.finalAverageSalary = 75000;
					vals.yearsOfService = 20;
				
					var result = calculator.calculate(vals);
					
					expect(result.annuity.female).toBeCloseTo(548937, 0);
					expect(result.annuity.male).toBeCloseTo(492696, 0);
				});
			});
		});
			
		
		describe("Employee contribution", function(){
			it("Should be $8,000 for a year where I made $100,000 and I don't participate in social security", function(){
				spyOn(vals, "isCoveredBySocialSecurity").and.returnValue(false);
				spyOn(vals, "getSalaryAtYear").and.returnValue(100000);
				
				expect(model.employeeContributionAtYear(vals, 1)).toBe(8000);
			});
			
			it("Should be $4,000 for a year where I made $100,000 and I do participate in social security", function(){
				spyOn(vals, "isCoveredBySocialSecurity").and.returnValue(true);
				spyOn(vals, "getSalaryAtYear").and.returnValue(100000);
				
				expect(model.employeeContributionAtYear(vals, 1)).toBe(4000);
			});
			
			it("Should be a total lifetime contribution of $100,000 if employee contributes $4,000 for each of their 25 years", function(){
				spyOn(vals, "getYearsAtRetirement").and.returnValue(25);
				
				model = new SERSModel();
				spyOn(model, "employeeContributionAtYear").and.returnValue(4000);

				calculator = pension.calculator(model);

				expect(calculator.calculateTotalContributions(vals)).toBe(100000);
			});

		});
	});

});
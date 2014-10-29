describe("Pension Calculator", function(){
	describe("State Employee Retirement System", function(){
		beforeEach(function(){
			vals = new SERSVars();
			spyOn(vals, "getSystem").andReturn("SERS");
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
					spyOn(vals, "getTier").andReturn(2);	
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
					spyOn(vals, "getTier").andReturn(1);	
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
					spyOn(vals, "getTier").andReturn(1);	
					model = new SERSModel();
				});
				
				it("Should be zero if retire after age 60", function(){
					vals.ageAtRetirement = 60;
					expect(model.benefitReduction(vals)).toBe(0);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").andReturn(2);	
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
					spyOn(vals, "getTier").andReturn(1);	
					model = new SERSModel();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					vals.finalAverageSalary = 125000;
					spyOn(model, "multiplier").andReturn(0.25);
					spyOn(model, "benefitReduction").andReturn(0);
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(31250);
				});
				
				it("Should not have a maximum", function(){
					vals.finalAverageSalary = 500000;
					spyOn(model, "multiplier").andReturn(0.25);
					spyOn(model, "benefitReduction").andReturn(0);	
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(125000);

				});
				
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").andReturn(2);	
					model = new SERSModel();
				});
				
				it("Should be $31,250 if final average salary is $125,000 and benefit multiplier is 0.25 with no reduction", function(){
					vals.finalAverageSalary = 125000;
					spyOn(model, "multiplier").andReturn(0.25);
					spyOn(model, "benefitReduction").andReturn(0);
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(31250);
				});
				
				it("Should max out at $106,800", function(){
					vals.finalAverageSalary = 500000;
					spyOn(model, "multiplier").andReturn(0.25);
					spyOn(model, "benefitReduction").andReturn(0);	
					expect(model.annualPensionBenefit(vals)).toBeCloseTo(106800);

				});
			});			
		});
		
		
		describe("Cost of Living Adjustment (COLA)", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").andReturn(1);	
					model = new SERSModel();
				});
				
				it("Should always start in year one", function(){
					var cola = model.COLA(vals);
					expect(cola.start).toBe(1);
				});
			});
			
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").andReturn(2);	
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
		
		describe("Pension Annuity", function(){
			describe("Tier 1", function(){
				beforeEach(function(){
					spyOn(vals, "getTier").andReturn(1);	
					model = new SERSModel();
					calculator = new PensionCalculator(model);
				});
				
				it("Should match manhatten calculator", function(){
					vals.ageAtRetirement = 65;
					vals.finalAverageSalary = 75000;
					vals.yearsOfService = 20;
				
					var result = calculator.calculate(vals);
					
					expect(result.female).toBeCloseTo(548937, 0);
					expect(result.male).toBeCloseTo(492696, 0);
				});
			});
		});
			
	});

});
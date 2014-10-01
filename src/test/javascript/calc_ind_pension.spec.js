describe("Pension Calculator", function(){
	describe("State Employee Retirement System", function(){
		beforeEach(function(){
			vals = PC.systems.IL;
			vals.requirements.occupation = 'hacker';
			spyOn(window, "getSystem").andReturn("SERS");	
		});
		
		describe("System Tiers", function(){			
			it("Should use Tier 1 for hire date before 1/1/2011", function(){
				vals.requirements.hireDate = new PC.Date("1/1/1984");
				expect(getTier(vals.requirements)).toBe(1);
			});
			
			it("Should use Tier 2 for hire date after 1/1/2011", function(){
				vals.requirements.hireDate = new PC.Date("1/1/2011");
				expect(getTier(vals.requirements)).toBe(2);
			});
		});
		
		describe("Multiplier", function(){
			describe("Tier 2", function(){
				beforeEach(function(){
					spyOn(window, "getTier").andReturn(2);	
				});
			
				it("Should fail if you are retiring at less than 62", function(){
					vals.requirements.ageAtRetirement = 61;
					
					var rslt = PC.systems.IL.calcBenefitMultiplier(vals.requirements);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must be at least 62");
				});

				it("Should fail if you have less than 10 years of service", function(){
					vals.requirements.ageAtRetirement = 63;
					vals.requirements.yearsOfService = 9;
					
					var rslt = PC.systems.IL.calcBenefitMultiplier(vals.requirements);
					expect(typeof(rslt)).toEqual('string');
					expect(rslt).toContain("You must have at least 10 years of service");
				});	

				it("Should be 0.167 for someone with 10 years of service and eligible for social security ", function(){
					vals.requirements.ageAtRetirement = 63;
					vals.requirements.yearsOfService = 10;
					expect(PC.systems.IL.calcBenefitMultiplier(vals.requirements)).toBeCloseTo(0.167);
				});	
				
				it("Should be 0.22 for someone with 10 years of service and not eligible for social security ", function(){
					vals.requirements.ageAtRetirement = 63;
					vals.requirements.yearsOfService = 10;
					vals.requirements.occupation = 'policeOfficer';
					expect(PC.systems.IL.calcBenefitMultiplier(vals.requirements)).toBeCloseTo(0.22);
				});					
				
				it("Should Max out at .75", function(){
					vals.requirements.ageAtRetirement = 63;
					vals.requirements.yearsOfService = 55;
					expect(PC.systems.IL.calcBenefitMultiplier(vals.requirements)).toBeCloseTo(0.75);
				});					
			});
		});
	});

});
describe('Model Test', function(){
    beforeEach(function() {
        person = pension.person();
        model = pension.model(person);
    });

	describe('Multiplier', function(){
		it('should be 0.15 for someone who works ten years with an annual multiplier of 0.015', function(){
			person.yearsOfService = 10;
			model.annualMultiplier = 0.015;			
			expect(model.getMultiplier()).toBe(0.15);			
		});
		
		it('should be 0.5 for someone who works ten years with an annual multiplier of 0.06 and a max multiplier of 0.5', function(){
			person.yearsOfService = 10;
			model.annualMultiplier = 0.06;
			model.maxMultiplier = 0.5;
			expect(model.getMultiplier()).toBe(0.5);						
		});
	});
	
	describe('Pension Benefit', function(){
		beforeEach(function(){
            spyOn(model, 'getMultiplier').and.returnValue(0.2);
			model.maxAnnualPension = 2000;	
			model.benefitReduction = 0.0;			
		});
		
		it('should be $1,000 if the final avg salary was $5,000 and the benefit multiplier is 0.2 and no benefit reduction', function(){
			person.finalAverageSalary = 5000;
			expect(model.getAnnualPensionBenefit()).toBe(1000);												
		});
		
		it('should be $750 if the final avg salary was $5,000 and the benefit multiplier is 0.2 and benefit reduced by 25%', function(){
			person.finalAverageSalary = 5000;
			model.benefitReduction = 0.25;
			expect(model.getAnnualPensionBenefit()).toBe(750);												
		});
		
		it('should be $2,000 if the final avg salary was $50,000 and the benefit multiplier is 0.2 and no benefit reduction and $2,000 max pension', function(){
			person.finalAverageSalary = 50000;
			expect(model.getAnnualPensionBenefit()).toBe(2000);												
		});		
		
	});
		
	describe('Annuity Calculation', function(){
		beforeEach(function(){
			cola = pension.COLA();
			aEnv = pension.environment();
			aEnv.DISCOUNT_RATE = 0.0;			
		});
		
		it('should be annual pension times years of service for no cola and no inflation', function(){	
			spyOn(cola, 'rateForYear').and.returnValue(0.0);			
			var rslt = model.calculateAnnuity(
                    cola, 
                    5000,
				    60, 
                    70, 
                    aEnv);
                    
            expect(rslt.annualPension).toBe(5000);
            expect(rslt.annuity).toBe(5000 * 10);								
		});
		
		it('should be (annual pension + 10%) times years of service if flat cola of 10% and no inflation', function(){
			spyOn(cola, 'rateForYear').and.returnValue(0.1);
			aEnv.DISCOUNT_RATE = 0.0;
			var rslt = model.calculateAnnuity(
                    cola, 
                    5000,
				    60, 
                    70, 
                    aEnv);
                    
            expect(rslt.annualPension).toBe(5000);
            expect(rslt.annuity).toBe((5000 * 1.1) * 9 + 5000);								
			
		});
		
		it('should return a pension history with reversed accumulated cost', function(){
			spyOn(cola, 'rateForYear').and.returnValue(0.0);	
			person.retirementYear = 2015;
			var rslt = model.calculateAnnuity(
                    cola, 
                    5000,
				    60, 
                    70, 
                    aEnv);
			
			expect(rslt.benefitHistory.length).toBe(10);
			expect(rslt.benefitHistory[9].year).toBe(2024);
			expect(rslt.benefitHistory[9].age).toBe(69);
			expect(rslt.benefitHistory[9].benefit).toBe(5000);
			expect(rslt.benefitHistory[9].presentValue).toBe(5000);
			expect(rslt.benefitHistory[9].accumulatedCost).toBe(5000);
			expect(rslt.benefitHistory[8].accumulatedCost).toBe(5000 * 2);
			expect(rslt.benefitHistory[7].accumulatedCost).toBe(5000 * 3);
			expect(rslt.benefitHistory[0].accumulatedCost).toBe(5000 * 10);
			
		});
				
	});
});
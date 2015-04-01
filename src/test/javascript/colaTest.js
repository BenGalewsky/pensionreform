describe('Cola Test', function(){
    beforeEach(function() {
        person = pension.person();
        model = pension.model(person);
    });

	
	describe('Cost of Living Adjustments', function(){
		beforeEach(function(){
			cola = pension.COLA();
			cola.start = 1;
			cola.rate = 0.03;
			cola.compounded = false;			
		});
		
		it('should be zero in the first year', function(){
			expect(cola.rateForYear(0, 0)).toBe(0.0);
		});
		
		it('should be 0.03 in the second year if rate is 3% non-compounding', function(){
			expect(cola.rateForYear(1, 0)).toBe(0.03);
		});
		
		it('should be 0.09 in the third year if rate is 3% non-compounding', function(){
			var colaRate  = 0.0;
			
			colaRate = cola.rateForYear(0, colaRate);
			expect(colaRate).toBe(0.0);
			
			colaRate = cola.rateForYear(1, colaRate);
			expect(colaRate).toBe(0.03);
			
			colaRate = cola.rateForYear(2, colaRate);
			expect(colaRate).toBe(0.06);
			
			colaRate = cola.rateForYear(3, colaRate);
			expect(colaRate).toBe(0.09);
		});

		it('should be 0.09 in the third year if rate is 3% with compounding', function(){
			cola.compounded = true;
			var colaRate  = 0.0;
			
			colaRate = cola.rateForYear(0, colaRate);
			expect(colaRate).toBe(0.0);
			
			colaRate = cola.rateForYear(1, colaRate);
			expect(colaRate).toBeGreaterThan(0.03);
			
			colaRate = cola.rateForYear(2, colaRate);
			expect(colaRate).toBeCloseTo(0.0608);
			
			colaRate = cola.rateForYear(3, colaRate);
			expect(colaRate).toBeCloseTo(0.092727 );
		});

		
	});
					
});
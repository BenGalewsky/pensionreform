var pension = pension || {};
pension.calculator = function(amodel) {	
	var that = {
			model: amodel,
			DISCOUNT_RATE: 0.03,
			MAX_AGE: 114,
			
			calculate: function(vals){
				var cola = this.model.COLA(vals);
				var annualPension = this.model.annualPensionBenefit(vals);
				var rslt = this.calculateAnnuity(cola.rate, cola.max, cola.start, cola.compounded, annualPension, vals.ageAtRetirement);
				
				rslt.discountRate = this.DISCOUNT_RATE;
				rslt.maxAge = this.MAX_AGE;
				rslt.multiplier = this.model.multiplier(vals);
				rslt.benefitReduction = this.model.benefitReduction(vals);
				return rslt;
			},
			
			calculateAnnuity: function(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, age) {
				var discount = 1.0, COLA = 0.0, maleMort = 1.0, femaleMort = 1.0;
				var rslt = {
						cola: COLAStart,
						annualPension: annualPension												
				};
				
				var annuityCost = {
					male: 0.0,
					female: 0.0
				};
				
				for (var i = 0, imax = this.MAX_AGE - age; i < imax; i++) {
					if (i) {
						discount /= 1 + this.DISCOUNT_RATE;
						if (i >= COLAStart) {
							var rate;
							if (typeof(COLARate) == "function") {
								rate = COLARate(i);
							} else {
								rate = COLARate;
							}
							
							if (COLACompounded) {
								COLA = (COLA + 1) * (1 + rate) - 1;
							} else {
								COLA += rate;
							}
						}
						
						maleMort *= (1 - PC.mortalityRates.male[age + i - 1]);
						femaleMort *= (1 - PC.mortalityRates.female[age + i - 1]);
					}
				 
					var payment = (!COLAMax || COLAMax >= annualPension) ? annualPension*(1+COLA) : COLAMax*COLA + annualPension;
					annuityCost.male += payment * discount * maleMort;
					annuityCost.female += payment * discount * femaleMort;
				console.log("age:",age+i,", paymt:",payment,", pd:",payment*discount," pdm:",payment*discount*maleMort,"mort:",maleMort,"rate",PC.mortalityRates.male[age + i - 1],"cost:", annuityCost.male)
				}
				rslt.annuity = annuityCost; 
				return rslt;
			},
			
			calculateTotalContributions: function(vals){
				var totalContrib = 0;
				
				for(var i = 0; i < vals.getYearsAtRetirement(); i++){
					totalContrib += this.model.employeeContributionAtYear(vals,i);
				}
				
				return totalContrib;					
			}
	};
	
	return that;
	
	
};


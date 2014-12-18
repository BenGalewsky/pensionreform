var pension = pension || {};
pension.model = function(aPerson) {	
	var that = {
			person: aPerson,
			minRetirementAge: {},
			minYearsOfService:  {},
			eligibleForSoSec: false,
			maxMultiplier: {},
			annualMultiplier: {},
			benefitReduction: {},
			maxAnnualPension: {},
			COLA: {},
			contribPct: {},
			totalContributions: {},
			
			getMultiplier: function(){
				benefitMultiplier = person.yearsOfService * this.annualMultiplier;
				if (benefitMultiplier > this.maxMultiplier) benefitMultiplier = this.maxMultiplier;
				
				return benefitMultiplier;
			},
			
			getAnnualPensionBenefit: function(){
				var benefitMultiplier = this.getMultiplier();
				var pension = aPerson.finalAverageSalary * benefitMultiplier * (1 - this.benefitReduction);
				
				// Saturate pension
				if( pension > this.maxAnnualPension){
					pension = this.maxAnnualPension;
				}
				return pension;
			},
			
			
			calculate: function(aEnv){
				
				var rslt = this.calculateAnnuity(this.COLA.rate, 
						this.COLA.max, 
						this.COLA.start, this.COLA.compounded, 
						this.getAnnualPensionBenefit(), 
						person.ageAtRetirement,
						aEnv);
				
				return rslt;
			},
			
			calculateAnnuity: function(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, age, aEnv) {
				var discount = 1.0, COLA = 0.0, maleMort = 1.0, femaleMort = 1.0;
				var rslt = {
						cola: COLAStart,
						annualPension: annualPension												
				};
				
				var annuityCost = {
					male: 0.0,
					female: 0.0
				};
				
				for (var i = 0, imax = aEnv.MAX_AGE - age; i < imax; i++) {
					if (i) {
						discount /= 1 + aEnv.DISCOUNT_RATE;
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
				console.log("age:",age+i,", paymt:",payment,", pd:",payment*discount," pdm:",payment*discount*maleMort,"mort:",maleMort,"rate",PC.mortalityRates.male[age + i - 1],"cost:", annuityCost.male);
				}
				rslt.annuity = annuityCost; 
				return rslt;
			},
			
			generateContributionHistory: function(aPerson){
				this.contributionHistory = [];
				this.totalContributions = 0;
				
				for(var i = 0; i < aPerson.salaryHistory.length; i++){
					var copyOfHist = aPerson.salaryHistory[i].clone();
					copyOfHist.contribution = copyOfHist.salary * this.contribPct;					
					this.contributionHistory.push(copyOfHist);					
					this.totalContributions += copyOfHist.contribution;
				}							
			}
			
	};
	
	return that;
	
};
function PensionCalculator(amodel){
	this.model = amodel;
	this.DISCOUNT_RATE = 0.03;
	this.MAX_AGE = 114;

};


PensionCalculator.prototype.calculate = function(vals){
	var cola = this.model.COLA(vals);
	var annualPension = this.model.annualPensionBenefit(vals);
	var annuity = this.calculateAnnuity(cola.rate, cola.max, cola.start, cola.compounded, annualPension, vals.ageAtRetirement);
	vals.cola=cola;
        vals.annualPension=annualPension;
        vals.annuity=annuity;
	return annuity;
};


PensionCalculator.prototype.calculateAnnuity = function(COLARate, COLAMax, COLAStart, COLACompounded, annualPension, age) {
	var discount = 1.0, COLA = 0.0, maleMort = 1.0, femaleMort = 1.0;
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
	}
	
	return annuityCost;
}

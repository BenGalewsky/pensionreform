pension = pension || {};

function SERSModel(){

};
SERSModel.prototype.multiplier = function(vals){
		var system = vals.getSystem();
		var tier = vals.getTier();

		var coveredBySocialSecurity = true;
        if (vals.occupation == 'policeOfficer')
            coveredBySocialSecurity = false;

		if (tier == 1) {                    
            var useAlternativeFormula = vals.IL_SERSAlternativeFormula;
			if (useAlternativeFormula) {
				if ( (vals.ageAtRetirement < 50) || 
						(vals.ageAtRetirement < 55 && vals.yearsOfService < 25) || 
						(vals.yearsOfService < 20) ){
							useAlternativeFormula = false;
				}
            }
						
            if (useAlternativeFormula) {
				var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.025 : 0.03);
				if (benefitMultiplier > 0.80) benefitMultiplier = 0.80;				
				return benefitMultiplier;
			} else {
				if (vals.ageAtRetirement < 55 && vals.yearsOfService + vals.ageAtRetirement < 85) return 'Your years of service and age at retirement must add to 85 in order to retire before age 55 in the State Employees\' Retirement System of Illinois.';
				if (vals.ageAtRetirement < 60 && vals.yearsOfService < 25) return "You must have at least 25 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
				if (vals.yearsOfService < 8) return "You must have at least 8 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
							
				var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.0167 : 0.022);
				if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
				
				return benefitMultiplier;
			}
		}else if (tier == 2) {
            if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the State Employees' Retirement System of Illinois.";
			if (vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
			
			
			var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.0167 : 0.022);
			if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
			
			return benefitMultiplier;
		}else{			
			return "not implemented";				
		}
	}

SERSModel.prototype.benefitReduction = function(vals){
	var benefitReduction = 0;
	var tier = vals.getTier();
	
	if(tier == 1){
		if (vals.ageAtRetirement < 60) {
			benefitReduction = 0.06 * (60 - vals.ageAtRetirement);
		}
	}else if(tier == 2){
		if (vals.ageAtRetirement < 67) {
			benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
		}
	}
	return benefitReduction;
}
	
SERSModel.prototype.annualPensionBenefit = function(vars){
	var benefitMultiplier = this.multiplier(vars);
	var benefitReduction = this.benefitReduction(vars);
	var pension = vars.finalAverageSalary * benefitMultiplier * (1 - benefitReduction);
        var tier = vars.getTier();
	
	// Saturate pension
	if(tier == 2 && pension > 106800){
		pension = 106800;
	}
vars.benefitMultiplier=benefitMultiplier;
vars.benefitReduction=benefitReduction;
vars.tier=tier;
	return pension;
}		

SERSModel.prototype.COLA = function(vals){
	var result = new COLA();
	result.rate = 0.03;
	if(vals.getTier() == 2){
		result.start = 67 - vals.ageAtRetirement;
		if (result.start < 1) result.start = 1;
	}else{
		result.start = 1;
	}
	return result;
}
	

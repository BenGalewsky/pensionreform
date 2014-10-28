
function SERSModel(){

};
SERSModel.prototype.multiplier = function(vars){
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
	
	

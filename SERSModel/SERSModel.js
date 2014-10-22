
function SERSModel(){

};
SERSModel.prototype.multiplier = function(vars){
		var system = vals.getSystem();
		var tier = vals.getTier();

		var coveredBySocialSecurity = true;
        if (vals.occupation == 'policeOfficer')
            coveredBySocialSecurity = false;

		if (tier == 2) {
            if (vals.ageAtRetirement < 62) return "You must be at least 62 in order to retire in the State Employees' Retirement System of Illinois.";
			if (vals.yearsOfService < 10) return "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
			
			var benefitReduction = 0;
			if (vals.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - vals.ageAtRetirement);
			}
			
			var benefitMultiplier = vals.yearsOfService * ((coveredBySocialSecurity) ? 0.0167 : 0.022);
			if (benefitMultiplier > 0.75) benefitMultiplier = 0.75;
			
			return benefitMultiplier;
		}
		return "not implemented";				
	}
	
	

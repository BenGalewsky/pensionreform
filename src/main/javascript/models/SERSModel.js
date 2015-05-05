pension = pension || {};

pension.SERS = {
	constructModelData : function(aPerson, aEnv) {

		var modelData = pension.model(aPerson);
                if(aEnv==undefined) aEnv=new pension.environment();
                modelData.env=aEnv;
		var tier = this.getTier(aPerson);
		
		modelData.eligibleForSoSec = this.isCoveredBySocialSecurity(aPerson);
		
		this.constructMultiplier(aPerson, modelData);
		modelData.benefitReduction = this.getBenefitReduction(aPerson);
		
		// This really should be max pensionabl salry
		modelData.maxAnnualPension = (tier == 2) ? 106800:Infinity;
		modelData.COLA = this.constructCOLA(aPerson);

		//contribPct can be a rate or a function(year)... 
                modelData.contribPct = modelData.eligibleForSoSec ? 0.04 : 0.08;

		return modelData;

	},
	
	constructMultiplier: function(aPerson, aModel){
		var tier = this.getTier(aPerson);

		if (tier == 1) {                    
            var useAlternativeFormula = aPerson.useAlternativeFormula;
            
			if (useAlternativeFormula) {
				if ( (aPerson.ageAtRetirement < 50) || 
						(aPerson.ageAtRetirement < 55 && aPerson.yearsOfService < 25) || 
						(aPerson.yearsOfService < 20) ){
							useAlternativeFormula = false;
				}
            }
						
            if (useAlternativeFormula) {
            	aModel.annualMultiplier = ((aModel.eligibleForSoSec) ? 0.025 : 0.03);
            	aModel.maxMultiplier = 0.80;				
			} else {
				if (aPerson.ageAtRetirement < 55 && aPerson.yearsOfService + aPerson.ageAtRetirement < 85) throw 'Your years of service and age at retirement must add to 85 in order to retire before age 55 in the State Employees\' Retirement System of Illinois.';
				if (aPerson.ageAtRetirement < 60 && aPerson.yearsOfService < 25) throw "You must have at least 25 years of service in order to retire at age "+aPerson.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
				if (aPerson.yearsOfService < 8) throw "You must have at least 8 years of service in order to retire at age "+aPerson.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
							
				aModel.annualMultiplier = ((aModel.eligibleForSoSec) ? 0.0167 : 0.022);
				aModel.maxMultiplier = 0.75;				
			}
		}else if (tier == 2) {
            if (aPerson.ageAtRetirement < 62) throw "You must be at least 62 in order to retire in the State Employees' Retirement System of Illinois.";
			if (aPerson.yearsOfService < 10) throw "You must have at least 10 years of service in order to retire at age "+vals.ageAtRetirement+" in the State Employees' Retirement System of Illinois.";
						
			aModel.annualMultiplier = ((aModel.eligibleForSoSec) ? 0.0167 : 0.022);
			aModel.maxMultiplier = 0.75;			
		}else{			
			throw "not implemented";				
		}					
	},
	
	isCoveredBySocialSecurity : function(aPerson) {
		var coveredBySocialSecurity = false;
		if (aPerson.occupation == 'policeOfficer')
			coveredBySocialSecurity = true;
		return coveredBySocialSecurity;
	},

	getTier : function(aPerson) {
		return (aPerson.hireYear<2011) ? 1 : 2;
	},
	
	getBenefitReduction: function(aPerson){
		var benefitReduction = 0;
		var tier = this.getTier(aPerson);
		
		if(tier == 1){
			if (aPerson.ageAtRetirement < 60) {
				benefitReduction = 0.06 * (60 - aPerson.ageAtRetirement);
			}
		}else if(tier == 2){
			if (aPerson.ageAtRetirement < 67) {
				benefitReduction = 0.06 * (67 - aPerson.ageAtRetirement);
			}
		}
		return benefitReduction;
	},
	
	constructCOLA: function(aPerson){
            //rate can be a function(age) or a flat rate...
            //result can also have a max property which is a dollar amount establishing the most that you can apply the rate to... so payment= currentBenefit+(max*rate), without the max it is currentBenefit*(1+rate)...
            //result can also have a compounded property where if true, the rate grows in a compounded way rate in year 2=(rate+1)*(1+rate)-1=.0609, otherwise it grows linearally such that rate in year 2= rate+rate=.06
            //start is the age that you can start acrewing COLA...
		var result = pension.COLA();
		result.rate = 0.03;
		if(this.getTier(aPerson) == 2){
			result.start = 67 - aPerson.ageAtRetirement;
			if (result.start < 1) result.start = 1;
		}else{
			result.start = 1;
		}
		return result;
	},


};


	

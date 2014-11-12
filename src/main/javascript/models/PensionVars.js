
function SERSVars(){
		this.hireDate = {};
		this.birthDate = {};
		this.initialSalary = {};
		this.currentSalary = {};
		
		this.ageAtRetirement = {}
		this.occupation = {
            standards: ['teacher', 'judge', 'policeOfficer'],
            hint: "Police Officers include State police, conservation police, SOS investigators and similar."
        };
		IL_pensionSystem = {
			standards: ['GARS', 'SURS', 'SERS'],
			askIf: [
			    ['occupation'],
			    function (args) {
			    	return (args.occupation != 'teacher' && args.occupation != 'judge' && args.occupation != 'policeOfficer' && args.occupation != 'fireFighter');
			    }
			]      
		};
		IL_SERSAlternativeFormula = {
			askIf: [
			    ['occupation', 'hireDate', 'IL_pensionSystem'],
			    function (vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
			    	return (system == 'SERS' && tier == 1);
			    }
			]      
		};
		
		finalAverageSalary = {
			prereqs: [
			    ["occupation", "hireDate", "IL_pensionSystem", "IL_SERSAlternativeFormula"],
			    function(vals) {
			    	var system = getSystem(vals);
					var tier = getTier(vals);
					var hint;
					if (system == 'SERS' && tier == 1) {
						if (vals.IL_SERSAlternativeFormula) {
							hint = "Rate of pay on the last day of employment, or the average of the last 48 months of compensation, whichever is greater.";
						} else {
							hint = "Highest 48 consecutive months of service with the last 120 months of service.";
						}
					}
					if (system == 'SERS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'GARS' && tier == 1) {
						hint = "Salary on the last day of service.";
					}
					if (system == 'GARS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'JRS' && tier == 1) {
						hint = "Salary on the last day of employment as a judge or for any terminating service after July 14, 1995, the highest salary received as a judge for at least 4 consecutive years, whichever is greater, after 20 years of service.";
					}
					if (system == 'JRS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'TRS' && tier == 1) {
						hint = "Average of the four highest consecutive annual salary rates within the last 10 years of service.";
					}
					if (system == 'TRS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					if (system == 'SURS' && tier == 1) {
						hint = "Average annual earnings during the 4 consecutive academic years of service which his or her earnings were the highest.";
					}
					if (system == 'SURS' && tier == 2) {
						hint = "Highest salary 8 years out of last 10 years of service";
					}
					PC.dataItems.finalAverageSalary.setHint('IL', hint);
			    }
			]
		}
	
};

SERSVars.prototype.getSystem = function(){
	var system;
	if (this.occupation == 'teacher') {
		system = 'TRS';
	} else if (this.occupation == 'judge') {
		system = 'JRS';
    } else if (this.occupation == 'policeOfficer' || this.occupation == 'fireFighter') {
        system = 'SERS';
	} else {
		system = IL_pensionSystem
	}
	return system;
};

SERSVars.prototype.getTier = function(){
	return (this.hireDate.isBefore('1/1/2011')) ? 1 : 2;
};

SERSVars.prototype.getYearsOfSvcAtDate = function(d){
	
};
SERSVars.prototype.getSalaryAtYear = function(yearOfSvc){
	
	
	
};
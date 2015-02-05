var pension = pension || {};
var curryr = new Date();
pension.person = function(aEnv) {

    if (aEnv === undefined)
        aEnv = pension.environment();

    var that = {
        env : aEnv,
        hireYear : 2000,
        birthYear : 1970,
        ageAtDeath : 82,
        currentYear : curryr.getFullYear(), // This should move to env
        currentAge : null,
        ageAtRetirement : 65,
        currentSalary : 70000,
        startingSalary : null,
        endingYear : null,
        endingSalary : null,
        yearsOfService : null,
        finalAverageSalary : null,
        gender : "f",
        active : null,// true or false...
        salaryHistory : [],
        occupation : "",
        useAlternativeFormula : false,
        isCoveredBySocialSecurity : false,
        totalContributions : null,
        models : {},// will be used to store calculated outputs...

        computeCurrentAge : function() {
            if (!this.birthYear || !this.currentYear) {
                throw "Missing data";
            }
            this.currentAge = this.currentYear - this.birthYear;
        },

        getMortalityTable : function() {
            return pension.mortalityRates[this.gender == 'f' ? "female" : "male"];
        },

        // Should be get probability of reaching person's age of death
        getProbabilityOfDeath : function() {
            if (!this.gender || !this.currentAge || !this.ageAtDeath)
                return "?";
            var tbl = this.getMortalityTable();
            var prob = 1;
            for ( var i in tbl) {
                if (i > this.currentAge && i <= this.ageAtDeath)
                    prob *= (1 - tbl[i]);
            }
            return Math.round((prob) * 100) + "%";
        },

        getProbableAgeAtDeath : function() {
            if (!this.gender || !this.currentAge)
                return 0;
            var tbl = this.getMortalityTable();
            var prob = 1;
            var age = 0;
            for ( var i in tbl) {
                if (tbl.hasOwnProperty(i) && i > this.currentAge) {
                    age = i;
                    prob *= (1 - tbl[i]);
                }

                if (prob < 0.501) {
                    break;
                }
            }
            return age;
        },

        obsgetYearsOfSvcAtYear : function(y) {
            var years = y - this.hireYear;
            return years;
        },

        obsgetYearsAtRetirement : function() {
            var yearOfRetirement = this.birthYear + this.ageAtRetirement;
            return this.getYearsOfSvcAtYear(yearOfRetirement);
        },

        obsgetRetirementYear : function() {
            var dateOfRetirement = this.birthYear + this.ageAtRetirement;
            return dateOfRetirement;
        },

        // Estimate the employee's salary at any given year of their tenure
        // We know three points: Their initial salary, their current salary and
        // their
        // estimated final average salary.
        // Pass in an optional simYear to establish what date "current" is
        // relative
        // to their salary history.
        obsgetSalaryAtYear : function(yearOfSvc, simYear) {
            // How many years of service today?
            simYear = simYear || curryr.getFullYear();

            // simYear = new PC.Date(simYear);
            var currentYears = this.getYearsOfSvcAtYear(simYear);
            var yearsAtRetirement = this.getYearsAtRetirement();

            // Have they already retired?
            if (yearOfSvc > yearsAtRetirement) {
                return 0;
            }

            // Prepare for interpolation
            var x0 = 0;
            var x1 = 0;
            var y0 = 0;
            var y1 = 0;

            // Is this year in the past? If so then interpolate between intial
            // salary and current
            if (yearOfSvc <= currentYears) {
                x1 = currentYears;
                y0 = this.initialSalary;
                y1 = this.currentSalary;
            } else { // Interpolate between current and final
                x0 = currentYears;
                x1 = yearsAtRetirement;
                y0 = this.currentSalary;
                y1 = this.finalAverageSalary;
            }

            // Default value
            var x = y1;

            // Avoid divide by zero
            if (x1 != yearOfSvc) {
                x = y0 + (y1 - y0) * ((yearOfSvc - x0) / (x1 - yearOfSvc));
            }
            return x;

        },

        finalAvgFromCurrentSalary : function(c, r) {
            if (c == undefined)
                c = this.currentSalary;
            if (r == undefined)
                r = 1 + this.env.WAGE_INFLATION;
            if (!this.currentYear || !this.endingYear)
                return 0;
            var finalSalary = Math.round(c * Math.pow((1 + this.env.WAGE_INFLATION), (this.endingYear - this.currentYear)));
            // we have the final Salary, now do the inverse of the next
            // function...
            return Math.round(c / 4 * (Math.pow(r, -3) + Math.pow(r, -2) + Math.pow(r, -1) + 1));
        },

        finalFromFinalAvgSalary : function(f, r) {
            if (f == undefined)
                f = this.finalAverageSalary;
            if (r == undefined)
                r = 1 + this.env.WAGE_INFLATION;
            // if s1=s0*(r)^yrs and we want to average the last four years then
            // start with the final salary and go backwards with
            //  
            // f=finalAvgSalary
            return f * 4 / (Math.pow(r, -3) + Math.pow(r, -2) + Math.pow(r, -1) + 1);
        },

        isActiveOrRetired : function() {// retired or inactive...
            if (!this.birthYear || !(this.endingYear || this.yearsOfService || this.ageAtRetirement))
                this.active = null;
            else {

                var lastYear = 0;
                if (this.endingYear)
                    lastYear = this.endingYear;
                else if (this.yearsOfService)
                    lastYear = this.hireYear + this.yearsOfService;
                else
                    lastYear = this.birthYear + this.ageAtRetirement;
                this.active = (lastYear >= this.currentYear);

            }
            return this.active;
        },

        setCurrentYear : function() {
            if (!this.currentYear)
                this.currentYear = curryr.getFullYear();
        },

        // uses current salary to estimate ending salary
        estimateFromCurrent : function() {
            this.setCurrentYear();
            this.endingSalary = Math.round(this.currentSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.endingYear - this.currentYear)));
            this.startingSalary = Math.round(this.currentSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.hireYear - this.currentYear)));
            this.generateDefaultSalaryHistory();
        },

        // uses ending salary to estimate other salaries
        estimateFromEnding : function() {
            this.setCurrentYear();
            this.currentSalary = Math.round(this.endingSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.currentYear - this.endingYear)));
            this.startingSalary = Math.round(this.endingSalary
                    * Math.pow((1 + this.env.WAGE_INFLATION), (this.hireYear - this.endingYear)));
            this.generateDefaultSalaryHistory();
        },

        // uses finalAvgSalary to estimate other salaries
        estimateFromFinalAvg : function() {
            this.endingSalary = Math.round(this.finalFromFinalAvgSalary());
            this.estimateFromEnding();
        },

        // this will create a salary history array from estimated data points
        // Assumes we know beginning and ending years and salaries, also current
        // if an active employee...
        generateDefaultSalaryHistory : function() {
            if (!this.hireYear || !this.startingSalary || !this.currentSalary || !this.endingSalary || !this.endingYear)
                ;
            this.salaryHistory = [];

            // calculate start to current ...
            var yr1 = this.currentYear;
            var yr0 = this.hireYear;

            var s1 = this.currentSalary, s0 = this.startingSalary;
            var r = (1 + this.env.WAGE_INFLATION);// rate of inflation between
            // salary points...
            // recalculated below.
            var sal = 0;// salary... calculated below...
            var i;

            // but only if current is less than ending year...
            if (this.currentYear <= this.endingYear) {
                r = Math.pow(s1 / s0, 1 / (yr1 - yr0));// determine the rate of
                // inflation between yr0
                // and yr1...
                for (i = yr0; i < yr1; i++) {
                    sal = Math.round(s0 * Math.pow(r, i - yr0));
                    this.salaryHistory.push({
                        "year" : i,
                        "salary" : sal,
                        "yearsOfService" : 1,
                        "contribution" : Math.round(sal * 0.08)
                    });
                }

                // move current to start...
                yr0 = yr1;
                s0 = s1;
            }

            // now calculate from start (or current) to ending year...
            s1 = this.endingSalary;
            yr1 = this.endingYear;
            r = Math.pow(s1 / s0, 1 / (yr1 - yr0));
            for (i = yr0; i <= yr1; i++) {
                sal = s0;
                if (yr1 != yr0)
                    sal = Math.round(s0 * Math.pow(r, i - yr0));

                this.salaryHistory.push({
                    "year" : i,
                    "salary" : sal,
                    "yearsOfService" : 1,
                    "contribution" : Math.round(sal * 0.08)
                });
            }

        },

        // this will create a salary history array from estimated data points
        // Assumes we know beginning and ending years and salaries, also current
        // if an active employee...
        obsolete_generateDefaultSalaryHistory : function() {
            if (!this.hireYear || !this.startingSalary || !this.currentSalary || !this.endingSalary || !this.endingYear)
                // take starting, current, and ending salary info and convert to
                // salary history array
                // also compute final average in 4 best of last 10 years..
                this.salaryHistory = [];

            // estimate start, current, and ending year/salary if they are not
            // provided...
            yr1 = this.getRetirementYear();// based on birthYear and
            // RetirementAge

            // check to see if the years of service are less than
            // retireyear-hireyear
            // if so, then use years of service as basis for ending year...
            if (!this.endingYear) {
                if (this.yearsOfService && this.yearsOfService < yr1 - this.hireYear)
                    yr1 = this.hireYear + this.yearsOfService;
                this.endingYear = yr1;
            }

            // reset yr1 to resulting ending year... for use below.
            yr1 = this.endingYear;

            // now recalculate endingSalary if needed...
            if (!this.endingSalary) {
                // assume average wage inflation of 4% for two years after the
                // average
                if (this.finalAverageSalary)
                    this.endingSalary = Math.round(this.finalFromFinalAvgSalary(this.finalAverageSalary,
                            (1 + this.env.WAGE_INFLATION)));
                else if (this.currentSalary)
                    this.endingSalary = Math.round(this.currentSalary
                            * Math.pow((1 + this.env.WAGE_INFLATION), (yr1 - aCurrentYear)));
            }
            ;

            if (!this.yearsOfService)
                this.yearsOfService = this.endingYear - this.hireYear;
            if (!this.startingSalary)
                this.startingSalary = Math.round(this.endingSalary / Math.pow((1 + this.env.WAGE_INFLATION), this.yearsOfService));

            if (aCurrentYear <= this.endingYear && !this.currentSalary)
                this.currentSalary = Math.round(this.endingSalary
                        / Math.pow((1 + this.env.WAGE_INFLATION), this.endingYear - aCurrentYear));

            // calculate start to current ...
            var yr1 = aCurrentYear;
            var yr0 = this.hireYear;

            var s1 = this.currentSalary, s0 = this.startingSalary;
            var r = (1 + this.env.WAGE_INFLATION);// rate of inflation between
            // salary points...
            // recalculated below.
            var sal = 0;// salary... calculated below...
            var i;

            // but only if current is less than ending year...
            if (aCurrentYear <= this.getRetirementYear()) {
                r = Math.pow(s1 / s0, 1 / (yr1 - yr0));// determine the rate of
                // inflation between yr0
                // and yr1...
                for (i = yr0; i < yr1; i++) {
                    sal = Math.round(s0 * Math.pow(r, i - yr0));
                    this.salaryHistory.push({
                        "year" : i,
                        "salary" : sal,
                        "yearsOfService" : 1,
                        "contribution" : Math.round(sal * 0.08)
                    });
                }

                // move current to start...
                yr0 = yr1;
                s0 = s1;
            }

            // now calculate from start (or current) to ending year...
            s1 = this.endingSalary;
            yr1 = this.endingYear;
            r = Math.pow(s1 / s0, 1 / (yr1 - yr0));
            for (i = yr0; i <= yr1; i++) {
                sal = s0;
                if (yr1 != yr0)
                    sal = Math.round(s0 * Math.pow(r, i - yr0));

                this.salaryHistory.push({
                    "year" : i,
                    "salary" : sal,
                    "yearsOfService" : 1,
                    "contribution" : Math.round(sal * 0.08)
                });
            }
            this.computeFinalAverageSalary();
        },

        computeFinalAverageSalary : function() {
            // calculate the average best 4 years in last 10...
            var last10yrs = this.salaryHistory.slice(-10);
            last10yrs.sort(function(a, b) {
                return a.salary - b.salary;
            });
            last10yrs = last10yrs.slice(-4);
            this.avgYr = 0;// avgYr and this.finalAverageSalary become the
            // first coordinates of the finalAverageSalary Line
            // on the graph...
            this.finalAverageSalary = 0;
            for (var i = 0; i < last10yrs.length; i++) {
                this.avgYr += last10yrs[i].year;
                this.finalAverageSalary += last10yrs[i].salary;
            }

            this.finalAverageSalary = Math.round(this.finalAverageSalary / last10yrs.length);

            this.avgYr = Math.round(this.avgYr / last10yrs.length);
        },
        computeYearsOfService : function() {
            var t = 0;
            for (var i = 0; i < this.salaryHistory.length; i++) {
                t += this.salaryHistory[i].yearsOfService;
            }
            this.yearsOfService = t;
        }

    };

    return that;

};
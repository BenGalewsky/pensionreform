PC.MINIMUM_WORKING_AGE = 12;

PC.dataItems.yearsOfService = new PC.DataItem.Exact.Int({
	name: 'Years of Service',
	question: "How many years of service will you have at retirement?",
	inputSize: 3,
	min: 1,
	max: 80,
	complexityMultiplier: 0.9,
   	checks: [
	    ['ageAtRetirement'],
	    function (yearsOfService, args) {
	    	if (yearsOfService + PC.MINIMUM_WORKING_AGE > args.ageAtRetirement) return PC.dataItems.ageAtRetirement.getName() + " must be at least "+PC.MINIMUM_WORKING_AGE+" greater than " + PC.dataItems.yearsOfService.getName();
	    }
	],
	order: 30
});

PC.dataItems.yearsOfServiceBy1September2005 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of September 1, 2005',
	question: "How many years of service credit do you have as of September 1, 2005?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1September2005, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("9/1/2005"));
 	    	if (yearsOfServiceBy1September2005 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1September2005, args) {
 	        var yearsSince2005 = Math.floor(args.retirementDate.yearDiff("9/1/2005"));
 	        var minYears = args.yearsOfService - yearsSince2005;
 	    	if (yearsOfServiceBy1September2005 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1September2005, args) {
 	        if (yearsOfServiceBy1September2005 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 31
});

PC.dataItems.yearsOfServiceBy1January2000 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of January 1, 2000',
	question: "How many years of service credit do you have as of January 1, 2000?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1January2000, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/2000"));
 	    	if (yearsOfServiceBy1January2000 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1January2000, args) {
 	        var yearsSince2000 = Math.floor(args.retirementDate.yearDiff("1/1/2000"));
 	        var minYears = args.yearsOfService - yearsSince2000;
 	    	if (yearsOfServiceBy1January2000 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1January2000, args) {
 	        if (yearsOfServiceBy1January2000 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 32
});

PC.dataItems.yearsOfServiceBetween1January2000And1July2011 = new PC.DataItem.Exact.Int({
	name: 'Years of Service between January 1, 2000 and July 1, 2011',
	question: "How many years of service credit do you have between January 1, 2000 and July 1, 2011?",
	inputSize: 3,
	min: 0,
	max: 11,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['yearsOfService', 'yearsOfServiceBy1January2000'],
 	    function (yearsOfServiceBetween1January2000And1July2011, args) {
 	        var maxYears = args.yearsOfService - args.yearsOfServiceBy1January2000;
 	        if (yearsOfServiceBetween1January2000And1July2011 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.yearsOfService.getName() + " and " + PC.dataItems.yearsOfServiceBy1January2000.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBetween1January2000And1July2011, args) {
 	        if (yearsOfServiceBetween1January2000And1July2011 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1January2011 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of January 1, 2011',
	question: "How many years of service credit do you have as of January 1, 2011?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1January2011, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/2011"));
 	    	if (yearsOfServiceBy1January2011 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1January2011, args) {
 	        var yearsSince2011 = Math.floor(args.retirementDate.yearDiff("1/1/2011"));
 	        var minYears = args.yearsOfService - yearsSince2011;
 	    	if (yearsOfServiceBy1January2011 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1January2011, args) {
 	        if (yearsOfServiceBy1January2011 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 32
});

PC.dataItems.yearsOfServiceBy1January2012 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of January 1, 2012',
	question: "How many years of service credit do you have as of January 1, 2012?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1January2012, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/2012"));
 	    	if (yearsOfServiceBy1January2012 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1January2012, args) {
 	        var yearsSince2012 = Math.floor(args.retirementDate.yearDiff("1/1/2012"));
 	        var minYears = args.yearsOfService - yearsSince2012;
 	    	if (yearsOfServiceBy1January2012 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1January2012, args) {
 	        if (yearsOfServiceBy1January2012 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1January2014 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of January 1, 2014',
    question: "How many years of service credit do you have as of January 1, 2014?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1January2014, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/2014"));
            if (yearsOfServiceBy1January2014 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1January2014, args) {
            var yearsSince2014 = Math.floor(args.retirementDate.yearDiff("1/1/2014"));
            var minYears = args.yearsOfService - yearsSince2014;
            if (yearsOfServiceBy1January2014 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1January2014, args) {
            if (yearsOfServiceBy1January2014 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});

PC.dataItems.yearsOfServiceBy1January1991 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of January 1, 1991',
    question: "How many years of service credit do you have as of January 1, 1991?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1January1991, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/1991"));
            if (yearsOfServiceBy1January1991 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1January1991, args) {
            var yearsSince1991 = Math.floor(args.retirementDate.yearDiff("1/1/1991"));
            var minYears = args.yearsOfService - yearsSince1991;
            if (yearsOfServiceBy1January1991 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1January1991, args) {
            if (yearsOfServiceBy1January1991 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});

PC.dataItems.yearsOfServiceBy1January1997 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of January 1, 1997',
    question: "How many years of service credit do you have as of January 1, 1997?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1January1997, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("1/1/1997"));
            if (yearsOfServiceBy1January1997 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1January1997, args) {
            var yearsSince1997 = Math.floor(args.retirementDate.yearDiff("1/1/1997"));
            var minYears = args.yearsOfService - yearsSince1997;
            if (yearsOfServiceBy1January1997 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1January1997, args) {
            if (yearsOfServiceBy1January1997 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});

PC.dataItems.yearsOfServiceBy1October2009 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of October 1, 2009',
	question: "How many years of service credit do you have as of October 1, 2009?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1October2009, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("10/1/2009"));
 	    	if (yearsOfServiceBy1October2009 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1October2009, args) {
 	        var yearsSince2001 = Math.floor(args.retirementDate.yearDiff("10/1/2009"));
 	        var minYears = args.yearsOfService - yearsSince2001;
 	    	if (yearsOfServiceBy1October2009 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1October2009, args) {
 	        if (yearsOfServiceBy1October2009 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1July2001 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of July 1, 2001',
	question: "How many years of service credit do you have as of July 1, 2001?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1July2001, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/2001"));
 	    	if (yearsOfServiceBy1July2001 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1July2001, args) {
 	        var yearsSince2001 = Math.floor(args.retirementDate.yearDiff("7/1/2001"));
 	        var minYears = args.yearsOfService - yearsSince2001;
 	    	if (yearsOfServiceBy1July2001 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1July2001, args) {
 	        if (yearsOfServiceBy1July2001 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1July2007 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of July 1, 2007',
    question: "How many years of service credit do you have as of July 1, 2007?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1July2007, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/2007"));
            if (yearsOfServiceBy1July2007 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1July2007, args) {
            var yearsSince2007 = Math.floor(args.retirementDate.yearDiff("7/1/2007"));
            var minYears = args.yearsOfService - yearsSince2007;
            if (yearsOfServiceBy1July2007 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1July2007, args) {
            if (yearsOfServiceBy1July2007 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});

PC.dataItems.yearsOfServiceBy1July1980 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of July 1, 1980',
	question: "How many years of service credit do you have as of July 1, 1980?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1July1980, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/1980"));
 	    	if (yearsOfServiceBy1July1980 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1July1980, args) {
 	        var yearsSince1980 = Math.floor(args.retirementDate.yearDiff("7/1/1980"));
 	        var minYears = args.yearsOfService - yearsSince1980;
 	    	if (yearsOfServiceBy1July1980 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1July1980, args) {
 	        if (yearsOfServiceBy1July1980 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1July1975 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of July 1, 1975',
	question: "How many years of service credit do you have as of July 1, 1975?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1July1975, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/1975"));
 	    	if (yearsOfServiceBy1July1975 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1July1975, args) {
 	        var yearsSince1975 = Math.floor(args.retirementDate.yearDiff("7/1/1975"));
 	        var minYears = args.yearsOfService - yearsSince1975;
 	    	if (yearsOfServiceBy1July1975 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1July1975, args) {
 	        if (yearsOfServiceBy1July1975 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1July2008 = new PC.DataItem.Exact.Int({
	name: 'Years of Service as of July 1, 2008',
	question: "How many years of service credit do you have as of July 1, 2008?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.8,
   	checks: [
 	    ['hireDate'],
 	    function (yearsOfServiceBy1July2008, args) {
 	        var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/2008"));
 	    	if (yearsOfServiceBy1July2008 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
 	    },
 	    ['retirementDate', 'yearsOfService'],
 	    function (yearsOfServiceBy1July2008, args) {
 	        var yearsSince2008 = Math.floor(args.retirementDate.yearDiff("7/1/2008"));
 	        var minYears = args.yearsOfService - yearsSince2008;
 	    	if (yearsOfServiceBy1July2008 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
 	    },
 	    ['yearsOfService'],
 	    function (yearsOfServiceBy1July2008, args) {
 	        if (yearsOfServiceBy1July2008 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 33
});

PC.dataItems.yearsOfServiceBy1July1990 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of July 1, 1990',
    question: "How many years of service credit do you have as of July 1, 1990?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1July1990, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/1990"));
            if (yearsOfServiceBy1July1990 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1July1990, args) {
            var yearsSince1990 = Math.floor(args.retirementDate.yearDiff("7/1/1990"));
            var minYears = args.yearsOfService - yearsSince1990;
            if (yearsOfServiceBy1July1990 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1July1990, args) {
            if (yearsOfServiceBy1July1990 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});
////////////////

PC.dataItems.yearsOfServiceBy1July1983 = new PC.DataItem.Exact.Int({
    name: 'Years of Service as of July 1, 1983',
    question: "How many years of service credit do you have as of July 1, 1983?",
    inputSize: 3,
    min: 0,
    max: 80,
    complexityMultiplier: 0.8,
    checks: [
        ['hireDate'],
        function (yearsOfServiceBy1July1983, args) {
            var maxYears = -Math.floor(args.hireDate.yearDiff("7/1/1983"));
            if (yearsOfServiceBy1July1983 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.hireDate.getName();
        },
        ['retirementDate', 'yearsOfService'],
        function (yearsOfServiceBy1July1983, args) {
            var yearsSince1983 = Math.floor(args.retirementDate.yearDiff("7/1/1983"));
            var minYears = args.yearsOfService - yearsSince1983;
            if (yearsOfServiceBy1July1983 < minYears) return "Must be no less than " + minYears + " in order to match your " + PC.dataItems.retirementDate.getName() + " and " + PC.dataItems.yearsOfService.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBy1July1983, args) {
            if (yearsOfServiceBy1July1983 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 32
});

PC.dataItems.yearsOfServiceBetween1July1983And1July2004 = new PC.DataItem.Exact.Int({
    name: 'Years of Service between July 1, 1983 and July 1, 2004',
    question: "How many years of service credit do you have between July 1, 1983 and July 1, 2004?",
    inputSize: 3,
    min: 0,
    max: 11,
    complexityMultiplier: 0.8,
    checks: [
        ['yearsOfService', 'yearsOfServiceBy1July1983'],
        function (yearsOfServiceBetween1July1983And1July2004, args) {
            var maxYears = args.yearsOfService - args.yearsOfServiceBy1July1983;
            if (yearsOfServiceBetween1July1983And1July2004 > maxYears) return "Must be no greater than " + maxYears + " in order to match your " + PC.dataItems.yearsOfService.getName() + " and " + PC.dataItems.yearsOfServiceBy1July1983.getName();
        },
        ['yearsOfService'],
        function (yearsOfServiceBetween1July1983And1July2004, args) {
            if (yearsOfServiceBetween1July1983And1July2004 > args.yearsOfService) return "Must be no greater than " + args.yearsOfService + " in order to match your " + PC.dataItems.yearsOfService.getName();
        }
    ],
    order: 33
});

/////////////////
PC.dataItems.yearsOfMilitaryService = new PC.DataItem.Exact.Int({
	name: 'Years of Military Service',
	question: "How many years of <i>military</i> service will you have at retirement?",
	inputSize: 3,
	min: 0,
	max: 80,
	complexityMultiplier: 0.9,
	order: 29
});


PC.dataItems.occupation = new PC.DataItem.Set({
	name: 'Occupation',
	question: "What is your occupation?",
	other: true,
	standards: {
        teacher                : "Teacher",
        policeOfficer          : "Police Officer",
        fireFighter            : "Fire Fighter",
        detentionOfficer       : "Detention Officer",
        waterSafetyOfficer     : "Water Safety Officer",
        investigator           : "Investigator",
        judge                  : "Judge",
        courtClerk             : "Court Clerk",
        districtAttorney       : "District Attorney",
        registrarOfVoters      : "Registrar of Voters",
        assessor               : "Assessor",
        legislator             : "Legislator",
        registeredNurse        : "Registered Nurse",
        governor               : "Governor",
        emt                    : "Emergency Medical Service Officer",
        liquorControlOfficer   : "Liquor Control Officer",
        fishAndWildlifeOfficer : "Fish and Wildlife Officer",
        nationalGuard          : "National Guard"
	},
	order: 40
});


PC.dataItems.policeOfficerType = new PC.DataItem.Set({
    name: 'Type of Police Officer',
    question: "What type of police officer are you?",
    other: true,
    standards: {
        municipal    : "Municipal Police",
        sheriff      : "Sheriff",
        deputy       : "Deputy Sheriff",
        stateTrooper : "State Trooper",
        security     : "Security Police"
    },
    order: 39
});


PC.dataItems.fireFighterType = new PC.DataItem.Set({
    name: 'Type of Fire Fighter',
    question: "What type of fire fighter are you?",
    other: false,
    standards: {
        paid      : "Paid",
        volunteer : "Volunteer",
        airGuard  : "Air Guard"
    },
    order: 39
});


PC.dataItems.judgeType = new PC.DataItem.Set({
    name: 'Type of Judge',
    question: "What type of judge are you?",
    other: true,
    standards: {
        supreme  : "Supreme Court",
        superior : "Superior Court",
        district : "District Court",
        probate  : "Probate"
        
    },
    order: 39
});


PC.dataItems.ageAtRetirement = new PC.DataItem.Exact.Int({
	name: 'Age at Retirement',
	question: "What is your target retirement age?",
	inputSize: 3,
	min: 18,
	max: PC.MAX_AGE,
	complexityMultiplier: 0.8,
	alternatives: [
   		["retirementDate", "birthDate"],
   		function (alts) {
   			return Math.floor(alts.retirementDate.yearDiff(alts.birthDate));
   		}
   	],
   	checks: [
	    ['ageAtHire'],
	    function (ageAtRetirement, args) {
	    	if (ageAtRetirement <= args.ageAtHire) return PC.dataItems.ageAtRetirement.getName() + " must be greater than " + PC.dataItems.ageAtHire.getName();
	    },
 	    ['yearsOfService'],
 	    function (ageAtRetirement, args) {
 	    	if (args.yearsOfService + PC.MINIMUM_WORKING_AGE > ageAtRetirement) return PC.dataItems.ageAtRetirement.getName() + " must be at least "+PC.MINIMUM_WORKING_AGE+" greater than " + PC.dataItems.yearsOfService.getName();
 	    }
	],
	order: 32
});

PC.dataItems.ageAtHire = new PC.DataItem.Exact.Int({
	name: 'Age at Hire',
	question: "What was your age when you were hired?",
	inputSize: 3,
	min: 14,
	max: 100,
	alternatives: [
	    ["hireDate", "birthDate"],
	    function (alts) {
	    	return Math.floor(alts.hireDate.yearDiff(alts.birthDate));
	    }
	],
	checks: [
		['ageAtRetirement'],
		function (ageAtHire, args) {
			if (args.ageAtRetirement <= ageAtHire) return PC.dataItems.ageAtRetirement.getName() + " must be greater than " + PC.dataItems.ageAtHire.getName();
		}
 	],
 	order: 31
});

PC.dataItems.finalAverageSalary = new PC.DataItem.Exact.Money({
	name: 'Final Average Salary',
	question: "What is your final average salary?",
	inputSize: 7,
	min: 0,
	max: 10000000,
	order: -10
});

PC.dataItems.hireDate = new PC.DataItem.Exact.Date({
	name: 'Hire Date',
	question: "What is the date you were hired?",
	min: new PC.Date('1/1/1900'),
	max: new PC.Date('1/1/2050'),
    checks: [
        ['retirementDate'],
        function (val, args) {
            if (args.retirementDate && args.retirementDate.isBefore(val)) {
                return PC.dataItems.hireDate.getName() + " must be earlier than " + PC.dataItems.retirementDate.getName();
            }
        },
        ['birthDate'],
        function (val, args) {
            if (!args.birthDate.isBefore(val)) {
                return PC.dataItems.hireDate.getName() + " must be later than " + PC.dataItems.birthDate.getName();
            }
        }
    ],
	order: 21
});


PC.dataItems.hireDateRange = new PC.DataItem.Range.Date({
	name: 'Hire Date',
	question: 'When were you hired?',
	alternatives: [
   	    ["hireDate"],
   	    function (alts) {
   	    	return PC.dataItems.hireDateRange.getRangeFromExact(alts.hireDate); 
   	    }
   	],
   	order: 21
});


PC.dataItems.birthDate = new PC.DataItem.Exact.Date({
	name: 'Birth Date',
	question: "What is the date you were born?",
	complexityMultiplier: 0.75,
	min: new PC.Date('1/1/1900'),
	max: new PC.Date('1/1/2050'),
	checks: [
 	    ['hireDate'],
 	    function (val, args) {
 	    	if (!val.isBefore(args.hireDate)) {
 	    		return PC.dataItems.hireDate.getName() + " must be later than " + PC.dataItems.birthDate.getName();
 	    	}
 	    }
 	],
 	order: 20
});

PC.dataItems.retirementDate = new PC.DataItem.Exact.Date({
	name: 'Retirement Date',
	question: "What is your target retirement date?",
	min: new PC.Date('1/1/1950'),
	max: new PC.Date('1/1/2200'),
	checks: [
	    ['hireDate'],
	    function (val, args) {
	    	if (!args.hireDate.isBefore(val)) {
	    		return PC.dataItems.retirementDate.getName() + " must be later than " + PC.dataItems.hireDate.getName();
	    	}
	    }
	],
	order: 22
});

PC.dataItems.retirementDateRange = new PC.DataItem.Range.Date({
	name: 'Retirement Date',
	question: 'What is your target retirement date?',
	alternatives: [
   	    ["retirementDate"],
   	    function (alts) {
   	    	return PC.dataItems.retirementDateRange.getRangeFromExact(alts.retirementDate); 
   	    }
   	],
   	order: 22
});

PC.dataItems.oneYOSBeforeRetirement = new PC.DataItem.Exact.Bool({
	name: 'One Year of Service Before Retirement',
	question: 'Did you have at least one year of service immediately before retirement?',
	order: 1
});

PC.dataItems.retiringImmediately = new PC.DataItem.Exact.Bool({
	name: 'Retiring Immediately',
	question: 'Will you be retiring immediately?',
	order: 1
});

PC.dataItems.currentlyHoldJudicialOffice = new PC.DataItem.Exact.Bool({
	name: 'Currently Hold Judicial Office',
	question: 'Do you currently hold a judicial office?',
	order: 1
});

PC.dataItems.partTime = new PC.DataItem.Exact.Bool({
	name: 'Part-Time',
	question: 'Are you employed part-time?',
	order: 1
});

PC.dataItems.coveredBySocialSecurity = new PC.DataItem.Exact.Bool({
	name: 'Covered by Social Security',
	question: 'Are you covered by Social Security?',
	order: 1
});

PC.dataItems.hazardousDutyEmployee = new PC.DataItem.Exact.Bool({
    name: "Hazardous Duty Employee",
    question: "Are you a hazardous duty employee?",
    order: 40
});

PC.dataItems.countyEmployee = new PC.DataItem.Exact.Bool({
    name: "County Employee",
    question: "Are you a county employee?",
    order: 40
});

PC.dataItems.universityOrCollegeEmployee = new PC.DataItem.Exact.Bool({
    name: "University or College Employee",
    question: "Are you a university or college employee?",
    order: 40
});

PC.dataItems.electedOfficial = new PC.DataItem.Exact.Bool({
    name: "Elected Official",
    question: "Are you an elected official?",
    order: 39
});

PC.DataTools = {
    getNormalSocialSecurityRetirementAge: function(birthDate) {
        if (birthDate.isBefore("1/2/1943")) {
            return 65;
        }
        
        if (birthDate.isBefore("1/2/1960")) {
            return 66;
        }
        
        return 67;
    }
};

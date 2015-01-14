var pension = pension || {};
pension.environment = function() {	
	var that = {
			DISCOUNT_RATE: 0.07,
			REAL_RATE: 0.04,
                        INFLATION_RATE: 0.03,
			MAX_AGE: 114,
                        WAGE_INFLATION: 0.04
	};
	
	return that;
	
};
var pension = pension || {};
pension.environment = function() {	
	var that = {
			DISCOUNT_RATE: 0.06,
			REAL_RATE: 0.02,
                        INFLATION_RATE: 0.04,
			MAX_AGE: 114,
                        WAGE_INFLATION: 0.04
	};
	
	return that;
	
};
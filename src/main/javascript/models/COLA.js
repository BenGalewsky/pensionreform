var pension = pension || {};

pension.COLA = function() {
	var that = {
			start: 1,
			rate: 0.0,
			max: false,
			compounded:false,

		rateForYear: function(i, prevYearCola){
			var thisYearCola = 0.0;
			
			if (i >= this.start) {
				var rate;
				if (typeof (this.rate) == "function") {
					rate = this.rate(i);
				} else {
					rate = this.rate;
				}
	
				if (this.compounded) {
					thisYearCola = (prevYearCola + 1) * (1 + rate) - 1;
				} else {
					thisYearCola = prevYearCola + rate;
				}
			}
			return thisYearCola;
	
		}
	
	};
	return that;

};
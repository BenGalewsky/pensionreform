PC.Utils.setProperties(PC.Utils, {
	
    removeEvent: function(obj, type, fn) {
		if ('removeEventListener' in obj) {
			obj.removeEventListener(type, fn, false);
		} else {
			if ('readyState' in obj && type == 'load') type = 'readystatechange';
	        obj.detachEvent("on"+type, obj[type+fn]);
	        obj[type+fn] = null;
	    }
	},
	
    loadStyle: (function() {
    	var head = document.getElementsByTagName("head")[0];
    	
    	return function(src, preventCacheBuster) {
    		
	    	if (!preventCacheBuster && PC.debug) {
	    		src += (PC.Utils.indexOf('?', src) < 0) ? '?' : '&';
	    		src += PC.cacheBuster;
	    	}
	        
	        if (src.substr(0, 7) != "http://" && "baseURL" in PC) {
	        	if (src[0] != '/') src = "styles/" + src;
	            src = PC.baseURL + src;
	        }
	        
	        var style = document.createElement("link");
	        style.rel = 'stylesheet';
	        style.type = "text/css";
	        style.href = src;

	        head.appendChild(style);
    	};
    })(),
	
	urlEncode: function(s) {
	    return encodeURIComponent(s)
	        .replace(/\%20/g, "+")
	        .replace(/!/g, "%21")
	        .replace(/'/g, "%27")
	        .replace(/\(/g, "%28")
	        .replace(/\)/g, "%29")
	        .replace(/\*/g, "%2A")
	        .replace(/\~/g, "%7E");
	},
	
	mergeArrays: function(first, second) {
		first = first.slice(0);
		for (var i in second) {
			if (!PC.Utils.inArray(second[i], first)) {
				first.push(second[i]);
			}
		}
		
		return first;
	},
	
	arraysAreEqual: function(first, second) {
		if (first.length != second.length) return false;
		
		for (var i in first) {
			if (!PC.Utils.inArray(first[i], second)) return false;
		}
		
		return true;
	},
	
	subsetInArray: function(sub, sup) {
		for (var i in sub) {
			var matched = false;
			for (var j in sup) {
				if (sub[i] == sup[j]) {
					matched = true;
					break;
				}
			}
			if (!matched) return false;
		}
		return true;
	},
	
    indexOf: function(needle, haystack, fromEnd) {
    	if (fromEnd) {
    		for (var i = haystack.length-1; i >= 0; i--) {
    			if (needle == haystack[i]) return i;
    		}    		
    	} else {
    		for (var i in haystack) {
    			if (needle == haystack[i]) return i;
    		}
    	}
        return -1;
    },
    
    inArray: function(needle, haystack, fromEnd) {
    	return (PC.Utils.indexOf(needle, haystack, fromEnd) >= 0)
    },
	
	getKeys: Object.keys || function(obj) {
		if (obj !== Object(obj)) throw new TypeError("getKeys called on non-object");
		var keys = [];
		for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) keys.push(key);
		return keys;
	},
    
    DOMToText: function(node) {
		return node.outerHTML || new XMLSerializer().serializeToString(node);
	},
	
	objIsEmpty: function (obj) {
		for (var i in obj) {
			return false;
		}
    	return true;
	},
    
    copyPrototype: function (descendantObj, parentObj) {
        for (var i in parentObj.prototype) {
            descendantObj.prototype[i] = parentObj.prototype[i];
        }
    }

});


PC.SessionStorage = (function() {
	var store = {};
	var save = function () {};
	
	if ("localStorage" in window && "JSON" in window) {
		if (localStorage.PC) store = JSON.parse(localStorage.PC);
		
		if (!sessionStorage.PC && store.__time__+15*60*1000 < new Date().getTime()) {
			store = {};
			delete localStorage.PC;
		}
			
		save = function() {
			store.__time__ = new Date().getTime();
			localStorage.PC = JSON.stringify(store);
			sessionStorage.PC = true;
		};
	}
		
	return {
		set: function(key, value) {
			store[key] = value;
			save();
		},
		
		get: function(key) {
			return store[key];
		},
		
		exists: function(key) {
			return (key in store);
		}
	};
		
})();


PC.stateNames = {
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming'
};

PC.globalHints = {
	annuityCost: ['Annuity Cost', 'This is the amount of cash you would need to have at the same retirement age to purchase a guaranteed lifetime annuity yielding the same income as the pension benefit.<br /><br />Estimated payment for a Single Premium Immediate Annuity, indexed to inflation on the same basis as the simulated public pension, with an insurer who assumes a 3% rate of return.']
};

PC.formatNumber = function(num) {
	num = (num > 1) ? Math.round(num) : Math.round(100*num)/100;
	num = num.toString();
	var regexp = /(\d)(\d{3}(?:,\d{3})*)$/;
	while (regexp.test(num)) num = num.replace(regexp, "$1,$2");
	if (num < 1 && num > 0 && num.length < 4) num += "0";
	return num;
};


(function() {
	var widgets = ['single', 'comparison', 'viewer'];
	
	if ('widget' in PC.hashVars && PC.Utils.indexOf(PC.hashVars.widget, widgets) >= 0) {
		PC.Utils.asyncLoad('widgets/' + PC.hashVars.widget + '.js');
	} else {
		throw new Error("Unknown widget.")
	}
})();







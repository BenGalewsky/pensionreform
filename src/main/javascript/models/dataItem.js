if(typeof PC == 'undefined') PC =  {};
PC.dataItems = {};

PC.Date = function(y, m, d) {
	
	if(typeof y.getFullYear == 'function'){
		this.dateObj = y;
		return;
	}
    
    if (arguments.length == 1) {
    	    	    
        var dateStr = y;
        
        var matches = PC.Date.MDYregex.exec(dateStr);
        if (matches) {
            this.dateObj = new Date(matches[3], parseInt(matches[1])-1, matches[2]);
            return;
        }
        
        var mon;
        matches = PC.Date.monDYregex.exec(dateStr);
        if (matches) {
            d = matches[2];
            mon = matches[1];
            y = matches[3];
        } else {
            matches = PC.Date.DmonYregex.exec(dateStr);
            if (matches) {
                d = matches[1];
                mon = matches[2];
                y = matches[3];
            }
        }
        
        if (!mon) return;
        
        mon = mon.charAt(0).toUpperCase() + mon.substr(1).toLowerCase();
        m = -1;
        for (var i in PC.Date.mons) {
            if (mon == PC.Date.mons[i]) {
                m = i;
                break;
            }
        }
    } else {
        --m;
    }
    
    if (m >= 0) {
        this.dateObj = new Date(y, m, d);
        return;
    }
    
    
};
PC.Date.MDYregex = /(\d{1,2})[\/\-\.\s](\d{1,2})[\/\-\.\s](\d{4})/;
PC.Date.monDYregex = /(\w{3})\D*(\d{1,2})\D+(\d{4})/;
PC.Date.DmonYregex = /(\d{1,2})\W*(\w{3})\D+(\d{4})/;
PC.Date.SEPARATOR = "/";
PC.Date.mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
PC.Date.prototype = {
    getMonth: function() {
        return this.dateObj.getMonth() + 1;
    },
    
    getDay: function() {
        return this.dateObj.getDate();
    },
    
    getYear: function() {
        return this.dateObj.getFullYear();
    },
    
    isValid: function() {
        return (this.dateObj) ? true : false;
    },
    
    toString: function() {
        return this.getMonth() + PC.Date.SEPARATOR + this.getDay() + PC.Date.SEPARATOR + this.getYear();
    },
    
    isAfter: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return (this.getYear() > other.getYear());
        if (this.getMonth() != other.getMonth()) return (this.getMonth() > other.getMonth());
        return (this.getDay() > other.getDay());
    },
    
    isBefore: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return (this.getYear() < other.getYear());
        if (this.getMonth() != other.getMonth()) return (this.getMonth() < other.getMonth());
        return (this.getDay() < other.getDay());
    },
    
    isAfterOrEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return (this.isAfter(other) || this.isEqual(other)); 
    },
    
    isBeforeOrEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return (this.isBefore(other) || this.isEqual(other));
    },
    
    isEqual: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.getYear() != other.getYear()) return false;
        if (this.getMonth() != other.getMonth()) return false;
        if (this.getDay() != other.getDay()) return false;
        
        return true;
    },
    
    dayDiff: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        var t2 = this.dateObj.getTime();
        var t1 = other.dateObj.getTime();
        return (t2-t1)/(24*3600*1000);
    },

    yearDiff: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        return this.dayDiff(other)/365;
    },
    
    addYears: function(years) {
        return new PC.Date(this.getYear() + years, this.getMonth(), this.getDay());
    },
    
    compare: function(other) {
        if (typeof(other) == 'string') other = new PC.Date(other);
        if (this.isEqual(other)) return 0;
        if (this.isBefore(other)) return -1;
        return 1;
    }
};
PC.Date.compareStrings = function(a, b) {
    a = new PC.Date(a);
    b = new PC.Date(b);
    return a.compare(b);
};



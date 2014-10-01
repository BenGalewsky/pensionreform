var PC = PC || {};

var PC_options = PC_options || {};

PC.log = function() {
    if (PC.debug && 'console' in window) {
        console.log.apply(this, arguments);
    }
};
	
PC.handleException = function(e) {
    var message = 'An unexpected error has occured.';
    if (PC.debug) {
        message = 'Uncaught exception: '+e.name;
        var line = e.line || e.lineNumber || false;
        if (line) message += '<br />On line number '+line;
        message += '<br /><br />'+e.message;
        if (e.stack) message += '<br /><br />Stack trace:<pre>'+e.stack+'</pre>';
    }
    
    if (PC.target) {
        PC.target.style.cssText = 'background-image: none; color: #cc0000; overflow: auto';
        PC.target.innerHTML = message;
    } else if (PC.debug) {
        alert(message);
    }
};
	
PC.handleError = function(message, url, linenumber) {
    PC.handleException({
        name: 'Runtime Error',
        line: linenumber,
        message: message + ' in '+url
    });
};

PC.Utils = {
    addEvent: function(obj, type, fn) {
		if ('addEventListener' in obj) {
			obj.addEventListener(type, fn, false);
		} else {
			var onload = false;

			if ('readyState' in obj && type == 'load') {
				onload = true;
				type = 'readystatechange';
			}
			
			obj["e"+type+fn] = function() {
                if (onload && obj.readyState != 'complete' && obj.readyState != 'loaded') return;
                fn();
			};
            obj[type+fn] = function() {
                obj["e"+type+fn](window.event);
            };
            
            obj.attachEvent("on"+type, obj[type+fn]);
		}
    },
    
    urlDecode: function(s) {
        return decodeURIComponent(
            s.replace(/\+/g, "%20")
             .replace(/\%21/g, "!")
             .replace(/\%27/g, "'")
             .replace(/\%28/g, "(")
             .replace(/\%29/g, ")")
             .replace(/\%2A/ig, "*")
             .replace(/\%7E/ig, "~") );
    },
    
    isArray: function(obj) {
    	return obj.constructor == Array;
    },
    
    asyncLoad: (function() {
    	var head = document.getElementsByTagName("head")[0];
    	
    	return function (srcs, onload) {
    		
    		if (!srcs.length) {
    			onload();
    			return;
    		}
    		
    		if (!PC.Utils.isArray(srcs)) srcs = [srcs];
    		
    		var loaded = 0;
    		var numScripts = 0;
    		
    		for (i in srcs) {
    			var srcParts = srcs[i].split("#", 2);
    			
    			var src = srcParts[0];
    			var hash = srcParts[1];
    			
    			var type;
    			if (src.substr(src.length-3, 3) == '.js') type = 'js';
    			else if (src.substr(src.length-4, 4) == '.css') type = 'css';
    			else throw new Error('Unkown file type for asynchronous loading.')
    			
    			if (PC.debug) src += '?' + PC.cacheBuster;
    			
    			if (hash) src += '#' + hash;
    			
    			if (src.substr(0, 7) != "http://" && "baseURL" in PC) {
    	        	if (src.charAt(0) != '/') {
    	        		if (type == 'js') src = "scripts/" + src;
    	        		else if (type == 'css') src = "styles/" + src;
    	        	} else {
    	        		src = src.substr(1);
    	        	}
    	            src = PC.baseURL + src;
    	        }
    			
    			var obj;
    			if (type == 'js') {
    				numScripts++;
	    			obj = document.createElement("script");
	    	        obj.type = "text/javascript";
	    	        obj.src = src;
	    	        
	    	        if (onload) {
	    	        	PC.Utils.addEvent(obj, 'load', function() {
	    	        		loaded++;
	    	        		try {
	    	        			if (loaded == numScripts) onload();
	    	        		} catch (e) {
	    	        			PC.handleException(e);
	    	        			throw e;
	    	        		}
	    	        	});
	    	        }
    			} else if (type == 'css') {
    	        	obj = document.createElement("link");
    		        obj.rel = 'stylesheet';
    		        obj.type = "text/css";
    		        obj.href = src;
    	        }
    	        	
	        	head.appendChild(obj);
    		}
    	};
    
    })(),
    
    setProperties: function(obj, properties) {
    	for (var key in properties) obj[key] = properties[key];
    },
    	
    setStyles: function(obj, styles) {
        PC.Utils.setProperties(obj.style, styles);
    }
};


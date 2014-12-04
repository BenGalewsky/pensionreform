(function() {
    PC = {};
    
    var scripts = document.getElementsByTagName("script");
    var src = scripts[scripts.length - 1].src;
    
    var srcParts = src.split("#", 2);
    var srcParts = srcParts[0].split("?", 2);
    PC.baseURL = srcParts[0].substr(0, srcParts[0].length-27)
    var latestSrc = PC.baseURL + "latest.js?" + Math.random();
    
    var obj = document.createElement("script");
    obj.type = "text/javascript";
    obj.src = latestSrc;
    
    function callback() {
        var obj = document.createElement("script");
        obj.type = "text/javascript";
        obj.src = src.replace("/latest/", "/"+PC.latestVersion+"/");
        PC.baseURL += "/"+PC.latestVersion+"/";
        document.body.appendChild(obj);
    }
    
    if ('addEventListener' in obj) {
        obj.addEventListener("load", callback, false);
    } else if ('readyState' in obj) {
        obj.attachEvent("onreadystatechange", function() {
            if (obj.readyState == 'complete' || obj.readyState == 'loaded')
                callback();
        });
    } else {
        obj.attachEvent("onload", callback);
    }
    
    document.body.appendChild(obj);
})();

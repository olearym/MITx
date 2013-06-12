var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
    function graph(canvas,expression,x1,x2) {
    
        var DOMcanvas = canvas[0];    
        var ctx = DOMcanvas.getContext('2d');
        ctx.beginPath();
        var tree = calculator.parse(expression);
                
        if (typeof(tree)=="string"){   
    
            ctx.beginPath();
            ctx.fillStyle="red";
            ctx.font="20px Georgia";
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillText(tree,100,100);
        }
    	else{

    	    var xtemp=x1;
            var y1=calculator.evaluate(tree,{e: Math.E, pi: Math.PI, x: x1});
            var ymin=y1;
            var ymax=ymin;
    	    var dx=(x2-x1)/400;
    	    var points=new Array();
        	while(xtemp<=x2){
                var y= calculator.evaluate(tree,{e: Math.E, pi: Math.PI, x: xtemp});
                ymax=Math.max(ymax,y);
                ymin=Math.min(ymin,y);
                var cords=[xtemp,y];
                points.push(cords);
            	xtemp=xtemp+dx;
            	}
            var dy=(ymax-ymin)/400;
            ctx.beginPath();
            ctx.moveTo(x1-x1,400-(y1-ymin)/dx);
            ctx.beginPath();
            for (var i = 1; i < points.length; i++) {
                var xp=points[i][0];
                var yp=points[i][1];
                 ctx.lineTo((xp-x1)/dx,400-(yp-y1)/dy);
            }
            ctx.lineWidth=10;
            ctx.strokeStyle="red";
            //ctx.lineCap="round";
            //ctx.lineJoin="round";
            ctx.stroke();
            
            
    	}
    }
    
    function setup(div) {

    	var back=$('<div id="back">'); 
     	var JQcanvas=$('<canvas id="art" width="400" height="400"></canvas>');
    	var r1=$('<div id="r1">'); 
    	var r2=$('<div id="r2">'); 
    	var r3=$('<div id="r3">'); 
    	var func=$('<input></input>',{type: "text1", size: 50});
    	var f=$('<lable>f(x): </lable>');
      	r1.append(f,func);
    	var mnx=$('<lable>min x: </lable>');
    	var xminin=$('<input></input>',{type: "text2", size: 50});
    	var mxx=$('<lable>max x: </lable>');
    	var xmaxin=$('<input></input>',{type: "text3", size: 50});
    	r2.append(mnx,xminin,mxx,xmaxin);
    	var but=$('<button>Plot</button>');
        but.bind("click",function(){graph(JQcanvas, func.val(),parseInt(xminin.val()),parseInt(xmaxin.val()))});
        r3.append(but);
    	back.append(JQcanvas,r1,r2,r3);
    	$(div).append(back);



    }
    exports.setup = setup;
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this);  
    });
});
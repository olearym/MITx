var graphcalc = (function () {

    var exports = {};  // functions,vars accessible from outside
    var input_string = "";
    var decimal_in_input = false;

    function graph(canvas,expression,x1,x2) {
    
        var DOMcanvas = canvas[0];    
        var ctx = DOMcanvas.getContext('2d');
        ctx.clearRect(0, 0, 400, 400)
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
            ctx.lineWidth=5;
            ctx.strokeStyle="red";
            //ctx.lineCap="round";
            //ctx.lineJoin="round";
            ctx.stroke();
            return [ymin,ymax]
    	}
    }

    //Button action functions
    function setup_num_buttons() {
        $('.num_button').on("click",function() {
            var input = $(this).text();
            if(!isNaN(parseInt(input, 10))) {
                input_string += input;
                $("#input_box").html(input_string);
                console.log(input_string);
            }
            else if(input === ".") if(!decimal_in_input){
                decimal_in_input = true;
                input_string += input;
                console.log(input_string);
            }
            
        });
    }

    function setup_operator_buttons() {
        $('.operator_button').on("click", function() {
            var input = $(this).attr("id");
            console.log($(this).attr("id"))
            input_string += input;
            decimal_in_input = false
            console.log(input_string);
        });
    }

    function setup_clear_button() {
        $('.clear_button').on("click", function() {
            input_string = "";
            $("#input_box").html(input_string);
        });
    }

    function setup_equal_button() {
        $('.equal_button').on("click", function() {
            console.log(input_string)
            // if(isNaN(parseFloat(input_list[-1], 10))) {
            //     input_list.pop();
            // }
            decimal_in_input = false
            $("#input_box").html(String(calculator.evaluate(calculator.parse(input_string), {e: Math.E, pi: Math.PI})))
            input_string = ""
        });

    }
    
    function setup(div) {

        var graphed = false
    	var back=$('<div id="back">'); 
     	var JQcanvas=$('<canvas id="art" width="400" height="400"></canvas>');
        var r0=$('<div id = "r0">');
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
        but.bind("click",function() {
            
            var ylist = graph(JQcanvas, func.val(),parseInt(xminin.val()),parseInt(xmaxin.val()));
            if (graphed) {
                document.getElementById("xmin_label").parentNode.removeChild(document.getElementById("xmin_label"));
                document.getElementById("xmax_label").parentNode.removeChild(document.getElementById("xmax_label"));
                document.getElementById("ymin_label").parentNode.removeChild(document.getElementById("ymin_label"));
                document.getElementById("ymax_label").parentNode.removeChild(document.getElementById("ymax_label"));
            };
            var xmin = $('<label id = "xmin_label"></label>').text(parseInt(xminin.val()));
            var xmax = $('<label id = "xmax_label"></label>').text(parseInt(xmaxin.val()));
            var ymin = $('<label id = "ymin_label"></label>').text(parseInt(ylist[0]));
            var ymax = $('<label id = "ymax_label"></label>').text(Math.round((ylist[1])));
            r0.append(xmin, xmax, ymin, ymax);
            graphed = true
            });
        r3.append(but);

        var numpad_template = ''
        +'<div id = "calc">'
        +'   <div class = "row" id = "row0">'
        +'   <div class = "input" type = "text" size = 50 id = "input_box">'
        +'       <div id= "calculation"></div>'
        +'       <div id="result"></div>'
        +'   </div>'
        +'   </div>'
        +'   <div class = "row" id = "row1">'
        +'       <button id="mc">MC</button>'
        +'       <button id="mplus">M+</button>'
        +'        <button id="mminus">M-</button>'
        +'        <button class= "last" id="mr">MR</button>'
        +'    </div>'
        +'    <div class = "row" id = "row2">'
        +'         <button class = "clear_button" id="cbutton">C</button>'
        +'         <button id="plusminus">&plusmn;</button>'
        +'         <button class = "operator_button" id="/">&divide;</button>'
        +'         <button class = "operator_button" class= "last" id="*">&times;</button>'
        +'    </div>'
        +'    <div class = "row" id = "row3">'
        +'        <button class = "num_button" id="seven">7</button>'
        +'        <button class = "num_button" id="eight">8</button>'
        +'        <button class = "num_button" id="nine">9</button>'
        +'        <button class = "operator_button" class= "last"  id="-">-</button>'
        +'    </div>'
        +'    <div class = "row" id = "row4">'
        +'        <button class = "num_button" id="four">4</button>'
        +'        <button class = "num_button" id="five">5</button>'
        +'       <button class = "num_button" id="six">6</button>'
        +'        <button class = "operator_button" class= "last" id="+">+</button>'
        +'    </div>'
        +'    <div class = "row" id = "row5">'
        +'        <button class = "num_button" id="one">1</button>'
        +'       <button class = "num_button" id="two">2</button>'
        +'        <button class = "num_button" id="three">3</button>'
        +'       <button class = "equal_button" class= "last" id = "equals">=</button>'
        +'    </div>'
        +'    <div class = "row" id = "row5">'
        +'        <button class = "num_button" class = "zero" id = "zero">0</button>'
        +'       <button class = "num_button" class = "decimal">.</button>'      
        +'    </div>'
        +'</div>';

    	back.append(JQcanvas,r0,r1,r2,r3,numpad_template);
    	$(div).append(back);

        setup_num_buttons();
        setup_operator_buttons();
        setup_equal_button();
        setup_clear_button();



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
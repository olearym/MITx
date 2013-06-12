function test_clear() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    // x, y, w, h
    ctx.clearRect(0,0,JQcanvas.width(),JQcanvas.height());
}

function test_line() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];    
    var ctx = DOMcanvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(50,50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 150);
    ctx.lineTo(50, 150);
    ctx.lineTo(50, 50);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "red"
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.fill();
}

function test_rect() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];    
    var ctx = DOMcanvas.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(25, 25, 100, 100);
    ctx.fillStyle = "blue";
    ctx.fillRect(75, 75, 100, 100);
}

function test_smiley() {
	var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];    
    var ctx = DOMcanvas.getContext('2d');

    ctx.beginPath();
    // cx, cy, radius, startangle, endangle
    ctx.arc(100, 100, 75, 0, 2*Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(75, 75, 10, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(125, 75, 10, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(100, 115, 35, 2*Math.PI/10, 8*Math.PI/10);
    ctx.lineWidth = 5;
    ctx.stroke();
}

function test_text() {
	var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];    
    var ctx = DOMcanvas.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "20px Georgia";
    ctx.textAlign = "center"; // left, right
    ctx.textBaseline = "middle" // top, bottom, alphabetic
    // string, x, y
    ctx.fillText("Hi!", 100, 100);

}

function test_mouse() {
	var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];    
    var ctx = DOMcanvas.getContext('2d');

    var bg_image = $("<canvas></canvas>")[0];
    bg_image.width = 200;
    bg_image.height = 200;
    var bctx = bg_image.getContext('2d');
    bctx.fillStyle= "#F0FFF0";
    bctx.fillRect(0, 0, 200, 200);
    bctx.fillStyle = "#FF00FF";
    bctx.fillRect(10, 10, 100, 100);

    // image, x, y
    ctx.drawImage(bg_image, 0, 0);

    JQcanvas.on("mousemove", function(event) {
    	var mx = event.pageX;
    	var my = event.pageY;

    	var offset = JQcanvas.offset(); // {left: ..., top: ...}
    	mx = Math.round(mx - offset.left);
    	my = Math.round(my - offset.top);
    	
    	ctx.drawImage(bg_image, 0, 0); 

    	ctx.beginPath();
    	ctx.moveTo(mx-10, my);
    	ctx.lineTo(mx+10, my);
    	ctx.moveTo(mx, my-10);
    	ctx.lineTo(mx, my+10);
    	ctx.strokeStyle = "black";
    	ctx.lineWidth = 1;
    	ctx.stroke();

    });
}
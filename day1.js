function calculate(text) {
    var pattern = /\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    try {
        if(count("(", tokens) !== count(")", tokens)) {
            throw "unequal number of parantheses";
        }
        var val = evaluate(tokens);
        if(tokens.length > 0) {
            throw "ill-formed expression";
        }
        return String(val);
    } catch(err) {
        return err;
    }
}
function count(item, array) { //counts the number of items matching "item" in an array
    var num = 0;
    for(var i = 0; i < array.length; i++) {
        if(array[i] === item) {
            num++;
        }
    }
    return num;
}
function setup_calc(div) {
    var input = $('<input></input>', {type: "text", size: 50});
    var output = $("<div></div>");
    var button = $("<button>Calculate</button>");
    button.bind("click", function () {
        output.text(String(calculate(input.val())));
    });
    
    $(div).append(input, button, output);
}

function read_operand(array) {
    var num = array[0];
    array.shift();
    console.log(array)
    if(num === "(") {
        return evaluate(array);
    }
    if(num === "-") {
        return -read_operand(array)
    }
    else if(isNaN(parseFloat(num, 10))) {
        throw "number expected";
    } else {
        return parseFloat(num, 10);
    }
}

function evaluate(array) {
    if(array.length === 0) {
        throw "missing operand";
    }
    if(operator === ")") {
            array.shift();
            return value;
    }
    var value = read_operand(array);
    var patterns = /\+|\-|\*|\//g;
    while(array.length > 0) {
        var operator = array[0];
        array.shift();
        if(operator === ")") {
            return value;
        }
        if(operator.match(patterns) === null) {
            throw "unrecognized operator";
        }
        if(array.length === 0) {
            throw "missing operand";
        }
        var temp = read_operand(array);
        if(operator === "+") {
            value = value + temp;
        }
        else if(operator === "-") {
            value = value - temp;
        }
        else if(operator === "*") {
            value = value * temp;
        }
        else if(operator === "/") {
            value = value / temp;
        }
    }
    return value;
}

$(document).ready(function (){
    $('.calculator').each(function (){
        //this refers to the <div> with class calculator
        setup_calc(this);
    });
});
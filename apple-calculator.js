var input_string = "";
var decimal_in_input = false;
var input_list = [];

//Calculator functions
function calculate(array) {
    //var pattern = /\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g;
    var tokens = array;
    try {
        var val = evaluate(tokens);
        if(tokens.length > 0) {
            throw "ill-formed expression";
        }
        return String(val);
    } catch(err) {
        return err;
    }
}

function read_operand(array) {
    var num = array[0];
    array.shift();
    console.log(array)
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
    var value = read_operand(array);
    var patterns = /\+|\-|\*|\//g;
    while(array.length > 0) {
        var operator = array[0];
        array.shift();
        console.log(operator);
        if(operator === ")") {
            return value;
        }
        // if(operator.match(patterns) === null) {
        //     throw "unrecognized operator";
        //}
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
        else if(operator === "×") {
            value = value * temp;
        }
        else if(operator === "÷") {
            value = value / temp;
        }
    }
    return value;
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
        var input = $(this).text();
        input_list.push(input_string);
        input_string = "";
        input_list.push(input);
        console.log(input_list);
    });
}

function setup_clear_button() {
    $('.clear_button').on("click", function() {
        input_list = [];
        input_string = "";
        $("#input_box").html(input_string);
    });
}

function setup_equal_button() {
    $('.equal_button').on("click", function() {
        input_list.push(input_string);
        console.log(input_list)
        input_string = "";
        // if(isNaN(parseFloat(input_list[-1], 10))) {
        //     input_list.pop();
        // }
        console.log(input_list)
        $("#input_box").html(String(calculate(input_list)))
    });
}
$(document).ready(function() {
     setup_num_buttons();
     setup_operator_buttons();
     setup_clear_button();
     setup_equal_button();
 });
 
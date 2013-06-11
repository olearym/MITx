var input_string = ""

function setup_buttons() {
    $('button').on("click",function(event){
        var input = $(this).text();
        if(!isNaN(parseInt(input, 10))) {
            input_string += input;
            console.log(input_string);
        }
    });
}


$(document).ready(function() {
     setup_buttons();
 });
 
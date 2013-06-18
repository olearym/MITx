Parse.initialize("G8BAYqQNhpFD2F47ZC9DAEEbN0jRT2mty5phsTFj", "VwYxaX2OIXGxXAb0YveaId50LZfxwcOXE7SJyhgR");
var quiz = (function() {
    var exports = {};
    var useParse = false;
    // tracks if question has been answered incorrectly
    var wrong = false;
    
    //structure with... questionText, options, solution
    var questions = [{"questionText": "Sam thinks that y=2x is going to ___ as x goes from \
                    1-10.",
                    "options": ["increase", "decrease", "go up then down", "go down then up"]},
                    {"questionText": "Question 2 Text",
                    "options": ["option 1", "option 2", "option 3 - pick me!", "option 4"]},
                    {"questionText": "Question 3 Text",
                    "options": ["option 1", "option 2 - pick me!", "option 3", "option 4"]},
                    {"questionText": "Question 4 Text",
                    "options": ["option 1", "option 2", "option 3", "option 4 - pick me!"]}
                    ]; 
    
    
    var answers = []; // answers from the student
    var score = 0; // score of the student
    var currentQuestion = 0; // index of the current question we are on
    
    if (useParse) {
        var QuizScoreandQuestion = Parse.Object.extend("QuizScoreandQuestion");
        var quizScoreandQuestion = new QuizScoreandQuestion();
        quizScoreandQuestion.set("score", 0);
        quizScoreandQuestion.set("currentQuestion", 0);
        
        score = quizScoreandQuestion.get("score");
        currentQuestion = quizScoreandQuestion.get("currentQuestion");
        
        quizScoreandQuestion.save(null, {
          success: function(quizScoreandQuestion) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + quizScoreandQuestion.id);
          },
          error: function(quizScoreandQuestion, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
          }
        });
    }
    
    if (!useParse) {
        if (localStorage.score !== undefined) {
        score = localStorage.score;
        }
        if (localStorage.question !== undefined) {
        currentQuestion = localStorage.question;
        if (currentQuestion == questions.length) {
            currentQuestion = questions.length - 1;
            }
        }
    
        
    }
    
    function getCurrentQuestion() {
        return currentQuestion;
    }
    
    // input: takes a question index and a student's answers
    // output: true if answer correct
    
    function checkAnswer(q, ans){
        // var soltn = questions[currentQuestion].solutionIndex;
        // return soltn == ans;
        var out = null
        $.ajax({
            async: false,
            url: "http://localhost:8080/",
                data:{ currentQuestionIndex : q,
                        currentAnswer : ans
                        }
        }).done(function(msg) {
            out = msg === 'true'
    });
        return out
        
    }
    function displayNextButton() {
        var nextButton  = $("<button class=next>Next Question</button>");
        nextButton.on('click', displayQuestion);
        $(".quiz").append(nextButton);
    }
    
    function displayScore() {
        $('.quiz').append("<div class=score>Your score is currently: "+score+"</div>");
    }
    
    function getCurrentAnswer() {
        return parseInt($('input[name="option'+currentQuestion +'"]:checked').val());
    }
    
    // checks if answer is correct, if so it increments the score and question, and displays a next question button
    function getAnswers(){
        var answer = parseInt($('input[name="option'+currentQuestion +'"]:checked').val());
        console.log(checkAnswer(currentQuestion, answer))
        if (checkAnswer(currentQuestion, answer)){
            $('.quiz').append("You got it right!");
            currentQuestion++;
            if (!wrong) {
            incrementScore();
            }
            if (!useParse) {
                localStorage['score'] = score;
                localStorage['question'] = currentQuestion;
            }
            if (useParse) {
                quizScoreandQuestion.increment("score");
                quizScoreandQuestion.save();
                quizScoreandQuestion.increment("currentQuestion");
                quizScoreandQuestion.save()
            }
            localStorage['score'] = score;
            localStorage['question'] = currentQuestion;
            if (currentQuestion < questions.length) {
                displayNextButton();
            }
        } else {
            $('.quiz').append("You got it wrong.");
            wrong = true;
        }
        
    }
    
     // displays current quiz question to student
    function displayQuestion(){
        $('.quiz').empty('*');
        var questionObj = questions[currentQuestion];
        var questionNumber = parseInt(currentQuestion) + 1;
        
        // reset variable that tracks if question was answered incorrectly
        wrong = false;
        
        // html outline for a question + options
        var template = ""
        +"<div class = 'question'>"+questionNumber+". "+questionObj.questionText+"</div>"
        +"<div class = 'options'>"
        +"  <form class = 'optionsForm"+currentQuestion+"'>"
        +"  </form>"
        +"</div>";
        
        // actually create the template for the quiz
        $(".quiz").append(template);
        
        // fill the options form with radio buttons for each option
        for (var i = 0; i < questionObj.options.length; i++) {
            var radio = "<input type='radio' name='option"+currentQuestion+"' value="+i+">"+" "+questionObj.options[i]+"<br>";
            $('.optionsForm'+currentQuestion+'').append(radio);
        }
        
        // add check button
        var checkButton  = $("<button class=check>Check!</button>");
        checkButton.on('click', getAnswers);
        $(".quiz").append(checkButton);
        displayScore();
        
    }
    
    // called when a student gets a question right
    function incrementScore(){
        score++;
    }
    function setup() {
        displayQuestion();
    }
    exports.setup = setup;
    exports.getCurrentQuestion = getCurrentQuestion;
    exports.getCurrentAnswer = getCurrentAnswer;
    return exports;
    })();
    
    
$(document).ready(function() {
    quiz.setup();
    
    $.ajax({
            async: false,
            url: "http://localhost:8080/",
                data:{ id : 10
                        }
    }).done(function(msg) {
        console.log(msg);
    });
    console.log("what");
});
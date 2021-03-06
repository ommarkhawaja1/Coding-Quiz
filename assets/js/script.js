var startButton = document.querySelector(".start-btn");
var nextButton = document.querySelector(".next-btn");
var submitButton = document.querySelector(".submit-btn")
var nameField = document.querySelector("#username")
var questionContainerElement = document.querySelector("#question-container");
var timerElement = document.querySelector(".timer-count");
var questionElement = document.querySelector("#question");
var answerButtonsElement = document.querySelector("#answer-buttons");
var shuffledQuestions, currentQuestionIndex;  //  will let us know which question in the shuffledquestions that we are on
var timer;
var score = new Array();
var finalScore;



function startGame() {
    nameField.classList.add("hide")
    var name = document.querySelector("#username").value
    localStorage.setItem("name", name)
    startButton.classList.add("hide");
    // This will give us a random question
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerElement.classList.remove("hide")
    // call the next question
    setNextQuestion()

    timerCount = 40;
    startTimer();

};


function startTimer() {
    timer = setInterval(function () {
        timerCount--;
        timerElement.textContent = timerCount;

        // if the time = 0, then clear the timer and navigate to highscores.html
        if (timerCount <= 0) {
            clearInterval(timer);
            finalScoreScreen()
            saveResults()
        }
    }, 1000);

};

function setNextQuestion() {
    // reset the question back to default state everytime we get a new question
    resetState()
    // Make a call to showQuestion to get the shuffledquestion and show it at the current question index
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    // show the question text
    questionElement.innerText = question.question
    // This will create a button for each answer add the answer text for each button, and add the btn class to it
    question.answers.forEach(answer => {
        var button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("btns")
        // if the answer is correct, then add a data attribute of correct to the button
        if (answer.correct) {
            button.dataset.correct = answer.correct
            // console.log(question.correct)
        }
        button.addEventListener("click", selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    // hide the next button after we click the next button to get a new question
    nextButton.classList.add("hide")
    // if there is a child inside the answerButtonsElement, then remove it
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}


function selectAnswer(e) {

    var selectedButton = e.target
    // check if the button is correct from the dataset
    // call the function to setStatusClass to correct or wrong
    var correct = selectedButton.dataset.correct

    // disable the eselected answer button once it has been clicked
    var selectAnswer = (e) => {
        $('.btns').prop('disabled', true);
    };
    $(document).on('click', '.btns', selectAnswer);

    if (correct) {
        score.push(true)
    }
    else {
        score.push(false)
        timerCount -= 10;
    }
    console.log(score)
    setStatusClass(document.body, correct)
    // create an array from answerButtonsElement children for each button
    Array.from(answerButtonsElement.children).forEach(button => {
        // set status of that button to correct
        setStatusClass(button, button.dataset.correct)
    })
    // if we have more questions than we are currently on, then show the next button
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide")
    }
    // if we run out of questions then we proceed through the following events
    else {
        submitButton.classList.remove("hide")
        // run the saveResults function so that we can count the score
        saveResults()
    }
}

// function to add correct or wrong class to answer button
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct")
    } else {
        element.classList.add("wrong")
    }
}

// remove the StatusClass of correct/wrong from the answer buttons
function clearStatusClass(element) {
    element.classList.remove("correct")
    element.classList.remove("wrong")
}

function finalScoreScreen() {
    // saveResults()
    window.location.href = "highscores.html";

}

function saveResults() {
    // when the user selects the last answer, then count the amount of trues out of arraylength
    finalScore = score.filter(Boolean).length

    var highscores = JSON.parse(localStorage.getItem("highScores")) || [];

    

    var nameandscore = {
        score: finalScore,
        name: username.value
    }

    // save this score to a list of highscores
    highscores.push(nameandscore)
    localStorage.setItem("highScores", JSON.stringify(highscores))
}

// contains questions, answer choices, and correct answer
var questions = [
    {
        question: "How do we enclose an HTML tag",
        answers: [
            { text: "{}", correct: false },
            { text: "()", correct: false },
            { text: "<>", correct: true },
            { text: "[]", correct: false },
        ]
    },

    {
        question: "How do you create an ordered list in HTML",
        answers: [
            { text: "<ul>", correct: false },
            { text: "<ol>", correct: true },
            { text: "<href>", correct: false },
            { text: "<main>", correct: false },
        ]
    },

    {
        question: "Which of these tools would NOT make a request to an API endpoint?",
        answers: [
            { text: "The browser", correct: false },
            { text: "The DevTools Network tab", correct: true },
            { text: "The Fetch API", correct: false },
            { text: "The curl command", correct: false },
        ]
    }, {
        question: "What is the correct HTML for making a radio button?",
        answers: [
            { text: "<radio>", correct: false },
            { text: "<radiobutton>", correct: false },
            { text: "<input type='radiobutton'>", correct: false },
            { text: "<input type='radio'>", correct: true },
        ]
    }, {
        question: "Which Moment.js method would help us get how many days away a date is?",
        answers: [
            { text: ".isAfter()", correct: false },
            { text: ".auditTask()", correct: false },
            { text: "Math.abs(moment().isBefore()-moment().isAfter())", correct: false },
            { text: ".diff", correct: true },
        ]
    },
]

window.onload=function() {
    var startButton = document.querySelector(".start-btn");
    //  attaching an event listener to start button to call startGame function on click
    startButton.addEventListener("click", startGame)
    nextButton.addEventListener("click", () => {
        // increment to the next question
        currentQuestionIndex++
        setNextQuestion()
    })
    submitButton.addEventListener("click", finalScoreScreen)
}

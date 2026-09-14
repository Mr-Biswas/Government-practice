// ============================================
// Government Prep Practice
// V1.0
// Authentication + Quiz + Timer + Scoring
// ============================================

console.log("APP.JS V1.0 FINAL LOADED");


// ============================================
// API
// ============================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


// ============================================
// SESSION
// ============================================

let sessionToken = null;
let loggedInUser = null;


// ============================================
// QUIZ STATE
// ============================================

let quizSection = "";

let quizQuestions = [];

let currentQuestionIndex = 0;

let selectedAnswer = null;


// One answer per question

let userAnswers = [];
let quizStartTime = null;


// ============================================
// TIMER
// ============================================

let questionTimer = null;

let timeRemaining = 15;


// ============================================
// DOM - LOGIN
// ============================================

const loginScreen =
    document.getElementById("login-screen");

const loginButton =
    document.getElementById("login-btn");

const nameInput =
    document.getElementById("name");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("login-message");


// ============================================
// DOM - HOME
// ============================================

const homeScreen =
    document.getElementById("home-screen");

const userName =
    document.getElementById("user-name");

const logoutButton =
    document.getElementById("logout-btn");

const homeMessage =
    document.getElementById("home-message");


// ============================================
// DOM - QUIZ
// ============================================

const quizScreen =
    document.getElementById("quiz-screen");

const quizSectionName =
    document.getElementById("quiz-section-name");

const questionCounter =
    document.getElementById("question-counter");

const questionTimerElement =
    document.getElementById("question-timer");

const questionText =
    document.getElementById("question-text");

const optionA =
    document.getElementById("option-a");

const optionB =
    document.getElementById("option-b");

const optionC =
    document.getElementById("option-c");

const optionD =
    document.getElementById("option-d");

const nextQuestionButton =
    document.getElementById("next-question-btn");


// ============================================
// DOM - RESULT
// ============================================

const resultScreen =
    document.getElementById("result-screen");

const resultSection =
    document.getElementById("result-section");

const finalScore =
    document.getElementById("final-score");

const finalCorrect =
    document.getElementById("final-correct");

const finalWrong =
    document.getElementById("final-wrong");

const finalTotal =
    document.getElementById("final-total");

const resultHomeButton =
    document.getElementById("result-home-btn");


// ============================================
// BUTTONS
// ============================================

const startButtons =
    document.querySelectorAll(".start-btn");

const optionButtons =
    document.querySelectorAll(".option-btn");


// ============================================
// EVENTS
// ============================================

loginButton.addEventListener(
    "click",
    login
);


logoutButton.addEventListener(
    "click",
    logout
);


resultHomeButton.addEventListener(
    "click",
    showHome
);


nextQuestionButton.addEventListener(
    "click",
    nextQuestion
);


startButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                startPractice(
                    button.dataset.section
                );

            }
        );

    }
);


optionButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                selectAnswer(
                    this.dataset.option
                );

            }
        );

    }
);


// ============================================
// LOGIN
// ============================================

async function login() {

    const name =
        nameInput.value.trim();

    const password =
        passwordInput.value;


    if (!name || !password) {

        showLoginMessage(
            "Please enter your name and password."
        );

        return;
    }


    loginButton.disabled =
        true;

    loginButton.textContent =
        "LOGGING IN...";


    try {

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "login"
        );

        formData.append(
            "name",
            name
        );

        formData.append(
            "password",
            password
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const result =
            await response.json();


        console.log(
            "LOGIN RESPONSE:",
            result
        );


        if (!result.success) {

            showLoginMessage(
                result.message ||
                "Invalid login details."
            );

            return;
        }


        sessionToken =
            result.token;

        loggedInUser =
            result.name;


        passwordInput.value =
            "";


        showHome();

    }


    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showLoginMessage(
            "Unable to connect to the server. Please try again."
        );

    }


    finally {

        loginButton.disabled =
            false;

        loginButton.textContent =
            "LOGIN";

    }

}


// ============================================
// LOGIN MESSAGE
// ============================================

function showLoginMessage(message) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;

}


// ============================================
// HOME MESSAGE
// ============================================

function showHomeMessage(message) {

    if (!homeMessage) {
        return;
    }


    homeMessage.textContent =
        message;

}


// ============================================
// SHOW HOME
// ============================================

function showHome() {

    stopQuestionTimer();
    quizStartTime = null;


    loginScreen.classList.add(
        "hidden"
    );

    homeScreen.classList.remove(
        "hidden"
    );

    quizScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );


    // Restore quiz card/header
    // for the next practice session

    const quizCard =
        document.querySelector(
            ".quiz-card"
        );

    const quizHeader =
        document.querySelector(
            ".quiz-header"
        );


    if (quizCard) {

        quizCard.classList.remove(
            "hidden"
        );

    }


    if (quizHeader) {

        quizHeader.classList.remove(
            "hidden"
        );

    }


    userName.textContent =
        loggedInUser || "";


    showLoginMessage("");

    showHomeMessage("");

}


// ============================================
// SHOW LOGIN
// ============================================

function showLogin() {

    stopQuestionTimer();


    loginScreen.classList.remove(
        "hidden"
    );

    homeScreen.classList.add(
        "hidden"
    );

    quizScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );

}


// ============================================
// LOGOUT
// ============================================

async function logout() {

    stopQuestionTimer();
    quizStartTime = null;


    if (sessionToken) {

        try {

            const formData =
                new URLSearchParams();


            formData.append(
                "action",
                "logout"
            );

            formData.append(
                "token",
                sessionToken
            );


            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );

        }


        catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );

        }

    }


    sessionToken =
        null;

    loggedInUser =
        null;

    quizSection =
        "";

    quizQuestions =
        [];

    userAnswers =
        [];

    currentQuestionIndex =
        0;

    selectedAnswer =
        null;


    showLogin();

}


// ============================================
// START PRACTICE
// ============================================

async function startPractice(section) {

    if (!sessionToken) {

        alert(
            "Your session has expired. Please log in again."
        );

        showLogin();

        return;
    }


    if (!section) {

        alert(
            "Practice section not found."
        );

        return;
    }


    quizSection =
        section;


    startButtons.forEach(
        function(button) {

            button.disabled =
                true;

        }
    );


    try {

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "getQuestions"
        );

        formData.append(
            "token",
            sessionToken
        );

        formData.append(
            "section",
            section
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const data =
            await response.json();


        console.log(
            "QUESTIONS RESPONSE:",
            data
        );


        if (!data.success) {

            alert(
                data.message ||
                "Unable to load questions."
            );

            return;
        }


        if (
            !Array.isArray(data.questions) ||
            data.questions.length !== 10
        ) {

            alert(
                "The practice session did not return exactly 10 questions."
            );

            return;
        }


        quizQuestions =
            data.questions;


        userAnswers =
            [];

        quizStartTime = Date.now();
        currentQuestionIndex =
            0;


        selectedAnswer =
            null;


        quizSectionName.textContent =
            section;


        resultScreen.classList.add(
            "hidden"
        );


        const quizCard =
            document.querySelector(
                ".quiz-card"
            );

        const quizHeader =
            document.querySelector(
                ".quiz-header"
            );


        quizCard.classList.remove(
            "hidden"
        );

        quizHeader.classList.remove(
            "hidden"
        );


        showQuiz();


        renderQuestion();

    }


    catch (error) {

        console.error(
            "QUESTION ERROR:",
            error
        );


        alert(
            "Unable to connect to the server. Please try again."
        );

    }


    finally {

        startButtons.forEach(
            function(button) {

                button.disabled =
                    false;

            }
        );

    }

}


// ============================================
// SHOW QUIZ
// ============================================

function showQuiz() {

    loginScreen.classList.add(
        "hidden"
    );

    homeScreen.classList.add(
        "hidden"
    );

    quizScreen.classList.remove(
        "hidden"
    );

}


// ============================================
// RENDER QUESTION
// ============================================

function renderQuestion() {

    stopQuestionTimer();


    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    if (!question) {

        return;
    }


    questionCounter.textContent =
        "Question " +
        (currentQuestionIndex + 1) +
        " of " +
        quizQuestions.length;


    questionText.textContent =
        question.question || "";


    optionA.textContent =
        question.options.A || "";

    optionB.textContent =
        question.options.B || "";

    optionC.textContent =
        question.options.C || "";

    optionD.textContent =
        question.options.D || "";


    selectedAnswer =
        null;


    optionButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    nextQuestionButton.disabled =
        true;


    startQuestionTimer();

}


// ============================================
// SELECT ANSWER
// ============================================

function selectAnswer(option) {

    if (
        questionTimer === null
    ) {

        return;
    }


    selectedAnswer =
        option;


    optionButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );


            if (
                button.dataset.option ===
                option
            ) {

                button.classList.add(
                    "selected"
                );

            }

        }
    );


    nextQuestionButton.disabled =
        false;

}


// ============================================
// RECORD CURRENT ANSWER
// ============================================

function recordCurrentAnswer() {

    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    if (!question) {

        return;
    }


    const answer =
        selectedAnswer || "";


    userAnswers.push({

        id:
            question.id,

        answer:
            answer

    });


    console.log(
        "RECORDED ANSWER:",
        {
            question:
                question.id,

            answer:
                answer
        }
    );

}


// ============================================
// NEXT QUESTION
// ============================================

function nextQuestion() {

    if (!selectedAnswer) {

        return;
    }


    stopQuestionTimer();


    recordCurrentAnswer();


    moveToNextQuestion();

}


// ============================================
// MOVE TO NEXT QUESTION
// ============================================

function moveToNextQuestion() {

    currentQuestionIndex++;


    if (
        currentQuestionIndex >=
        quizQuestions.length
    ) {

        submitQuiz();

        return;
    }


    renderQuestion();

}


// ============================================
// TIMEOUT
// ============================================

function handleTimeout() {

    console.log(
        "QUESTION TIMEOUT:",
        currentQuestionIndex + 1
    );


    // No selected answer means
    // unanswered / wrong.

    recordCurrentAnswer();


    moveToNextQuestion();

}


// ============================================
// START TIMER
// ============================================

function startQuestionTimer() {

    stopQuestionTimer();


    timeRemaining =
        15;


    updateTimerDisplay();


    questionTimer =
        setInterval(
            function() {

                timeRemaining--;


                updateTimerDisplay();


                if (
                    timeRemaining <= 0
                ) {

                    stopQuestionTimer();


                    handleTimeout();

                }

            },
            1000
        );

}


// ============================================
// UPDATE TIMER
// ============================================

function updateTimerDisplay() {

    if (!questionTimerElement) {

        return;
    }


    questionTimerElement.textContent =
        "Time: " +
        timeRemaining +
        "s";

}


// ============================================
// STOP TIMER
// ============================================

function stopQuestionTimer() {

    if (
        questionTimer !== null
    ) {

        clearInterval(
            questionTimer
        );


        questionTimer =
            null;

    }

}


// ============================================
// SUBMIT QUIZ
// ============================================

async function submitQuiz() {

    stopQuestionTimer();


    nextQuestionButton.disabled =
        true;


    questionTimerElement.textContent =
        "Submitting...";


    console.log(
        "SUBMITTING ANSWERS:",
        userAnswers
    );


    // Safety check

    if (
        userAnswers.length !==
        quizQuestions.length
    ) {

        console.error(
            "ANSWER COUNT MISMATCH",
            {
                questions:
                    quizQuestions.length,

                answers:
                    userAnswers.length
            }
        );


        alert(
            "There was a problem preparing your quiz result. Please try again."
        );


        showHome();

        return;
    }


    try {

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "submitQuiz"
        );

        formData.append(
            "token",
            sessionToken
        );

        formData.append(
            "section",
            quizSection
        );

        formData.append(
            "answers",
            JSON.stringify(
                userAnswers
            )

        formData.append("quizStartTime", String(quizStartTime || "")
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const result =
            await response.json();


        console.log(
            "SCORE RESPONSE:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "Unable to calculate score."
            );


            showHome();

            return;
        }


        showResult(result);

    }


    catch (error) {

        console.error(
            "SCORE ERROR:",
            error
        );


        alert(
            "Unable to submit the quiz. Please try again."
        );


        showHome();

    }

}


// ============================================
// SHOW RESULT
// ============================================

function showResult(result) {

    stopQuestionTimer();


    quizScreen.classList.remove(
        "hidden"
    );


    const quizCard =
        document.querySelector(
            ".quiz-card"
        );

    const quizHeader =
        document.querySelector(
            ".quiz-header"
        );


    if (quizCard) {

        quizCard.classList.add(
            "hidden"
        );

    }


    if (quizHeader) {

        quizHeader.classList.add(
            "hidden"
        );

    }


    resultScreen.classList.remove(
        "hidden"
    );


    resultSection.textContent =
        quizSection;


    finalScore.textContent =
        result.score;


    finalCorrect.textContent =
        result.correct;


    finalWrong.textContent =
        result.wrong;


    finalTotal.textContent =
        result.totalQuestions;


    console.log(
        "FINAL RESULT:",
        result
    );

}

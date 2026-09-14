// ============================================
// Government Prep Practice
// Phase 4B
// Authentication + Home + Basic Quiz Flow
// ============================================


console.log("APP.JS PHASE 4B - FINAL LOADED");


// ============================================
// APPS SCRIPT WEB APP URL
// ============================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


// ============================================
// SESSION STATE
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


// ============================================
// DOM ELEMENTS
// ============================================

// --------------------------------------------
// Login
// --------------------------------------------

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


// --------------------------------------------
// Home
// --------------------------------------------

const homeScreen =
    document.getElementById("home-screen");

const userName =
    document.getElementById("user-name");

const logoutButton =
    document.getElementById("logout-btn");

const homeMessage =
    document.getElementById("home-message");


// --------------------------------------------
// Quiz
// --------------------------------------------

const quizScreen =
    document.getElementById("quiz-screen");

const quizSectionName =
    document.getElementById("quiz-section-name");

const questionCounter =
    document.getElementById("question-counter");

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


// --------------------------------------------
// Section buttons
// --------------------------------------------

const startButtons =
    document.querySelectorAll(".start-btn");


// --------------------------------------------
// Option buttons
// --------------------------------------------

const optionButtons =
    document.querySelectorAll(".option-btn");


// ============================================
// BASIC DOM CHECK
// ============================================

console.log(
    "Quiz screen found:",
    !!quizScreen
);

console.log(
    "Option A found:",
    !!optionA
);

console.log(
    "Option B found:",
    !!optionB
);

console.log(
    "Option C found:",
    !!optionC
);

console.log(
    "Option D found:",
    !!optionD
);


// ============================================
// LOGIN EVENT
// ============================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}


// ============================================
// SECTION EVENTS
// ============================================

startButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const section =
                    button.dataset.section;

                console.log(
                    "SECTION SELECTED:",
                    section
                );

                startPractice(section);

            }
        );

    }
);


// ============================================
// LOGOUT EVENT
// ============================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


// ============================================
// OPTION EVENTS
// ============================================

optionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                selectAnswer(
                    this.dataset.option
                );

            }
        );

    }
);


// ============================================
// NEXT QUESTION EVENT
// ============================================

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        nextQuestion
    );

}


// ============================================
// LOGIN
// ============================================

async function login() {

    const name =
        nameInput.value.trim();

    const password =
        passwordInput.value;


    // ----------------------------------------
    // Validate fields
    // ----------------------------------------

    if (!name || !password) {

        showLoginMessage(
            "Please enter your name and password."
        );

        return;
    }


    // ----------------------------------------
    // Validate API URL
    // ----------------------------------------

    if (
        !API_URL ||
        API_URL ===
        "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"
    ) {

        showLoginMessage(
            "Apps Script API URL is not configured."
        );

        console.error(
            "API_URL is not configured."
        );

        return;
    }


    // ----------------------------------------
    // Loading state
    // ----------------------------------------

    loginButton.disabled =
        true;

    loginButton.textContent =
        "LOGGING IN...";

    showLoginMessage("");


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
                "Server returned HTTP " +
                response.status
            );
        }


        const result =
            await response.json();


        console.log(
            "LOGIN RESPONSE:",
            result
        );


        // ------------------------------------
        // Login failed
        // ------------------------------------

        if (!result.success) {

            showLoginMessage(
                result.message ||
                "Invalid login details."
            );

            return;
        }


        // ------------------------------------
        // Login successful
        // ------------------------------------

        sessionToken =
            result.token;

        loggedInUser =
            result.name;


        console.log(
            "LOGIN SUCCESSFUL"
        );

        console.log(
            "USER:",
            loggedInUser
        );

        console.log(
            "TOKEN RECEIVED:",
            sessionToken
                ? "YES"
                : "NO"
        );


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
// SHOW LOGIN MESSAGE
// ============================================

function showLoginMessage(message) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;

}


// ============================================
// SHOW HOME MESSAGE
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

    loginScreen.classList.remove(
        "hidden"
    );

    loginScreen.classList.add(
        "hidden"
    );


    homeScreen.classList.remove(
        "hidden"
    );


    quizScreen.classList.add(
        "hidden"
    );


    userName.textContent =
        loggedInUser || "";


    showLoginMessage("");

    showHomeMessage("");


    console.log(
        "HOME SCREEN DISPLAYED"
    );

}


// ============================================
// SHOW LOGIN
// ============================================

function showLogin() {

    loginScreen.classList.remove(
        "hidden"
    );


    homeScreen.classList.add(
        "hidden"
    );


    quizScreen.classList.add(
        "hidden"
    );


    console.log(
        "LOGIN SCREEN DISPLAYED"
    );

}


// ============================================
// LOGOUT
// ============================================

async function logout() {

    if (!sessionToken) {

        loggedInUser =
            null;

        showLogin();

        return;
    }


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


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();


        console.log(
            "LOGOUT RESPONSE:",
            result
        );

    }


    catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

    }


    finally {

        sessionToken =
            null;

        loggedInUser =
            null;


        quizSection =
            "";

        quizQuestions =
            [];

        currentQuestionIndex =
            0;

        selectedAnswer =
            null;


        showLogin();

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


    console.log(
        "QUIZ SCREEN DISPLAYED"
    );


    console.log(
        "QUIZ SCREEN RECT:",
        quizScreen.getBoundingClientRect()
    );

}


// ============================================
// START PRACTICE
// ============================================

async function startPractice(section) {

    // ----------------------------------------
    // Session check
    // ----------------------------------------

    if (!sessionToken) {

        alert(
            "Your session has expired. Please log in again."
        );

        showLogin();

        return;
    }


    // ----------------------------------------
    // Section check
    // ----------------------------------------

    if (!section) {

        console.error(
            "No section provided."
        );

        alert(
            "Unable to start practice. Section not found."
        );

        return;
    }


    quizSection =
        section;


    // ----------------------------------------
    // Disable buttons while loading
    // ----------------------------------------

    startButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    try {

        console.log(
            "LOADING QUESTIONS"
        );

        console.log(
            "SECTION:",
            section
        );


        // ------------------------------------
        // Create request
        // ------------------------------------

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


        // ------------------------------------
        // Send request
        // ------------------------------------

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
                "Server returned HTTP " +
                response.status
            );
        }


        // ------------------------------------
        // Read backend response
        // ------------------------------------

        const data =
            await response.json();


        console.log(
            "FULL QUESTIONS RESPONSE:",
            data
        );


        // ------------------------------------
        // Backend error
        // ------------------------------------

        if (!data.success) {

            alert(
                data.message ||
                "Unable to load questions."
            );

            return;
        }


        // ------------------------------------
        // Validate questions
        // ------------------------------------

        if (
            !Array.isArray(data.questions)
        ) {

            console.error(
                "Questions is not an array:",
                data.questions
            );

            alert(
                "Invalid question data received from server."
            );

            return;
        }


        if (
            data.questions.length === 0
        ) {

            alert(
                "No questions were returned from the server."
            );

            return;
        }


        // ------------------------------------
        // Store questions
        // ------------------------------------

        quizQuestions =
            data.questions;


        console.log(
            "TOTAL QUESTIONS RECEIVED:",
            quizQuestions.length
        );


        console.log(
            "FIRST QUESTION:",
            quizQuestions[0]
        );


        // ------------------------------------
        // Start from question 1
        // ------------------------------------

        currentQuestionIndex =
            0;


        selectedAnswer =
            null;


        // ------------------------------------
        // Section heading
        // ------------------------------------

        quizSectionName.textContent =
            section;


        // ------------------------------------
        // Show quiz
        // ------------------------------------

        showQuiz();


        // ------------------------------------
        // Render first question
        // ------------------------------------

        renderQuestion();

    }


    catch (error) {

        console.error(
            "ERROR LOADING QUESTIONS:",
            error
        );


        alert(
            "Unable to connect to the server. Please try again."
        );

    }


    finally {

        startButtons.forEach(
            function (button) {

                button.disabled =
                    false;

            }
        );

    }

}


// ============================================
// RENDER QUESTION
// ============================================

function renderQuestion() {

    // ----------------------------------------
    // Check question list
    // ----------------------------------------

    if (
        !Array.isArray(quizQuestions) ||
        quizQuestions.length === 0
    ) {

        console.error(
            "No quiz questions available."
        );

        return;
    }


    // ----------------------------------------
    // Get current question
    // ----------------------------------------

    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    if (!question) {

        console.error(
            "Question not found:",
            currentQuestionIndex
        );

        return;
    }


    console.log(
        "RENDERING QUESTION:",
        question
    );


    // ----------------------------------------
    // Update counter
    // ----------------------------------------

    questionCounter.textContent =
        "Question " +
        (currentQuestionIndex + 1) +
        " of " +
        quizQuestions.length;


    // ----------------------------------------
    // Display question
    // ----------------------------------------

    questionText.textContent =
        question.question || "";


    // ----------------------------------------
    // IMPORTANT:
    // Backend returns:
    //
    // options: {
    //     A: "...",
    //     B: "...",
    //     C: "...",
    //     D: "..."
    // }
    // ----------------------------------------

    if (
        !question.options ||
        typeof question.options !== "object"
    ) {

        console.error(
            "OPTIONS OBJECT NOT FOUND:",
            question
        );


        optionA.textContent =
            "Option data unavailable";

        optionB.textContent =
            "";

        optionC.textContent =
            "";

        optionD.textContent =
            "";

    }

    else {

        console.log(
            "OPTIONS RECEIVED:",
            question.options
        );


        optionA.textContent =
            question.options.A || "";

        optionB.textContent =
            question.options.B || "";

        optionC.textContent =
            question.options.C || "";

        optionD.textContent =
            question.options.D || "";

    }


    // ----------------------------------------
    // Reset selected answer
    // ----------------------------------------

    selectedAnswer =
        null;


    // ----------------------------------------
    // Remove previous selection
    // ----------------------------------------

    optionButtons.forEach(
        function (button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    // ----------------------------------------
    // Disable Next
    // ----------------------------------------

    nextQuestionButton.disabled =
        true;


    // ----------------------------------------
    // Debug final DOM values
    // ----------------------------------------

    console.log(
        "DISPLAYED OPTION A:",
        optionA.textContent
    );

    console.log(
        "DISPLAYED OPTION B:",
        optionB.textContent
    );

    console.log(
        "DISPLAYED OPTION C:",
        optionC.textContent
    );

    console.log(
        "DISPLAYED OPTION D:",
        optionD.textContent
    );

}


// ============================================
// SELECT ANSWER
// ============================================

function selectAnswer(option) {

    selectedAnswer =
        option;


    optionButtons.forEach(
        function (button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    optionButtons.forEach(
        function (button) {

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


    console.log(
        "SELECTED ANSWER:",
        selectedAnswer
    );

}


// ============================================
// NEXT QUESTION
// ============================================

function nextQuestion() {

    if (!selectedAnswer) {

        return;
    }


    currentQuestionIndex++;


    if (
        currentQuestionIndex >=
        quizQuestions.length
    ) {

        alert(
            "Basic quiz flow completed successfully."
        );


        showHome();

        return;
    }


    renderQuestion();

}

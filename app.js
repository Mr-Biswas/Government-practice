// ============================================
// Government Prep Practice
// Phase 4B
// Authentication + Home + Basic Quiz Flow
// ============================================


console.log("APP.JS PHASE 4B LOADED");


// ============================================
// APPS SCRIPT WEB APP URL
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


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

// Login

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


// Home

const homeScreen =
    document.getElementById("home-screen");

const userName =
    document.getElementById("user-name");

const logoutButton =
    document.getElementById("logout-btn");

const homeMessage =
    document.getElementById("home-message");


// Quiz

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


// Section buttons

const startButtons =
    document.querySelectorAll(".start-btn");


// Quiz option buttons

const optionButtons =
    document.querySelectorAll(".option-btn");


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
// QUIZ OPTION EVENTS
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

        // ------------------------------------
        // Send login request
        // ------------------------------------

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


        // ------------------------------------
        // Check HTTP response
        // ------------------------------------

        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );
        }


        // ------------------------------------
        // Read JSON response
        // ------------------------------------

        const result =
            await response.json();


        console.log(
            "Login response:",
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
            "Authenticated user:",
            loggedInUser
        );

        console.log(
            "Session token received:",
            sessionToken
                ? "YES"
                : "NO"
        );


        // ------------------------------------
        // Clear password field
        // ------------------------------------

        passwordInput.value =
            "";


        // ------------------------------------
        // Open Home
        // ------------------------------------

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
        loggedInUser;


    showLoginMessage("");

    showHomeMessage("");


    console.log(
        "HOME SCREEN DISPLAYED"
    );

}


// ============================================
// SHOW LOGIN SCREEN
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

    // ----------------------------------------
    // If there is no session, simply return
    // to login
    // ----------------------------------------

    if (!sessionToken) {

        loggedInUser =
            null;

        showLogin();

        return;
    }


    try {

        // ------------------------------------
        // Send logout request
        // ------------------------------------

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
            "Logout response:",
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

        // ------------------------------------
        // Clear session from browser memory
        // ------------------------------------

        sessionToken =
            null;

        loggedInUser =
            null;


        // ------------------------------------
        // Clear quiz state
        // ------------------------------------

        quizSection =
            "";

        quizQuestions =
            [];

        currentQuestionIndex =
            0;

        selectedAnswer =
            null;


        // ------------------------------------
        // Return to login
        // ------------------------------------

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

}


// ============================================
// START PRACTICE
// ============================================

async function startPractice(section) {

    // ----------------------------------------
    // Check session
    // ----------------------------------------

    if (!sessionToken) {

        alert(
            "Your session has expired. Please log in again."
        );

        showLogin();

        return;
    }


    // ----------------------------------------
    // Validate section
    // ----------------------------------------

    if (!section) {

        console.error(
            "No section was provided."
        );

        alert(
            "Unable to start practice. Section not found."
        );

        return;
    }


    // ----------------------------------------
    // Store selected section
    // ----------------------------------------

    quizSection =
        section;


    // ----------------------------------------
    // Disable clicked button temporarily
    // ----------------------------------------

    startButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    try {

        console.log(
            "Loading questions for section:",
            section
        );


        // ------------------------------------
        // IMPORTANT:
        // Use URLSearchParams because the
        // Apps Script backend reads
        // e.parameter.
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
        // Request questions
        // ------------------------------------

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        // ------------------------------------
        // Check HTTP response
        // ------------------------------------

        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );
        }


        // ------------------------------------
        // Convert response to JSON
        // ------------------------------------

        const data =
            await response.json();


        console.log(
            "Questions response:",
            data
        );


        // ------------------------------------
        // Backend rejected request
        // ------------------------------------

        if (!data.success) {

            alert(
                data.message ||
                "Unable to load questions."
            );

            return;
        }


        // ------------------------------------
        // Validate question array
        // ------------------------------------

        if (
            !Array.isArray(data.questions) ||
            data.questions.length === 0
        ) {

            alert(
                "No questions were returned from the server."
            );

            return;
        }


        // ------------------------------------
        // Store questions in memory
        // ------------------------------------

        quizQuestions =
            data.questions;


        // ------------------------------------
        // Start from question 1
        // ------------------------------------

        currentQuestionIndex =
            0;


        // ------------------------------------
        // Reset selected answer
        // ------------------------------------

        selectedAnswer =
            null;


        // ------------------------------------
        // Display section name
        // ------------------------------------

        quizSectionName.textContent =
            section;


        // ------------------------------------
        // Open quiz screen
        // ------------------------------------

        showQuiz();


        // ------------------------------------
        // Display first question
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

        // ------------------------------------
        // Re-enable section buttons
        // ------------------------------------

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
    // Validate question data
    // ----------------------------------------

    if (
        !quizQuestions ||
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
            "Question not found at index:",
            currentQuestionIndex
        );

        return;
    }


    // ----------------------------------------
    // Update question counter
    // ----------------------------------------

    questionCounter.textContent =
        `Question ${
            currentQuestionIndex + 1
        } of ${
            quizQuestions.length
        }`;


    // ----------------------------------------
    // Display question
    // ----------------------------------------

    questionText.textContent =
        question.question;


    // ----------------------------------------
    // Display options
    // ----------------------------------------

    optionA.textContent =
        question.option.A;

    optionB.textContent =
        question.option.B;

    optionC.textContent =
        question.option.C;

    optionD.textContent =
        question.option.D;


    // ----------------------------------------
    // Reset answer
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
    // Disable Next button
    // ----------------------------------------

    nextQuestionButton.disabled =
        true;

}


// ============================================
// SELECT ANSWER
// ============================================

function selectAnswer(option) {

    // ----------------------------------------
    // Store selected answer
    // ----------------------------------------

    selectedAnswer =
        option;


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
    // Highlight selected option
    // ----------------------------------------

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


    // ----------------------------------------
    // Enable Next button
    // ----------------------------------------

    nextQuestionButton.disabled =
        false;


    console.log(
        "Selected answer:",
        selectedAnswer
    );

}


// ============================================
// NEXT QUESTION
// ============================================

function nextQuestion() {

    // ----------------------------------------
    // Make sure an answer is selected
    // ----------------------------------------

    if (!selectedAnswer) {

        return;
    }


    // ----------------------------------------
    // Move to next question
    // ----------------------------------------

    currentQuestionIndex++;


    // ----------------------------------------
    // Check if quiz is complete
    // ----------------------------------------

    if (
        currentQuestionIndex >=
        quizQuestions.length
    ) {

        alert(
            "Basic quiz flow completed successfully."
        );


        // ------------------------------------
        // Return to Home
        // ------------------------------------

        showHome();

        return;
    }


    // ----------------------------------------
    // Display next question
    // ----------------------------------------

    renderQuestion();

}

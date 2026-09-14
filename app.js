// ============================================
// Government Prep Practice
// Phase 3
// Authentication + Home Screen
// ============================================


console.log("APP.JS VERSION 3 LOADED");


// ============================================
// APPS SCRIPT WEB APP URL
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


// ============================================
// SESSION STATE
// ============================================

let sessionToken = null;

let loggedInUser = null;

// Quiz state
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

const quizScreen =
    document.getElementById("quiz-screen");


// Section buttons

const startButtons =
    document.querySelectorAll(".start-btn");


// ============================================
// LOGIN EVENT
// ============================================

loginButton.addEventListener(
    "click",
    login
);


// ============================================
// SECTION EVENTS
// ============================================

startButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const section =
                button.dataset.section;

            startPractice(section);

        }
    );

});


// ============================================
// LOGOUT EVENT
// ============================================

logoutButton.addEventListener(
    "click",
    logout
);


// ============================================
// LOGIN
// ============================================

async function login() {

    const name =
        nameInput.value.trim();

    const password =
        passwordInput.value;


    // -----------------------------
    // Validate fields
    // -----------------------------

    if (!name || !password) {

        showLoginMessage(
            "Please enter your name and password."
        );

        return;
    }


    // -----------------------------
    // Validate API URL
    // -----------------------------

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


    // -----------------------------
    // Loading state
    // -----------------------------

    loginButton.disabled = true;

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
            "Login response:",
            result
        );


        // -----------------------------
        // Login failed
        // -----------------------------

        if (!result.success) {

            showLoginMessage(
                result.message ||
                "Invalid login details."
            );

            return;
        }


        // -----------------------------
        // Login successful
        // -----------------------------

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


        // -----------------------------
        // Open Home
        // -----------------------------

        showHome();


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showLoginMessage(
            "Unable to connect to the server. Please try again."
        );


    } finally {

        loginButton.disabled =
            false;

        loginButton.textContent =
            "LOGIN";

    }

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

    // Check whether the user is logged in
    if (!sessionToken) {

        alert(
            "Your session has expired. Please log in again."
        );


        loginScreen.classList.remove(
            "hidden"
        );

        homeScreen.classList.add(
            "hidden"
        );

        quizScreen.classList.add(
            "hidden"
        );

        return;
    }


    // Store selected section
    quizSection = section;


    try {

        // Request questions from Google Apps Script
        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "getQuestions",
                    token: sessionToken,
                    section: section
                })
            }
        );


        // Convert response to JSON
        const data =
            await response.json();


        // Handle backend error
        if (!data.success) {

            alert(
                data.message ||
                "Unable to load questions."
            );

            return;
        }


        // Store questions in browser memory
        quizQuestions =
            data.questions;


        // Start from first question
        currentQuestionIndex =
            0;


        // Reset selected answer
        selectedAnswer =
            null;


        // Display selected section
        document.getElementById(
            "quiz-section-name"
        ).textContent =
            section;


        // Show quiz screen
        showQuiz();


        // Display first question
        renderQuestion();

    }

    catch (error) {

        console.error(
            "Error loading questions:",
            error
        );


        alert(
            "Unable to connect to the server. Please try again."
        );
    }
}


// ============================================
// RENDER QUESTION
// ============================================

function renderQuestion() {

    // Make sure questions are available
    if (
        !quizQuestions ||
        quizQuestions.length === 0
    ) {
        return;
    }


    const question =
        quizQuestions[
            currentQuestionIndex
        ];


    // Update question counter
    document.getElementById(
        "question-counter"
    ).textContent =
        `Question ${
            currentQuestionIndex + 1
        } of ${
            quizQuestions.length
        }`;


    // Display question
    document.getElementById(
        "question-text"
    ).textContent =
        question.question;


    // Display options
    document.getElementById(
        "option-a"
    ).textContent =
        question.optionA;

    document.getElementById(
        "option-b"
    ).textContent =
        question.optionB;

    document.getElementById(
        "option-c"
    ).textContent =
        question.optionC;

    document.getElementById(
        "option-d"
    ).textContent =
        question.optionD;


    // Reset selected answer
    selectedAnswer =
        null;


    // Remove previous selection
    document.querySelectorAll(
        ".option-btn"
    ).forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    // Disable Next button
    document.getElementById(
        "next-question-btn"
    ).disabled =
        true;
}


// ============================================
// OPTION SELECTION
// ============================================

document.querySelectorAll(
    ".option-btn"
).forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                // Store selected answer
                selectedAnswer =
                    this.dataset.option;


                // Remove previous selection
                document.querySelectorAll(
                    ".option-btn"
                ).forEach(
                    function(option) {

                        option.classList.remove(
                            "selected"
                        );

                    }
                );


                // Highlight selected option
                this.classList.add(
                    "selected"
                );


                // Enable Next button
                document.getElementById(
                    "next-question-btn"
                ).disabled =
                    false;

            }
        );

    }
);


// ============================================
// NEXT QUESTION
// ============================================

document.getElementById(
    "next-question-btn"
).addEventListener(
    "click",
    function() {

        // Make sure an answer is selected
        if (!selectedAnswer) {
            return;
        }


        // Move to next question
        currentQuestionIndex++;


        // Check whether all questions are completed
        if (
            currentQuestionIndex >=
            quizQuestions.length
        ) {

            alert(
                "Basic quiz flow completed successfully."
            );


            // Return to Home
            showHome();

            return;
        }


        // Display next question
        renderQuestion();

    }
);

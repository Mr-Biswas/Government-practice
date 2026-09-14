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


    userName.textContent =
        loggedInUser;


    showLoginMessage("");

    showHomeMessage("");


    console.log(
        "HOME SCREEN DISPLAYED"
    );
}


// ============================================
// START PRACTICE
// ============================================

async function startPractice(section) {
    // Check whether the user is logged in
    if (!sessionToken) {
        alert("Your session has expired. Please log in again.");
        showScreen("login-screen");
        return;
    }

    // Store selected section
    quizSection = section;

    try {
        // Prepare form data for Google Apps Script
        const requestData = new URLSearchParams();

        requestData.append("action", "getQuestions");
        requestData.append("token", sessionToken);
        requestData.append("section", section);

        // Request questions from Google Apps Script
        const response = await fetch(API_URL, {
            method: "POST",
            body: requestData.toString()
        });

        const data = await response.json();

        // Handle backend error
        if (!data.success) {
            alert(
                data.message ||
                "Unable to load questions."
            );
            return;
        }

        // Store questions in browser memory
        quizQuestions = data.questions;
        currentQuestionIndex = 0;
        selectedAnswer = null;

        // Display selected section
        document.getElementById("quiz-section-name").textContent = section;

        // Open quiz screen
        showScreen("quiz-screen");

        // Display first question
        renderQuestion();

    } catch (error) {
        console.error("Error loading questions:", error);

        alert(
            "Unable to connect to the server. Please try again."
        );
    }
}

//     console.log(
//         "Selected section:",
//         section
//     );


//     showHomeMessage(
//         section +
//         " selected. Quiz engine will be connected in the next phase."
//     );

// }


// ============================================
// LOGOUT
// ============================================

async function logout() {

    // -----------------------------
    // If there is no session
    // -----------------------------

    if (!sessionToken) {

        resetApplication();

        return;
    }


    logoutButton.disabled = true;

    logoutButton.textContent =
        "LOGGING OUT...";


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
            "Logout response:",
            result
        );


    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

    } finally {

        resetApplication();

    }

}


// ============================================
// RESET APPLICATION
// ============================================

function resetApplication() {

    // Clear authentication state

    sessionToken = null;

    loggedInUser = null;


    // Clear input fields

    nameInput.value = "";

    passwordInput.value = "";


    // Clear messages

    showLoginMessage("");

    showHomeMessage("");


    // Return to login

    homeScreen.classList.add(
        "hidden"
    );

    loginScreen.classList.remove(
        "hidden"
    );


    logoutButton.disabled =
        false;

    logoutButton.textContent =
        "LOGOUT";


    loginButton.disabled =
        false;

    loginButton.textContent =
        "LOGIN";


    console.log(
        "APPLICATION RESET"
    );

}


// ============================================
// MESSAGE HELPERS
// ============================================

function showLoginMessage(message) {

    loginMessage.textContent =
        message;

}


function showHomeMessage(message) {

    homeMessage.textContent =
        message;

}

function renderQuestion() {
    // Make sure questions are available
    if (!quizQuestions || quizQuestions.length === 0) {
        return;
    }

    const question = quizQuestions[currentQuestionIndex];

    // Question number
    document.getElementById("question-counter").textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    // Question text
    document.getElementById("question-text").textContent =
        question.question;

    // Options
    document.getElementById("option-a").textContent =
        question.optionA;

    document.getElementById("option-b").textContent =
        question.optionB;

    document.getElementById("option-c").textContent =
        question.optionC;

    document.getElementById("option-d").textContent =
        question.optionD;

    // Reset answer
    selectedAnswer = null;

    // Remove previous selection
    document.querySelectorAll(".option-btn").forEach(button => {
        button.classList.remove("selected");
    });

    // Disable Next button
    document.getElementById("next-question-btn").disabled = true;
}

document.querySelectorAll(".option-btn").forEach(button => {

    button.addEventListener("click", function () {

        // Store selected answer
        selectedAnswer = this.dataset.option;

        // Remove selection from all options
        document.querySelectorAll(".option-btn").forEach(option => {
            option.classList.remove("selected");
        });

        // Highlight selected option
        this.classList.add("selected");

        // Enable Next button
        document.getElementById("next-question-btn").disabled = false;
    });

});




document.getElementById("next-question-btn").addEventListener("click", function () {

    // Don't continue without an answer
    if (!selectedAnswer) {
        return;
    }

    // Move to the next question
    currentQuestionIndex++;

    // Check whether all questions are completed
    if (currentQuestionIndex >= quizQuestions.length) {

        alert("Basic quiz flow completed successfully.");

        // Return to home temporarily
        showScreen("home-screen");

        return;
    }

    // Display next question
    renderQuestion();

});



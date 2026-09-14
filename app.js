// ============================================
// Government Prep Practice
// Frontend Authentication
// Phase 2
// ============================================


// ============================================
// APPS SCRIPT WEB APP URL
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


// ============================================
// SESSION STATE
// ============================================

// Intentionally kept only in memory.
// It disappears when the page is refreshed.
let sessionToken = null;
let loggedInUser = null;


// ============================================
// DOM ELEMENTS
// ============================================

const loginButton = document.getElementById("login-btn");

const nameInput = document.getElementById("name");

const passwordInput = document.getElementById("password");

const loginMessage = document.getElementById("login-message");


// ============================================
// LOGIN BUTTON
// ============================================

loginButton.addEventListener("click", login);


// ============================================
// LOGIN FUNCTION
// ============================================

async function login() {

    const name = nameInput.value.trim();

    const password = passwordInput.value;


    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!name || !password) {

        showMessage(
            "Please enter your name and password."
        );

        return;
    }


    // -----------------------------
    // Disable button while logging in
    // -----------------------------

    loginButton.disabled = true;

    loginButton.textContent = "LOGGING IN...";

    showMessage("");


    try {

        // URLSearchParams creates a standard
        // application/x-www-form-urlencoded POST.
        const formData = new URLSearchParams();

        formData.append("action", "login");

        formData.append("name", name);

        formData.append("password", password);


        const response = await fetch(API_URL, {

            method: "POST",

            body: formData,

            redirect: "follow"

        });


        if (!response.ok) {

            throw new Error(
                "Unable to contact the authentication server."
            );
        }


        const result = await response.json();


        // -----------------------------
        // Login failed
        // -----------------------------

        if (!result.success) {

            showMessage(
                result.message || "Invalid login details."
            );

            return;
        }


        // -----------------------------
        // Login successful
        // -----------------------------

        sessionToken = result.token;

        loggedInUser = result.name;


        showMessage(
            "Login successful. Welcome, " +
            loggedInUser + "!"
        );


        console.log(
            "Authenticated user:",
            loggedInUser
        );


        console.log(
            "Session created successfully."
        );


        // --------------------------------
        // Home screen will be connected
        // in the next phase.
        // --------------------------------

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showMessage(
            "Unable to connect to the server. Please try again."
        );

    } finally {

        loginButton.disabled = false;

        loginButton.textContent = "LOGIN";
    }
}


// ============================================
// MESSAGE HELPER
// ============================================

function showMessage(message) {

    loginMessage.textContent = message;
}

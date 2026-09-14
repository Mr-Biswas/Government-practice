// ============================================
// Government Prep Practice
// Phase 2 - Authentication
// ============================================

console.log("APP.JS VERSION 2 LOADED");


// ============================================
// APPS SCRIPT URL
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbyFwimtTepiYgi29nNxBi6CpDj-TjbcwzpmOw0gtn86st_JT1cDP0AhZl5rvV_WdgAqYA/exec";


// ============================================
// SESSION STATE
// ============================================

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
// CHECK FRONTEND CONNECTION
// ============================================

console.log("Login button:", loginButton);
console.log("Name input:", nameInput);
console.log("Password input:", passwordInput);
console.log("Login message:", loginMessage);


// ============================================
// LOGIN EVENT
// ============================================

if (loginButton) {

    loginButton.addEventListener("click", function () {

        console.log("LOGIN BUTTON CLICKED");

        login();

    });

} else {

    console.error("LOGIN BUTTON NOT FOUND");

}


// ============================================
// LOGIN
// ============================================

async function login() {

    console.log("LOGIN FUNCTION STARTED");


    const name = nameInput.value.trim();
    const password = passwordInput.value;


    console.log("Name entered:", name);
    console.log("Password entered:", password ? "YES" : "NO");


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
    // Check API URL
    // -----------------------------

    if (
        !API_URL ||
        API_URL === "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"
    ) {

        showMessage(
            "Apps Script API URL is not configured."
        );

        console.error(
            "API_URL has not been configured."
        );

        return;
    }


    // -----------------------------
    // Disable button
    // -----------------------------

    loginButton.disabled = true;

    loginButton.textContent = "LOGGING IN...";

    showMessage("");


    try {

        console.log("Sending login request...");


        const formData = new URLSearchParams();

        formData.append("action", "login");
        formData.append("name", name);
        formData.append("password", password);


        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });


        console.log(
            "Server response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " + response.status
            );
        }


        const result = await response.json();


        console.log(
            "Server response:",
            result
        );


        if (!result.success) {

            showMessage(
                result.message || "Invalid login details."
            );

            return;
        }


        // -----------------------------
        // SUCCESS
        // -----------------------------

        sessionToken = result.token;

        loggedInUser = result.name;


        console.log(
            "LOGIN SUCCESSFUL"
        );

        console.log(
            "Authenticated user:",
            loggedInUser
        );


        console.log(
            "Session token received:",
            sessionToken ? "YES" : "NO"
        );


        showMessage(
            "Login successful. Welcome, " +
            loggedInUser + "!"
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
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
// MESSAGE
// ============================================

function showMessage(message) {

    loginMessage.textContent = message;

}

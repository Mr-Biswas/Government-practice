console.log("Government Prep Practice - V1");

const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("login-message");

    if (!name || !password) {
        message.textContent = "Please enter your name and password.";
        return;
    }

    message.textContent = "Authentication will be connected in Phase 2.";
});

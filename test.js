let user = "Global Bob"; // Global variable

function login() {
    let users = user; // Local variable
    console.log("Inside:", user);
}

login();
console.log("Outside:", user);
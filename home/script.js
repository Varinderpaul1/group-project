document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");
    const home = document.querySelector(".home");
    const formOpenBtn = document.querySelector("#form-open");
    const formContainer = document.querySelector(".form_container");
    const formCloseBtn = document.querySelector(".form_close");
    const signupBtn = document.querySelector("#signup");
    const mainbox = document.querySelector("#mainboxSpinner");
    const loginBtn = document.querySelector("#login");
    const pwShowHide = document.querySelectorAll(".pw_hide");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const user = document.getElementById("user");
    const myLink = document.getElementById("myLink");
    const drop = document.getElementById("drop");

    function showMainBoxModal() {
        if (mainbox) {
            mainbox.style.display = "block";
        }
    }

    // Set a timeout to call the showMainBoxModal function after 3 seconds (3000 milliseconds)
    setTimeout(showMainBoxModal, 3000);

   
    let userLoggedIn = false;
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    checkUserLogin();
console.log(registeredUsers);
    // Store the interval reference
    // let intervalId;

    formCloseBtn.addEventListener("click",  (event) => {
        home.classList.remove("show");
        formContainer.classList.remove("active"); // Reset the formContainer class

        // Clear the interval when the form is closed
        clearInterval(intervalId);
    });

    formOpenBtn.addEventListener("click", () => {
        clearForms();
        home.classList.add("show");

    });

    function clearForms() {
        document.getElementById("loginForm").reset();
        document.getElementById("signupForm").reset();
    }

    pwShowHide.forEach((icon) => {
        icon.addEventListener("click", () => {
            let getPwInput = icon.parentElement.querySelector("input");
            if (getPwInput.type === "password") {
                getPwInput.type = "text";
                icon.classList.replace("uil-eye-slash", "uil-eye");
            } else {
                getPwInput.type = "password";
                icon.classList.replace("uil-eye", "uil-eye-slash");
            }
        });
    });

    signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.add("active");
    });



    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.remove("active");
    });

    loginForm.addEventListener("submit", loginUser);
    signupForm.addEventListener("submit", signupUser);

    function loginUser(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById("loginEmail").value;
        const enteredPassword = document.getElementById("loginPassword").value;
        const loginEmailError = document.getElementById("loginEmailError");
        const loginPasswordError = document.getElementById("loginPasswordError");

        // Reset error messages
        loginEmailError.textContent = "";
        loginPasswordError.textContent = "";

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(enteredUsername)) {
            loginEmailError.textContent = "Please enter a valid email address.";
            return;
        }

        // Validate password length or any other criteria
        if (enteredPassword.length < 6) {
            loginPasswordError.textContent = "Password must be at least 6 characters long.";
            return;
        }
        const loggedInUserIndex = registeredUsers.findIndex(
            (user) => user.userEmail === enteredUsername && user.userPassword === enteredPassword
        );

        if (loggedInUserIndex !== -1) {

            registeredUsers[loggedInUserIndex].isLoggedIn = true;
            home.classList.remove("show");
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            userLoggedIn = true;
            alert("Login successful!");
            checkUserLogin();
            drop.classList.remove('display');
            formOpenBtn.classList.add('display');


            // window.location.href = "home.html?data=" + encodeURIComponent(enteredUsername);;
        } else {
            alert("Invalid credentials. Please try again.");
        }

        clearForms();
    }

    myLink.onclick = function () {
        // Reset input fields
        let index;
        index = registeredUsers.findIndex(obj => obj.isLoggedIn === true);

        if (index !== -1) {

            registeredUsers[index].isLoggedIn = false;
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            // checkUserLogin();
            drop.classList.add('display');
            formOpenBtn.classList.remove('display');
            userLoggedIn = false;
        }
    }

    function checkUserLogin() {
        const drop = document.querySelector("#drop");

        if (registeredUsers.find(obj => obj.isLoggedIn === true)) {
            userLoggedIn = true;
            let loggedInUser = registeredUsers.find(obj => obj.isLoggedIn === true).userName;
            if (user) {
                user.innerHTML = loggedInUser;
                formOpenBtn.classList.add('display');
            }

        } else {
            if (drop) {
                drop.classList.add('display');
            }
        }
    }

    function signupUser(event) {
        event.preventDefault();

        const signupUserName = document.getElementById("name").value;
        const signupUserEmail = document.getElementById("signupEmail").value;
        const signupPassword = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");

        // Reset error messages
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";

        // Validate name
        if (signupUserName.trim() === "") {
            nameError.textContent = "Please enter your name.";
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupUserEmail)) {
            emailError.textContent = "Please enter a valid email address.";
            return;
        }

        // Validate password length or any other criteria
        if (signupPassword.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters long.";
            return;
        }

        // Validate password confirmation
        if (signupPassword !== confirmPassword) {
            confirmPasswordError.textContent = "Passwords do not match. Please confirm your password.";
            return;
        }
        // Check if the username is already registered
        const usernameExists = registeredUsers.some((user) => user.userEmail === signupUserEmail);

        if (usernameExists) {
            alert("Username already exists. Please choose a different username.");
            return; // Prevent registration if username already exists
        }

        registeredUsers.push({ userEmail: signupUserEmail, userPassword: signupPassword, userName: signupUserName });

        console.log("Updated Registered Users:", registeredUsers);

        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

        alert("Registration successful! You can now log in.");

        formContainer.classList.remove("active");

        clearForms();
    }

    // Set the interval and store the reference
    //     if(!userLoggedIn)
    //     {
    //     intervalId = setInterval(() => {
    //         home.classList.add("show");
    //     }, 2000);
    // }
},{ once: true });

function addProductToCart() {
    document.getElementById('myModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

function openMenuPage() {
    window.location.href = "../menu/menu.html";
}
function openContactPage() {
    window.location.href = "../contact/contact.html";
}

const slider = document.getElementById('slider');
let currentIndex = 0;

function showSlide(index) {
  const slideWidth = document.querySelector('.slide').offsetWidth;
  const newPosition = -index * slideWidth;
  slider.style.transform = `translateX(${newPosition}px)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % document.querySelectorAll('.slide').length;
  showSlide(currentIndex);
}

setInterval(nextSlide, 3000);

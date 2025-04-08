import { includeHTML } from './include.js';

includeHTML("/partials/header.html", "header");
includeHTML("/partials/footer.html", "footer");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  loginBtn.addEventListener("click", () => {
    alert("Login feature coming soon (Firebase Auth or OAuth).");
  });

  signupBtn.addEventListener("click", () => {
    alert("Sign-up feature coming soon.");
  });
});

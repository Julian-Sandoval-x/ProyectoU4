document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.querySelector(".register-form");
  const messageContainer = document.getElementById("messageContainer");
  const welcomeMessage = document.getElementById("welcomeMessage");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm_password")
      .value.trim();

    let hasError = false;
    messageContainer.innerHTML = ""; // Limpiar mensajes anteriores
    welcomeMessage.style.display = "none"; // Ocultar mensaje de bienvenida

    if (username === "") {
      document.getElementById("usernameError").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("usernameError").style.display = "none";
    }

    if (email === "" || !validateEmail(email)) {
      document.getElementById("emailError").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("emailError").style.display = "none";
    }

    if (password === "" || password.length < 8 || !/\d/.test(password)) {
      document.getElementById("passwordError").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("passwordError").style.display = "none";
    }

    if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("confirmPasswordError").style.display = "none";
    }

    if (hasError) {
      messageContainer.innerHTML =
        '<div class="alert alert-danger">Por favor, corrige los errores en el formulario.</div>';
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        messageContainer.innerHTML =
          '<div class="alert alert-success">Usuario registrado con éxito</div>';
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 2000);
      } else {
        const errorData = await response.json();
        messageContainer.innerHTML = `<div class="alert alert-danger">Error: ${errorData.message}</div>`;
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      messageContainer.innerHTML =
        '<div class="alert alert-danger">Error al registrar el usuario. Por favor, inténtelo de nuevo.</div>';
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});

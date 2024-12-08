document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  const messageContainer = document.getElementById("loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      let hasError = false;
      messageContainer.style.display = "none"; // Ocultar mensajes anteriores

      if (email === "" || !validateEmail(email)) {
        document.getElementById("emailError").style.display = "block";
        hasError = true;
      } else {
        document.getElementById("emailError").style.display = "none";
      }

      if (password === "") {
        document.getElementById("passwordError").style.display = "block";
        hasError = true;
      } else {
        document.getElementById("passwordError").style.display = "none";
      }

      if (hasError) {
        messageContainer.style.display = "block";
        messageContainer.innerHTML =
          "Por favor, corrige los errores en el formulario.";
        return;
      }

      const userData = {
        email,
        password,
      };

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          messageContainer.style.display = "none";
          alert("Inicio de sesión exitoso");
          window.location.href = "/menu.html";
        } else {
          const errorData = await response.json();
          messageContainer.style.display = "block";
          messageContainer.innerHTML = `Error: ${errorData.message}`;
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        messageContainer.style.display = "block";
        messageContainer.innerHTML =
          "Error al iniciar sesión. Por favor, inténtelo de nuevo.";
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});

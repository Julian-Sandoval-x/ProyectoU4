if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos elementos del DOM
    const nombre = document.querySelector("input[name='nombre']");
    const email = document.querySelector("input[name='email']");
    const telefono = document.querySelector("input[name='telefono']");
    const fecha = document.querySelector("input[name='fecha']");
    const hora = document.querySelector("input[name='hora']");
    const personas = document.querySelector("input[name='personas']");
    const topForm = document.getElementById("reservacion");
    const boton = document.querySelector(".button");
    const btnDelete = document.querySelector(".delete");

    let errores = [];
    // Si hay errores, los mostramos
    // boton.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   errores = [];

    //   // Verificamos que no existan errores
    //   if (!nombre.value) {
    //     errores.push("El nombre es obligatorio");
    //   }
    //   if (!email.value) {
    //     errores.push("El email es obligatorio");
    //   }
    //   if (!telefono.value) {
    //     errores.push("El telefono es obligatorio");
    //   }
    //   if (!fecha.value) {
    //     errores.push("La fecha es obligatoria");
    //   }
    //   if (!hora.value) {
    //     errores.push("La hora es obligatoria");
    //   }
    //   if (!personas.value) {
    //     errores.push("El numero de personas es obligatorio");
    //   }

    // if (errores.length > 0) {
    //   errores.forEach((error) => {
    //     aviso.classList.add("error");
    //     aviso.innerHTML += `<p>${error}</p> <br>`;
    //   });

    //   window.scrollTo({
    //     top: topForm.offsetTop,
    //     behavior: "smooth",
    //   });
    // } else {
    //   aviso.classList.add("exito");
    //   aviso.innerHTML += "<p>Reserva realizada con exito</p>";
    //   window.scrollTo({
    //     top: topForm.offsetTop,
    //     behavior: "smooth",
    //   });
    // }

    btnDelete.addEventListener("click", (e) => {
      e.preventDefault(); // Evita cualquier acción predeterminada del botón

      // Encuentra el formulario más cercano al botón que fue clicado
      const form = btnDelete.closest("form");

      // Muestra la alerta de confirmación
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar esta reservación.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit(); // Envía el formulario si el usuario confirma
        }
      });
    });
  });
}

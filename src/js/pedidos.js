document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "/index.html";
  });
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Por favor, inicia sesión para ver tus pedidos.");
    window.location.href = "/login.html";
    return;
  }

  fetch("/api/pedidos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos");
      }
      return response.json();
    })
    .then((data) => {
      const pedidosContainer = document.getElementById("pedidosContainer");
      if (data.length === 0) {
        pedidosContainer.innerHTML = "<p>No tienes pedidos.</p>";
      } else {
        data.forEach((pedido) => {
          const pedidoElement = document.createElement("div");
          pedidoElement.classList.add("pedido");
          pedidoElement.innerHTML = `
            <h3>Pedido #${pedido.id}</h3>
            <p>Folio: ${pedido.folio}</p>
            <p>Fecha: ${new Date(pedido.fecha).toLocaleString()}</p>
            <p>Total: $${pedido.total}</p>
            <p>Estado: <span class="estado">${pedido.estado}</span></p>
            ${
              pedido.estado.toLowerCase() === "pendiente"
                ? '<button class="cancelar-btn" data-id="' +
                  pedido.id +
                  '">Cancelar</button>'
                : ""
            }
          `;
          pedidosContainer.appendChild(pedidoElement);
        });

        // Agregar eventos a los botones de cancelar
        const cancelarButtons = document.querySelectorAll(".cancelar-btn");
        cancelarButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const pedidoId = button.getAttribute("data-id");
            cancelarPedido(pedidoId, token);
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al obtener los pedidos. Por favor, inténtelo de nuevo.");
    });
});

// Función para cancelar un pedido
function cancelarPedido(pedidoId, token) {
  fetch(`/api/pedidos/${pedidoId}/cancelar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cancelar el pedido");
      }
      return response.json();
    })
    .then((data) => {
      alert(`El pedido #${pedidoId} ha sido cancelado.`);
      // Recargar la lista de pedidos
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al cancelar el pedido. Por favor, inténtelo de nuevo.");
    });
}

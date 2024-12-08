if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.querySelectorAll(".add-button");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCart = document.getElementById("closeCart");
    const payButton = document.getElementById("payButton");
    const mainContent = document.getElementById("mainContent");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Detalles de los productos
    const products = {
      1: {
        id: 1,
        name: "tartarAtun",
        image: "/menu/tartar-atun.jpg",
        precio: 150,
      },
      2: {
        id: 2,
        name: "ensaladaBrotes",
        image: "/menu/ensaladaBrotes.jpg",
        precio: 125,
      },
      3: {
        id: 3,
        name: "Carpaccio",
        image: "/menu/carpaccio.jpg",
        precio: 200,
      },
      4: { id: 4, name: "vieiras", image: "/menu/vieiras.jpg", precio: 100 },
      5: {
        id: 5,
        name: "esparragos",
        image: "/menu/esparragos.jpg",
        precio: 150,
      },
      6: { id: 6, name: "burrata", image: "/menu/burrata.jpg", precio: 200 },
      7: { id: 7, name: "filete", image: "/menu/res.jpg", precio: 250 },
      8: {
        id: 8,
        name: "rodaballo",
        image: "/menu/rodaballo.jpg",
        precio: 250,
      },
      9: { id: 9, name: "pato", image: "/menu/pato.jpg", precio: 350 },
      10: { id: 10, name: "risotto", image: "/menu/risotto.jpg", precio: 375 },
      11: { id: 11, name: "lubina", image: "/menu/lubina.jpg", precio: 150 },
      12: { id: 12, name: "cordero", image: "/menu/cordero.jpg", precio: 175 },
      13: { id: 13, name: "pulpo", image: "/menu/pulpo.jpg", precio: 125 },
      14: { id: 14, name: "salmon", image: "/menu/salmon.jpg", precio: 140 },
      15: { id: 15, name: "esfera", image: "/menu/esfera.jpg", precio: 150 },
      16: {
        id: 16,
        name: "Panna cotta",
        image: "/menu/panna.jpg",
        precio: 200,
      },
      17: {
        id: 17,
        name: "Tarta de limón",
        image: "/menu/pastel-destructurado.jpg",
        precio: 200,
      },
      18: {
        id: 18,
        name: "Helado de albahaca",
        image: "/menu/helado.jpg",
        precio: 250,
      },
      19: {
        id: 19,
        name: "textura",
        image: "/menu/textura-chocolate.jpg",
        precio: 175,
      },
      20: { id: 20, name: "crema", image: "/menu/mascarpone.jpg", precio: 100 },
      // Agrega más productos según sea necesario
    };

    // Verificamos que el usuario esté autenticado
    function isUserLoggedIn() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return false;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (e) {
        return false;
      }
    }

    btnAdd.forEach((button) => {
      button.addEventListener("click", () => {
        if (!isUserLoggedIn()) {
          alert("Por favor, inicia sesión para agregar artículos al carrito.");
          return;
        }

        const itemId = parseInt(button.getAttribute("data-id"), 10);
        addItemToCart(itemId);
        showCart();
      });
    });

    function addItemToCart(itemId) {
      const itemIndex = cart.findIndex((item) => item.id === itemId);

      if (itemIndex === -1) {
        cart.push({ id: itemId, quantity: 1 });
      } else {
        cart[itemIndex].quantity += 1;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    function removeItemFromCart(itemId) {
      cart = cart.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    function updateItemQuantity(itemId, quantity) {
      const itemIndex = cart.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        cart[itemIndex].quantity += quantity;

        if (cart[itemIndex].quantity <= 0) {
          removeItemFromCart(itemId);
        } else {
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      }
    }

    function renderCart() {
      cartItems.innerHTML = "";
      let total = 0;

      cart.forEach((item) => {
        const product = products[item.id];
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
          <span>${product.name}</span>
          <span>Cantidad: ${item.quantity}</span>
          <button class="increase-quantity" data-id="${item.id}">+</button>
        <button class="decrease-quantity" data-id="${item.id}">-</button>
        `;
        cartItems.appendChild(cartItem);
        total += product.precio * item.quantity; // Aquí puedes sumar el precio si tienes esa información
      });

      cartTotal.textContent = `Total: $${total}`;
      // Agregar manejadores de eventos para los botones de aumentar y disminuir cantidad
      document.querySelectorAll(".increase-quantity").forEach((button) => {
        button.addEventListener("click", () => {
          const itemId = parseInt(button.getAttribute("data-id"), 10);
          updateItemQuantity(itemId, 1);
        });
      });

      document.querySelectorAll(".decrease-quantity").forEach((button) => {
        button.addEventListener("click", () => {
          const itemId = parseInt(button.getAttribute("data-id"), 10);
          updateItemQuantity(itemId, -1);
        });
      });
    }

    function showCart() {
      cartSidebar.classList.add("open");
      mainContent.classList.add("shifted");
    }

    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("open");
      mainContent.classList.remove("shifted");
    });

    payButton.addEventListener("click", async () => {
      if (!isUserLoggedIn()) {
        alert("Por favor, inicia sesión para proceder con el pago.");
        return;
      }
      const total = cart.reduce(
        (sum, item) => sum + products[item.id].precio * item.quantity,
        0
      );

      try {
        const response = await fetch("/api/pedidos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ cart, total }),
        });

        if (response.ok) {
          Swal.fire({
            title: "Pago Procesado",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
          cartSidebar.classList.remove("open");
          mainContent.classList.remove("shifted");
        } else {
          Swal.fire({
            title: "Error al procesar el pago",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      } catch (error) {
        console.error("Error al procesar el pago:", error);
        Swal.fire({
          title: "Error al procesar el pago",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    });

    renderCart();
  });
}

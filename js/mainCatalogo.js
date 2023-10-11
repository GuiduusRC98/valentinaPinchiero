class Producto {
    constructor(id, nombre, precio, descripcion, img, alt, descuento, rebaja, imagenes) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.img = img;
        this.alt = alt;
        this.descuento = descuento;
        this.rebaja = rebaja;
        this.imagenes = imagenes || [];
    }
  
    descripcion_Producto() {
        let rebajaHTML = '';
        if (this.rebaja) {
            rebajaHTML = `<span>    $${this.rebaja}</span>`;
        }
        return `
        <div class="box">
            <div class="image">
                <div id="imageGallery${this.id}" class="carousel">
                    <img onclick="openModal(${this.id})" src="${this.img}" alt="${this.alt}" />
                </div>
                <div class="icons">
                    <a href="https://ig.me/m/vp_oficial_" target="_blank" class="">Comprar</a>
                </div>
            </div>
            <div class="content">
                <h3>${this.nombre}</h3>
                <p>${this.descripcion}</p>
                <div class="price">$${this.precio}${rebajaHTML}</div>
            </div>
        </div>`;
    }
  }
  
  class ControladorDeProductos {
    constructor() {
        this.listaDeProducto = [];
    }
  
    agregar(producto) {
        this.listaDeProducto.push(producto);
    }
  
    updateProduct() {
        const imagenesProducto1 = [
            "./images/rinonera/rinonera_isa_allblack_1.jpeg",
            "./images/rinonera/rinonera_isa_allblack_2.jpeg",
        ];
  
        const imagenesProducto2 = [
            "./images/rinonera/rinonera_isa_militar_1.jpeg",
            "./images/rinonera/rinonera_isa_militar_2.jpeg",
            // Agrega más rutas de imágenes para el producto 2
        ];
        const imagenesProducto3 = [
          "./images/bandolera/bandolera_isa_corazon_1.jpeg",
          "./images/bandolera/bandolera_isa_corazon_2.jpeg",
          // Agrega más rutas de imágenes para el producto 2
      ];
  
        this.agregar(new Producto(
          32,
          "MAXI RIÑONERA NEGRA CROCO TOTAL BLACK - CÁPSULA ISA",
          8400,
          "Bolsillo externo, Correa Regulable, alto18 cm,Ancho 27 cm",
          "./images/rinonera/rinonera_isa_allblack_1.jpeg",
          "riñonera de alta calidad",
          null,
          null,
          imagenesProducto1 // Agregar la lista de imágenes aquí
      ));
        this.agregar(new Producto(
            33,
            "MAXI RIÑONERA NEGRA CROCO MILITAR - CÁPSULA ISA",
            8400,
            "Bolsillo externo, Correa Regulable, alto18 cm,Ancho 27 cm",
            "./images/rinonera/rinonera_isa_militar_1.jpeg",
            "riñonera de alta calidad",
            null,
            null,
            imagenesProducto2 // Agregar la lista de imágenes aquí
        ));
        this.agregar(new Producto(
          34,
          "BANDOLERA NEGRA CROCO CORAZÓN - CÁPSULA ISA",
          9000,
          "Cuerina sintética CROCO, Cierres reforzados, Correa Regulable",
          "./images/bandolera/bandolera_isa_corazon_1.jpeg",
          "bandolera de alta calidad",
          null,
          null,
          imagenesProducto3 // Agregar la lista de imágenes aquí
      ));
    }
  
    mostrarNovedad() {
        let contenedor_productos = document.getElementById("contenedor_productos");
        this.listaDeProducto.forEach(producto => {
            contenedor_productos.innerHTML += producto.descripcion_Producto();
        });
    }
  }
  
  function openModal(productId) {
    const modal = document.getElementById("myModal");
    modal.classList.add("fadeIn");
    const modalImage = document.getElementById("modalImage");
    const thumbnailList = document.getElementById("thumbnailList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
  
    // Encuentra el producto correspondiente en tu lista de productos
    const product = cp.listaDeProducto.find((p) => p.id === productId);
  
    if (!product) {
        return; // Si no se encuentra el producto, no hagas nada
    }
  
    let currentImageIndex = 0;
  
    function showCurrentImage() {
        modalImage.src = product.imagenes[currentImageIndex];
    }
  
    function updateThumbnailOpacity(selectedIndex) {
        const thumbnails = thumbnailList.querySelectorAll("img");
        thumbnails.forEach((thumbnail, index) => {
            if (index === selectedIndex) {
                thumbnail.classList.add("selected");
            } else {
                thumbnail.classList.remove("selected");
            }
        });
    }
  
    function showThumbnails() {
        thumbnailList.innerHTML = "";
        product.imagenes.forEach((imagen, index) => {
            const thumbnail = document.createElement("li");
            thumbnail.innerHTML = `<img src="${imagen}" alt="" data-index="${index}" />`;
            thumbnail.addEventListener("click", (event) => {
                currentImageIndex = parseInt(event.target.getAttribute("data-index"));
                showCurrentImage();
                updateThumbnailOpacity(currentImageIndex);
            });
            thumbnailList.appendChild(thumbnail);
        });
  
        // Establece la opacidad inicial
        updateThumbnailOpacity(currentImageIndex);
    }
  
    showCurrentImage();
    modal.style.display = "block";
  
    const closeBtn = document.querySelector(".close");
    closeBtn.addEventListener("click", closeModal);
  
    prevBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + product.imagenes.length) % product.imagenes.length;
        showCurrentImage();
        updateThumbnailOpacity(currentImageIndex);
    });
  
    nextBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % product.imagenes.length;
        showCurrentImage();
        updateThumbnailOpacity(currentImageIndex);
    });
  
    showThumbnails();
  }
  
  function closeModal() {
    const modal = document.getElementById("myModal");
    modal.classList.add("fadeOut");
    modal.style.display = "none";
  
    setTimeout(() => {
      modal.classList.remove("fadeIn", "fadeOut"); // Eliminar las clases de animación después de la transición
      modal.style.display = "none";
  }, 300);
  }
  
  const cp = new ControladorDeProductos();
  cp.updateProduct();
  cp.mostrarNovedad();
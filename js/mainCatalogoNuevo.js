class Producto {
    constructor(id, nombre, precio, descripcion, img, alt, descuento, rebaja, imagenes, categoria, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.img = img;
        this.alt = alt;
        this.descuento = descuento;
        this.rebaja = rebaja;
        this.imagenes = imagenes || [];
        this.categoria = categoria;
        this.fechaCreacion = fechaCreacion; // Añadir propiedad fechaCreacion
    }

    descripcion_Producto() {
        let rebajaHTML = '';
        if (this.rebaja) {
            rebajaHTML = `<span>    $${this.rebaja}</span>`;
        }
        return `
        <div class="box" data-categoria="${this.categoria}">
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

    async cargarProductosDesdeJSON() {
        try {
            const resp = await fetch('../productosValu.json'); // Ruta relativa al archivo HTML
            if (!resp.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            const data = await resp.json();

            if (data && data.productos && Array.isArray(data.productos)) {
                this.listaDeProducto = data.productos.map(item => {
                    return new Producto(
                        item.id,
                        item.nombre,
                        item.precio,
                        item.descripcion,
                        item.imagen,
                        item.descripcion,
                        0, // Por defecto, no hay descuento
                        0, // Por defecto, no hay rebaja
                        item.imagenes,
                        item.categoria,
                        new Date() // Asignar una fecha de creación
                    );
                });
                console.log(this.listaDeProducto);
            } else {
                throw new Error('El archivo JSON no tiene la estructura esperada.');
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    mostrarCatalogo() {
        let contenedor_productos = document.getElementById("contenedor_productos");
        this.listaDeProducto.forEach(producto => {
            const productoHTML = document.createElement("div");
            productoHTML.innerHTML = producto.descripcion_Producto();
            contenedor_productos.appendChild(productoHTML);
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
            thumbnail.innerHTML = `<img src="${imagen}" alt="${product.alt}" data-index="${index}" />`;
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

    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("fadeIn", "fadeOut"); // Eliminar las clases de animación después de la transición
    }, 300);
}

const cp = new ControladorDeProductos();
cp.cargarProductosDesdeJSON().then(() => {
    cp.listaDeProducto.sort((a, b) => b.fechaCreacion - a.fechaCreacion);
    cp.mostrarCatalogo();
});

// Función para mostrar todos los productos
function mostrarTodosLosProductos() {
    const productos = document.querySelectorAll('.box');
    productos.forEach(producto => {
        producto.style.display = 'block';
    });
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    const productos = document.querySelectorAll('.box');
    const productosFiltrados = [];

    productos.forEach(producto => {
        const categoriasProducto = producto.getAttribute('data-categoria');
        if (categoriasProducto && (categoria === 'todos' || categoriasProducto.includes(categoria))) {
            productosFiltrados.push(producto);
        }
    });

    const contenedor_productos = document.getElementById("contenedor_productos");
    productosFiltrados.forEach(producto => {
        contenedor_productos.prepend(producto);
    });

    productos.forEach(producto => {
        if (!productosFiltrados.includes(producto)) {
            producto.style.display = 'none';
        } else {
            producto.style.display = 'block';
        }
    });
}

// Agregar clic a los botones de filtro
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const categoria = button.getAttribute('data-filter');
        filtrarPorCategoria(categoria);
    });
});
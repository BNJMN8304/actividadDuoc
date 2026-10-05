// ================================================================
// efectos.html · Semana 8: AOS, Fancybox y Owl Carousel
// Solo se muestra si el usuario completó el formulario de index.html
// ================================================================

// ================================================================
// 1. DATOS: arrays con las imágenes de la galería y del carrusel
// ================================================================
const imagenesGaleria = [
  { url: "https://fastly.picsum.photos/id/860/200/300.jpg?hmac=IABW-3mXBCuVP5aHuuuC7WpE3w1TpQZS9PZYr4mf7Gk", alt: "Fotografía 1 de la galería" },
  { url: "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU", alt: "Notebook sobre un escritorio" },
  { url: "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68", alt: "Bosque junto a un lago" },
  { url: "https://fastly.picsum.photos/id/19/2500/1667.jpg?hmac=7epGozH4QjToGaBf_xb2HbFTXoV5o8n_cYzB7I4lt6g", alt: "Sendero de madera en el bosque" }
];
 
const imagenesCarrusel = [
  "https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I",
  "https://fastly.picsum.photos/id/21/3008/2008.jpg?hmac=T8DSVNvP-QldCew7WD4jj_S3mWwxZPqdF0CNPksSko4",
  "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0",
  "https://fastly.picsum.photos/id/23/3887/4899.jpg?hmac=2fo1Y0AgEkeL2juaEBqKPbnEKm_5Mp0M2nuaVERE6eE"
];

// ================================================================
// 2. FUNCIONES REUTILIZABLES
// ================================================================

// Devuelve el nombre del usuario registrado, o null si no se registró
function obtenerUsuario() {
  let nombre = null;
  try {
    nombre = sessionStorage.getItem("usuarioRegistrado");
  } catch (error) {
    nombre = null;
  }
  // Respaldo: nombre enviado por la URL (efectos.html?usuario=...)
  if (!nombre) {
    const parametros = new URLSearchParams(window.location.search);
    nombre = parametros.get("usuario");
  }
  return nombre;
}

// Crea un elemento <img> (se usa en la galería y en el carrusel)
function crearImagen(url, alt) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = alt;
  img.loading = "lazy";
  return img;
}
 
// Recorre el array y construye la galería en el div #galeria
function construirGaleria(contenedor, imagenes) {
  imagenes.forEach(function (imagen, indice) {
    const enlace = document.createElement("a");
    enlace.href = imagen.url;
    enlace.setAttribute("data-fancybox", "galeria");        // agrupa las fotos en una sola galería
    enlace.setAttribute("data-caption", "Foto " + (indice + 1) + " de " + imagenes.length);
    enlace.setAttribute("aria-label", "Ampliar " + imagen.alt);
    enlace.appendChild(crearImagen(imagen.url, imagen.alt));
    contenedor.appendChild(enlace);
  });
}
 
// Recorre el array y construye los ítems del carrusel en #carrusel
function construirCarrusel(contenedor, imagenes) {
  for (let i = 0; i < imagenes.length; i++) {
    const item = document.createElement("div");
    item.className = "item";
    item.appendChild(crearImagen(imagenes[i], "Imagen " + (i + 1) + " del carrusel"));
    contenedor.appendChild(item);
  }
}

// Muestra el contenido o el aviso de bloqueo según si hay usuario
function mostrarSegunRegistro(nombre) {
  const bloqueo = document.getElementById("bloqueo");
  const contenido = document.getElementById("contenido-efectos");
  if (nombre) {
    bloqueo.hidden = true;
    contenido.hidden = false;
    document.getElementById("saludo").textContent = "¡Hola, " + nombre + "! Baja para ver cada efecto.";
    return true;
  } else {
    bloqueo.hidden = false;
    contenido.hidden = true;
    return false;
  }
}

// ================================================================
// 3. INICIO: cuando el DOM está listo
// ================================================================
$(document).ready(function () {

  const usuario = obtenerUsuario();
  const registrado = mostrarSegunRegistro(usuario);

  // Si no se registró, no se cargan los plugins
  if (!registrado) {
    return;
  }

  // ---------- Ejercicio 2: AOS ----------
  AOS.init({ duration: 900, offset: 120, once: false });   // once:false = se repite cada vez que el div entra en pantalla
 
  // ---------- Ejercicio 3: Fancybox ----------
  construirGaleria(document.getElementById("galeria"), imagenesGaleria);
  Fancybox.bind('[data-fancybox="galeria"]', {});
 
  // ---------- Ejercicio 4: Owl Carousel ----------
  construirCarrusel(document.getElementById("carrusel"), imagenesCarrusel);
  $("#carrusel").owlCarousel({
    loop: true,
    margin: 16,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0:   { items: 1 },   // celular: 1 imagen
      700: { items: 2 },   // tablet: 2 imágenes
      1000:{ items: 3 }    // escritorio: 3 imágenes
    }
  });
});

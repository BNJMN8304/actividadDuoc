// ====== SWITCH: color encabezados ====== //
 
const switchColor = document.getElementById("switch-color");
switchColor.addEventListener('change', cambiarColor);
 
function cambiarColor(evento) {
    const activo = evento.target.checked;
    const encabezados = document.querySelectorAll('h1, h2, h3');
    encabezados.forEach(function(encabezado){
        encabezado.style.color = activo ? 'var(--rojo)' : '';
    });
}
 
// ====== SWITCH: fuente encabezados ====== //
const switchFuente = document.getElementById("switch-fuente");
switchFuente.addEventListener('change', cambiarFuente);
 
function cambiarFuente(evento) {
    const activo = evento.target.checked;
    const encabezados = document.querySelectorAll('h1, h2, h3');
    encabezados.forEach(function(encabezado) {
        encabezado.style.fontFamily = activo ? 'var(--fuente-alterna)' : '';
    });
}
 
// ====== SWITCH: texto de los h2 ====== //
const switchTexto = document.getElementById("switch-texto");
const elementoNew = document.getElementById('new');
const textoOriginal = elementoNew.textContent;
const texxtoModificado = 'Texto modificado con JavaScript';
 
switchTexto.addEventListener('change', cambiarTexto);
 
function cambiarTexto(evento) {
    const activo = evento.target.checked;
    elementoNew.textContent = activo ? texxtoModificado : textoOriginal;
}
 
// ====== SWITCH: ruta de la imagen del header ====== //
const switchRuta = document.getElementById("switch-ruta");
const primeraImagen = document.querySelector('img');
const urlImagen = 'https://fastly.picsum.photos/id/860/200/300.jpg?hmac=IABW-3mXBCuVP5aHuuuC7WpE3w1TpQZS9PZYr4mf7Gk';
switchRuta.addEventListener('change', cambiarRuta);
 
function cambiarRuta(evento) {
    const activo = evento.target.checked;
    primeraImagen.src = activo ? urlImagen : '';
}


$(function () {
 
    // ====== FUNCION: destacarPares ====== //

    function destacarPares() {
        $('h1, h2, h3').each(function (indice) {
            const posicion = indice + 1;
            if (posicion % 2 === 0) {
                $(this).css('color', 'blue');
            }
        });
    }
 
    // ====== FUNCION: destacarImpares ====== //

    function destacarImpares() {
        $('h1, h2, h3').each(function (indice) {
            const posicion = indice + 1;
            if (posicion % 2 !== 0) {
                $(this).css('font-family', 'Roboto');
            }
        });
    }
 
    // ====== FUNCION: agrandarDestacado ====== //

    function agrandarDestacado() {
        const $parrafoDestacado = $('.destacado');
        const tamanoActual = parseFloat($parrafoDestacado.css('font-size'));
        $parrafoDestacado.css('font-size', (tamanoActual + 10) + 'px');
    }
 
    // ====== FUNCION: agregarLista ====== //

    const palabras = ['Etapas', 'Carga', 'Escarbadientes', 'Tanque', 'Paraguas', 'Bolsos', 'Orbitar', 'Adivino', 'Sonrojarse', 'Mesa'];
 
    function agregarLista() {
        const $listaOrdenada = $('#lista-ordenada');
 
        // Se limpia la lista antes de volver a llenarla, para evitar
        // duplicar elementos si el boton se presiona mas de una vez.
        $listaOrdenada.empty();
 
        const comentario = document.createComment(' Lista generada dinamicamente con jQuery ');
        $listaOrdenada.append(comentario);
 
        $.each(palabras, function (indice, palabra) {
            const $nuevoItem = $('<li></li>')
                .addClass('item-lista')
                .attr('id', 'item-ordenado-' + (indice + 1))
                .text(palabra);
 
            $listaOrdenada.append($nuevoItem);
        });
    }
 
    // Conexion de los botones con sus respectivas funciones
    $('#btn-destacar-pares').on('click', destacarPares);
    $('#btn-destacar-impares').on('click', destacarImpares);
    $('#btn-agrandar-destacado').on('click', agrandarDestacado);
    $('#btn-agregar-lista').on('click', agregarLista);
 
});


// ================================================================
// ====== NUEVO S8: Formulario de registro (jQuery Validation) ======
// ================================================================

// ---------- Funciones del RUT ----------

// Limpia un RUT: deja solo números y la K (en mayúscula)
function limpiarRut(rut) {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}
 
// Calcula el dígito verificador con el algoritmo módulo 11
function calcularDv(cuerpo) {
  let suma = 0;
  let multiplicador = 2;
  // Recorre el cuerpo del RUT de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}
 
// Devuelve true si el RUT es válido
function rutEsValido(rut) {
  const limpio = limpiarRut(rut);
  if (limpio.length < 2) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^[0-9]+$/.test(cuerpo)) return false;
  return calcularDv(cuerpo) === dv;
}
 
// Da formato al RUT mientras se escribe: 12345678-5 → 12.345.678-5
function formatearRut(rut) {
  const limpio = limpiarRut(rut);
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let conPuntos = "";
  let contador = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    conPuntos = cuerpo[i] + conPuntos;
    contador++;
    if (contador % 3 === 0 && i > 0) conPuntos = "." + conPuntos;
  }
  return conPuntos + "-" + dv;
}

// Guarda el nombre en sessionStorage para que efectos.html sepa que el usuario se registró
function guardarUsuario(nombre) {
  try {
    sessionStorage.setItem("usuarioRegistrado", nombre);
  } catch (error) {
    // Si el navegador bloquea el almacenamiento, se pasa el nombre por la URL
    window.location.href = "efectos.html?usuario=" + encodeURIComponent(nombre);
  }
}

// ---------- Inicio ----------
$(document).ready(function () {

  // ---------- Ejercicio 1: jQuery Validation ----------
 
  // Regla nueva "rutValido" que usa mi función rutEsValido
  $.validator.addMethod("rutValido", function (valor, elemento) {
    return this.optional(elemento) || rutEsValido(valor);
  });
 
  // Formatea el RUT mientras el usuario escribe
  $("#rut").on("input", function () {
    $(this).val(formatearRut($(this).val()));
  });
 
  $("#formRegistro").validate({
    rules: {
      nombres:     { required: true },
      apellidos:   { required: true },
      correo:      { required: true, email: true },
      rut:         { required: true, rutValido: true },
      condiciones: { required: true }
    },
    messages: {
      nombres:     { required: "Debes ingresar tu nombre." },
      apellidos:   { required: "Debes ingresar tus apellidos." },
      correo: {
        required: "Debes ingresar tu correo electrónico.",
        email:    "El correo no es válido. Por favor ingresa uno correcto."
      },
      rut: {
        required:  "Debes ingresar tu rut.",
        rutValido: "El rut es incorrecto. Revisa e inténtalo de nuevo."
      },
      condiciones: { required: "Debes aceptar las condiciones del servicio." }
    },
    validClass: "valido",
    // En el checkbox, el mensaje va debajo y no pegado al cuadrito
    errorPlacement: function (error, elemento) {
      if (elemento.attr("type") === "checkbox") {
        error.insertAfter(elemento.closest(".check"));
      } else {
        error.insertAfter(elemento);
      }
    },
    // Si todo está bien guarda el nombre y lleva a la página de efectos
    submitHandler: function (formulario) {
      const nombre = $("#nombres").val().trim();
      guardarUsuario(nombre);
      $("#mensajeExito").text("¡Listo, " + nombre + "! Te llevamos a los efectos...").fadeIn(300);
      setTimeout(function () {
        window.location.href = "efectos.html";
      }, 1200);
    }
  });
});

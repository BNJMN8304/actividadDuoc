// ====== SWITCH: color encabezados ====== //
// (se mantiene igual, en JavaScript nativo: no forma parte de las
// funciones que pide traducir esta actividad)
 
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

// ====== EXP 3 - S7: Traducción a jQuery ====== //

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
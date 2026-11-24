/* =========================================================
   Aletier Bemin — configurador.js
   Pasos 1 y 2 del Configurador Bemin (el paso 3 es agendar.html)
   ========================================================= */
(() => {
  // TODO: catálogo y precios de EJEMPLO; reemplazar por los reales del taller
  const CATALOGO = {
    colores: [
      { id: 'blanco', nombre: 'Blanco perla', color: '#F2EFE8' },
      { id: 'negro', nombre: 'Negro', color: '#1B1B1D' },
      { id: 'gris', nombre: 'Gris', color: '#7A8087' },
      { id: 'rojo', nombre: 'Rojo', color: '#C62828' },
      { id: 'azul', nombre: 'Azul', color: '#1565C0' },
      { id: 'verde', nombre: 'Verde', color: '#1F5C3A' },
      { id: 'amarillo', nombre: 'Amarillo', color: '#F4C430' },
      { id: 'naranja', nombre: 'Naranja', color: '#C8692A' }
    ].map((c) => ({ ...c, precio: 1500000, servicio: 'Pintura' })),
    vinilos: [
      { id: 'v-mate', nombre: 'Mate', precio: 600000 },
      { id: 'v-brillo', nombre: 'Brillante', precio: 650000 },
      { id: 'v-carbono', nombre: 'Carbono', precio: 450000 },
      { id: 'v-cromo', nombre: 'Cromo', precio: 900000 }
    ],
    graficos: [
      { id: 'g-franjas', nombre: 'Franjas', precio: 180000 },
      { id: 'g-llamas', nombre: 'Llamas', precio: 250000 },
      { id: 'g-lateral', nombre: 'Logo lateral', precio: 120000 },
      { id: 'g-racing', nombre: 'Racing', precio: 220000 }
    ],
    bodykits: [
      { id: 'b-frontal', nombre: 'Frontal', precio: 380000 },
      { id: 'b-lateral', nombre: 'Faldones', precio: 320000 },
      { id: 'b-trasero', nombre: 'Trasero', precio: 350000 },
      { id: 'b-completo', nombre: 'Kit completo', precio: 950000 }
    ]
  };
  const ETIQUETAS = { colores: 'Color', vinilos: 'Vinilo', graficos: 'Gráfico', bodykits: 'Body kit' };

  const $ = (id) => document.getElementById(id);
  const pesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  const estado = { categoria: 'colores', seleccion: {}, urlFoto: null, imagen: null };

  // ---------- Paso 1: foto ----------
  $('foto').addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const aviso = $('foto-aviso');
    if (!archivo.type.startsWith('image/') || archivo.size > 10 * 1024 * 1024) {
      aviso.textContent = 'Sube una imagen (JPG, PNG o WebP) de hasta 10 MB.';
      return;
    }
    if (estado.urlFoto) URL.revokeObjectURL(estado.urlFoto);
    estado.urlFoto = URL.createObjectURL(archivo);
    estado.imagen = new Image();
    estado.imagen.src = estado.urlFoto;
    $('foto-preview').src = estado.urlFoto;
    $('foto-preview').hidden = false;
    $('foto-icono').hidden = true;
    $('foto-texto').textContent = 'Cambiar foto';
    aviso.textContent = 'Foto cargada.';
    actualizarBoton();
  });

  // ---------- Paso 1: catálogo por pestañas ----------
  function pintarCatalogo() {
    const cont = $('catalogo');
    cont.setAttribute('aria-labelledby', 'tab-' + estado.categoria);
    cont.replaceChildren();
    CATALOGO[estado.categoria].forEach((item) => {
      const activo = estado.seleccion[estado.categoria] === item.id;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ab-tile' + (item.color ? ' ab-tile--color' : '');
      b.setAttribute('aria-pressed', activo);
      if (item.color) b.style.setProperty('--tile-color', item.color);
      b.innerHTML = item.color
        ? `<span class="visually-hidden">${item.nombre}</span><i class="bi ${activo ? 'bi-check-lg' : 'bi-plus-lg'}" aria-hidden="true"></i>`
        : `<i class="bi ${activo ? 'bi-check-lg' : 'bi-plus-lg'}" aria-hidden="true"></i><span>${item.nombre}</span><small>${pesos.format(item.precio)}</small>`;
      b.addEventListener('click', () => {
        estado.seleccion[estado.categoria] = activo ? null : item.id;
        pintarCatalogo();
        actualizarBoton();
      });
      cont.appendChild(b);
    });
  }

  function activarCategoria(cat) {
    estado.categoria = cat;
    document.querySelectorAll('.ab-tab').forEach((t) => {
      const sel = t.dataset.cat === cat;
      t.setAttribute('aria-selected', sel);
      t.tabIndex = sel ? 0 : -1;
    });
    pintarCatalogo();
  }

  document.querySelectorAll('.ab-tab').forEach((tab) => {
    tab.addEventListener('click', () => activarCategoria(tab.dataset.cat));
  });

  function elegidos() {
    return Object.entries(estado.seleccion)
      .filter(([, id]) => id)
      .map(([cat, id]) => ({ cat, ...CATALOGO[cat].find((i) => i.id === id) }));
  }

  function actualizarBoton() {
    const listo = Boolean(estado.imagen) && elegidos().length > 0;
    $('btn-ver').disabled = !listo;
    $('ver-ayuda').hidden = listo;
  }

  // ---------- Cambio de paso ----------
  function irAPaso(n) {
    $('paso-1').hidden = n !== 1;
    $('paso-2').hidden = n !== 2;
    $('paso-texto').textContent = `Paso ${n} de 3`;
    const pct = Math.round((n / 3) * 100);
    $('paso-barra').style.width = pct + '%';
    $('paso-barra').parentElement.setAttribute('aria-valuenow', pct);
    const titulo = $(n === 1 ? 'titulo-foto' : 'titulo-resultado');
    titulo.scrollIntoView({ block: 'start' });
    titulo.focus({ preventScroll: true });
  }

  // ---------- Paso 2: simulación, comparador y cotización ----------
  function dibujarDespues() {
    const img = estado.imagen;
    const ancho = Math.min(img.naturalWidth, 1200);
    const alto = Math.round(ancho * (img.naturalHeight / img.naturalWidth));
    const canvas = $('img-despues');
    canvas.width = ancho;
    canvas.height = alto;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, ancho, alto);
    const color = elegidos().find((e) => e.cat === 'colores');
    if (color) {
      // Aproximación: el modo "color" tiñe toda la foto, no solo la pintura
      ctx.globalCompositeOperation = 'color';
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = color.color;
      ctx.fillRect(0, 0, ancho, alto);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    $('comparador').style.setProperty('--ab-ratio', `${ancho} / ${alto}`);
    $('img-antes').src = estado.urlFoto;
  }

  function pintarCotizacion() {
    const filas = $('cotiza-filas');
    filas.replaceChildren();
    const lista = elegidos();
    lista.forEach((e) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${ETIQUETAS[e.cat]}: ${e.nombre}</td><td>${pesos.format(e.precio)}</td>`;
      filas.appendChild(tr);
    });
    $('cotiza-total').textContent = pesos.format(lista.reduce((s, e) => s + e.precio, 0));
  }

  $('btn-ver').addEventListener('click', () => {
    dibujarDespues();
    pintarCotizacion();
    $('comp-rango').value = 50;
    $('comparador').style.setProperty('--ab-corte', '50%');
    irAPaso(2);
  });
  $('btn-cambiar').addEventListener('click', () => irAPaso(1));
  $('comp-rango').addEventListener('input', (e) => {
    $('comparador').style.setProperty('--ab-corte', e.target.value + '%');
  });

  // ---------- Guardar, compartir y agendar ----------
  function resumen() {
    const lista = elegidos();
    return {
      items: lista.map((e) => ({ categoria: ETIQUETAS[e.cat], nombre: e.nombre, precio: e.precio })),
      total: lista.reduce((s, e) => s + e.precio, 0)
    };
  }

  $('btn-guardar').addEventListener('click', () => {
    try {
      localStorage.setItem('ab-diseno', JSON.stringify({ ...resumen(), fecha: new Date().toISOString() }));
      $('aviso-accion').textContent = 'Diseño guardado en este dispositivo.';
    } catch {
      $('aviso-accion').textContent = 'No se pudo guardar el diseño en este navegador.';
    }
  });

  $('btn-compartir').addEventListener('click', async () => {
    const r = resumen();
    const texto = `Mi diseño en Aletier Bemin: ${r.items.map((i) => i.nombre).join(', ')}. Total estimado ${pesos.format(r.total)}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mi diseño en Aletier Bemin', text: texto, url: location.href });
      } else {
        await navigator.clipboard.writeText(`${texto} ${location.href}`);
        $('aviso-accion').textContent = 'Resumen copiado, ya puedes pegarlo donde quieras.';
      }
    } catch {
      /* la persona canceló el menú de compartir */
    }
  });

  // El paso 3 (agendar.html) lee la reserva desde sessionStorage
  $('btn-agendar').addEventListener('click', () => {
    try { sessionStorage.setItem('ab-reserva', JSON.stringify(resumen())); } catch { /* sigue igual */ }
  });

  const cat = new URLSearchParams(location.search).get('cat');
  if (cat && Object.hasOwn(CATALOGO, cat)) {
    activarCategoria(cat);
    document.querySelector(`.ab-tab[data-cat="${cat}"]`).scrollIntoView({ block: 'center' });
  } else {
    pintarCatalogo();
  }
  actualizarBoton();
})();
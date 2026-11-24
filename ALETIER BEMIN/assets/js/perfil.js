/* =========================================================
   Aletier Bemin — perfil.js
   Mi cuenta: chips, fotos con placeholder y diseños guardados
   ========================================================= */
(() => {
  const $ = (id) => document.getElementById(id);
  const pesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Chips (pestañas) ----------
  const tabs = [...document.querySelectorAll('[role="tab"]')];

  function activar(tab, enfocar) {
    tabs.forEach((t) => {
      const sel = t === tab;
      t.setAttribute('aria-selected', sel);
      t.tabIndex = sel ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !sel;
    });
    if (enfocar) tab.focus();
    tab.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const paso = e.key === 'ArrowRight' ? 1 : -1;
      activar(tabs[(i + paso + tabs.length) % tabs.length], true);
    });
  });

  // ---------- Fotos: si el archivo no existe, queda el placeholder ----------
  document.querySelectorAll('.ab-foto img').forEach((img) => {
    const ocultar = () => { img.hidden = true; };
    img.addEventListener('error', ocultar);
    if (img.complete && img.naturalWidth === 0) ocultar();
  });

  // ---------- Diseños guardados (los deja el configurador) ----------
  function pintarDisenos() {
    const cont = $('disenos-lista');
    cont.replaceChildren();
    let d = null;
    try { d = JSON.parse(localStorage.getItem('ab-diseno')); } catch { /* sin diseño */ }

    const hay = d && Array.isArray(d.items) && d.items.length > 0;
    $('disenos-vacio').hidden = hay;
    if (!hay) return;

    const fecha = d.fecha
      ? new Date(d.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const art = document.createElement('article');
    art.className = 'ab-glass';
    art.innerHTML = `
      <h3 class="h6">Guardado el ${esc(fecha)}</h3>
      <ul class="ab-lista">
        ${d.items.map((i) => `<li><span>${esc(i.categoria)}: ${esc(i.nombre)}</span><span>${pesos.format(Number(i.precio) || 0)}</span></li>`).join('')}
      </ul>
      <p class="fw-semibold">Total estimado: ${pesos.format(Number(d.total) || 0)}</p>
      <div class="d-flex flex-wrap gap-2">
        <a class="btn btn-ab" href="configuradorBemin.html">Abrir configurador</a>
        <button class="btn btn-ab btn-ab-vidrio" type="button" id="btn-borrar">Eliminar</button>
      </div>`;
    cont.appendChild(art);

    $('btn-borrar').addEventListener('click', () => {
      try { localStorage.removeItem('ab-diseno'); } catch { /* sigue igual */ }
      pintarDisenos();
      $('disenos-aviso').textContent = 'Diseño eliminado.';
    });
  }

  // ---------- Nombre del usuario registrado (si no hay, queda el de ejemplo) ----------
  try {
    const usuario = JSON.parse(localStorage.getItem('ab-usuario'));
    if (usuario && usuario.nombre && usuario.correo === sessionStorage.getItem('ab-sesion')) {
      $('perfil-nombre').textContent = usuario.nombre;
    }
  } catch { /* sin usuario registrado */ }

  // ---------- Cerrar sesión: borra la sesión y sigue al login ----------
  $('btn-cerrar').addEventListener('click', () => {
    try { sessionStorage.removeItem('ab-sesion'); } catch { /* sigue igual */ }
  });

  pintarDisenos();
})();
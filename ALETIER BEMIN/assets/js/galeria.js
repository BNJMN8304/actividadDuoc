/* =========================================================
   Aletier Bemin — galeria.js
   Fotos con placeholder y botón "Ver más" que abre la fila
   ========================================================= */
(() => {
  // Si una foto no existe, se queda el placeholder que hay detrás
  document.querySelectorAll('.ab-foto img').forEach((img) => {
    const ocultar = () => { img.hidden = true; };
    img.addEventListener('error', ocultar);
    if (img.complete && img.naturalWidth === 0) ocultar();
  });

  // "Ver más" / "Ver menos": pasa de fila con scroll a grilla completa
  document.querySelectorAll('[data-expandir]').forEach((btn) => {
    const fila = document.getElementById(btn.dataset.expandir);
    btn.addEventListener('click', () => {
      const abierta = fila.classList.toggle('ab-expandido');
      btn.setAttribute('aria-expanded', abierta);
      btn.textContent = abierta ? 'Ver menos' : 'Ver más';
    });
  });
})();
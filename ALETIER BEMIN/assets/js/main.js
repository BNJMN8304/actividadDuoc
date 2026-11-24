/* =========================================================
   Aletier Bemin — main.js
   Carrusel circular vertical del Home
   ========================================================= */
(() => {
  const rueda = document.querySelector('[data-rueda]');
  if (!rueda) return;

  const cards = [...rueda.querySelectorAll('[data-card]')];
  const fondos = [...document.querySelectorAll('[data-fondo]')];
  const aviso = document.querySelector('[data-aviso]');
  const total = cards.length;
  const mitad = Math.floor(total / 2);
  let activa = 0;

  // Distancia circular de la card i respecto a la activa: -2, -1, 0, 1, 2
  const distancia = (i) => ((i - activa + total + mitad) % total) - mitad;

  function render() {
    cards.forEach((card, i) => {
      const d = distancia(i);
      card.dataset.offset = d;
      card.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      // Solo el link de la card activa entra en el orden del teclado
      card.querySelectorAll('a').forEach((a) => {
        a.tabIndex = d === 0 ? 0 : -1;
      });
    });

    fondos.forEach((f, i) => f.classList.toggle('activo', i === activa));

    if (aviso) {
      const titulo = cards[activa].querySelector('.ab-card-titulo').textContent;
      aviso.textContent = `${titulo}, ${activa + 1} de ${total}`;
    }
  }

  function ir(delta) {
    activa = (activa + delta + total) % total;
    render();
  }

  // Botones arriba / abajo
  document.querySelector('[data-prev]')?.addEventListener('click', () => ir(-1));
  document.querySelector('[data-next]')?.addEventListener('click', () => ir(1));

  // Teclado (flechas con la rueda enfocada)
  rueda.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); ir(-1); }
    if (e.key === 'ArrowDown') { e.preventDefault(); ir(1); }
  });

  // Clic en una card que se asoma: la trae al centro
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const d = distancia(i);
      if (d !== 0) ir(d);
    });
  });

  // Swipe vertical (táctil y mouse)
  let inicioY = null;
  rueda.addEventListener('pointerdown', (e) => { inicioY = e.clientY; });
  rueda.addEventListener('pointerup', (e) => {
    if (inicioY === null) return;
    const dy = e.clientY - inicioY;
    inicioY = null;
    if (Math.abs(dy) > 40) ir(dy < 0 ? 1 : -1);
  });
  rueda.addEventListener('pointercancel', () => { inicioY = null; });

  render();
})();
/* =========================================================
   Aletier Bemin — agendar.js
   Paso 3: calendario, horas, resumen y pago (modo demostración)
   ========================================================= */
(() => {
  const $ = (id) => document.getElementById(id);
  const pesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
  const HORAS = ['11:00', '13:00', '15:00', '18:00', '20:00'];
  const MESES_ADELANTE = 3;
  const ABONO_EVALUACION = 30000; // TODO: abono cuando no hay configuración previa (valor de ejemplo)

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const mesInicial = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const estado = { mes: new Date(mesInicial), dia: null, hora: null };

  // ---------- Disponibilidad SIMULADA ----------
  function estadoDia(d) {
    if (d < hoy) return 'pasado';
    const semana = d.getDay();
    if (semana === 0 || semana === 6) return 'cerrado'; // lunes a viernes
    return (d.getDate() * 3 + d.getMonth()) % 7 === 0 ? 'reservado' : 'libre';
  }
  const horaReservada = (d, i) => (d.getDate() + i) % 4 === 0;

  // ---------- Reserva que viene del configurador ----------
  let reserva = { items: [], total: 0 };
  try {
    const guardada = JSON.parse(sessionStorage.getItem('ab-reserva'));
    if (guardada && Array.isArray(guardada.items)) reserva = guardada;
  } catch { /* sin reserva previa */ }
  const abono = reserva.total > 0 ? Math.round(reserva.total / 2) : ABONO_EVALUACION;

  // ---------- Calendario ----------
  function nombreLargo(d) {
    return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function pintarCalendario() {
    const { mes } = estado;
    $('cal-mes').textContent = mes.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
    $('mes-ant').disabled = mes <= mesInicial;
    $('mes-sig').disabled = mes >= new Date(mesInicial.getFullYear(), mesInicial.getMonth() + MESES_ADELANTE, 1);

    const cont = $('cal-dias');
    cont.replaceChildren();
    ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach((l) => {
      const s = document.createElement('span');
      s.className = 'ab-cal-semana';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = l;
      cont.appendChild(s);
    });

    const vacios = (mes.getDay() + 6) % 7; // semana parte el lunes
    for (let i = 0; i < vacios; i++) cont.appendChild(document.createElement('span'));

    const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    for (let n = 1; n <= total; n++) {
      const fecha = new Date(mes.getFullYear(), mes.getMonth(), n);
      const est = estadoDia(fecha);
      const elegido = estado.dia && estado.dia.getTime() === fecha.getTime();
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ab-dia';
      b.dataset.estado = est;
      b.textContent = n;
      b.disabled = est !== 'libre';
      b.setAttribute('aria-pressed', Boolean(elegido));
      const texto = { libre: 'disponible', reservado: 'reservado', cerrado: 'cerrado', pasado: 'no disponible' }[est];
      b.setAttribute('aria-label', `${nombreLargo(fecha)}, ${texto}`);
      b.addEventListener('click', () => {
        estado.dia = fecha;
        estado.hora = null;
        pintarCalendario();
        pintarHoras();
        pintarResumen();
      });
      cont.appendChild(b);
    }
  }

  $('mes-ant').addEventListener('click', () => {
    estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() - 1, 1);
    pintarCalendario();
  });
  $('mes-sig').addEventListener('click', () => {
    estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() + 1, 1);
    pintarCalendario();
  });

  // ---------- Horas ----------
  function pintarHoras() {
    const cont = $('horas');
    cont.replaceChildren();
    if (!estado.dia) {
      cont.hidden = true;
      $('horas-ayuda').hidden = false;
      return;
    }
    $('horas-ayuda').hidden = true;
    cont.hidden = false;
    HORAS.forEach((h, i) => {
      const ocupada = horaReservada(estado.dia, i);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ab-hora';
      b.textContent = h;
      b.disabled = ocupada;
      b.setAttribute('aria-pressed', estado.hora === h);
      b.setAttribute('aria-label', ocupada ? `${h}, reservada` : h);
      b.addEventListener('click', () => {
        estado.hora = h;
        pintarHoras();
        pintarResumen();
      });
      cont.appendChild(b);
    });
  }

  // ---------- Resumen ----------
  function pintarResumen() {
    const n = reserva.items.length;
    $('res-servicio').textContent = n === 0 ? 'Evaluación en taller' : n === 1 ? reserva.items[0].nombre : `${n} servicios`;
    $('res-fecha').textContent = estado.dia && estado.hora
      ? `${nombreLargo(estado.dia)}, ${estado.hora}`
      : estado.dia ? `${nombreLargo(estado.dia)}, falta la hora` : 'Sin elegir';
    $('res-abono').textContent = pesos.format(abono);
  }

  // ---------- Método de pago y confirmación (demostración) ----------
  const metodo = () => document.querySelector('input[name="pago"]:checked').value;

  document.querySelectorAll('input[name="pago"]').forEach((r) => {
    r.addEventListener('change', () => {
      $('btn-pagar').textContent = metodo() === 'webpay' ? 'Pagar abono con Webpay' : 'Ver datos de transferencia';
    });
  });

  $('btn-pagar').addEventListener('click', () => {
    const falta = !estado.dia ? 'Elige un día.' : !estado.hora ? 'Elige una hora.' : !$('terminos').checked ? 'Debes aceptar los términos y condiciones.' : '';
    $('reserva-error').textContent = falta;
    if (falta) return;

    $('conf-codigo').textContent = 'AB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    $('conf-detalle').textContent = `${nombreLargo(estado.dia)}, ${estado.hora}. Abono: ${pesos.format(abono)}.`;
    $('conf-transf').hidden = metodo() !== 'transferencia';
    $('conf-webpay').hidden = metodo() !== 'webpay';
    $('reserva').hidden = true;
    $('confirmacion').hidden = false;
    $('titulo-conf').scrollIntoView({ block: 'start' });
    $('titulo-conf').focus({ preventScroll: true });
  });

  pintarCalendario();
  pintarHoras();
  pintarResumen();
})();
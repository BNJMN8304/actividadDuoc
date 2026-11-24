/* =========================================================
   Aletier Bemin — auth.js
   Registro, login y recuperar contraseña (modo demostración).
   ========================================================= */
(() => {
  const $ = (id) => document.getElementById(id);

  // TODO: se reemplaza por autenticación real con PHP y base de datos
  const CUENTA_DEMO = { correo: 'demo@aletierbemin.cl', clave: 'Bemin2026' };

  // ---------- Normalizadores ----------
  const limpiaTel = (v) => v.replace(/[\s+\-()]/g, '').replace(/^56(?=9\d{8}$)/, '');
  const limpiaPatente = (v) => v.toUpperCase().replace(/[\s\-.]/g, '');

  // ---------- Reglas: devuelven '' si está bien o el mensaje de error ----------
  const REGLAS = {
    nombre: (v) => (v.trim().length >= 3 && v.trim().includes(' ') ? '' : 'Ingresa tu nombre y apellido.'),
    correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresa un correo válido, por ejemplo nombre@correo.cl.'),
    telefono: (v) => (/^9\d{8}$/.test(limpiaTel(v)) ? '' : 'Ingresa un celular chileno de 9 dígitos, por ejemplo +56 9 1234 5678.'),
    patente: (v) => (!v.trim() || /^([A-Z]{2}\d{4}|[A-Z]{4}\d{2})$/.test(limpiaPatente(v)) ? '' : 'Formato de patente no válido, por ejemplo ABCD12 o AB1234.'),
    clave: (v) => (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Usa al menos 8 caracteres, con letras y números.'),
    clave2: (v) => (v === $('clave').value ? '' : 'Las contraseñas no coinciden.'),
    obligatoria: (v) => (v ? '' : 'Ingresa tu contraseña.'),
    terminos: (v, el) => (el.checked ? '' : 'Debes aceptar los términos y condiciones.')
  };

  function validarCampo(input) {
    const mensaje = REGLAS[input.dataset.regla](input.value, input);
    input.classList.toggle('is-invalid', Boolean(mensaje));
    input.setAttribute('aria-invalid', Boolean(mensaje));
    $(input.id + '-error').textContent = mensaje;
    return !mensaje;
  }

  // Valida todo el formulario y deja el foco en el primer error
  function validarForm(form) {
    const campos = [...form.querySelectorAll('[data-regla]')];
    const resultados = campos.map(validarCampo);
    const primero = campos[resultados.indexOf(false)];
    if (primero) primero.focus();
    return resultados.every(Boolean);
  }

  // Valida al salir del campo; si ya tenía error, se corrige mientras escribes
  document.querySelectorAll('[data-regla]').forEach((input) => {
    input.addEventListener('blur', () => { if (input.value || input.classList.contains('is-invalid')) validarCampo(input); });
    input.addEventListener('input', () => { if (input.classList.contains('is-invalid')) validarCampo(input); });
    input.addEventListener('change', () => { if (input.type === 'checkbox') validarCampo(input); });
  });

  // ---------- Mostrar / ocultar contraseña ----------
  document.querySelectorAll('[data-ver-clave]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const campo = $(btn.dataset.verClave);
      const mostrar = campo.type === 'password';
      campo.type = mostrar ? 'text' : 'password';
      btn.setAttribute('aria-pressed', mostrar);
      btn.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
      btn.firstElementChild.className = mostrar ? 'bi bi-eye-slash' : 'bi bi-eye';
    });
  });

  // ---------- Registro ----------
  const formRegistro = $('form-registro');
  if (formRegistro) {
    // La patente se escribe en mayúsculas
    $('patente').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase(); });

    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarForm(formRegistro)) {
        $('form-estado').textContent = 'Revisa los campos marcados.';
        return;
      }
      const usuario = {
        nombre: $('nombre').value.trim(),
        correo: $('correo').value.trim().toLowerCase(),
        telefono: limpiaTel($('telefono').value),
        patente: limpiaPatente($('patente').value)
      };
      try {
        localStorage.setItem('ab-usuario', JSON.stringify(usuario));
        sessionStorage.setItem('ab-sesion', usuario.correo);
        location.href = 'perfil.html';
      } catch {
        $('form-estado').textContent = 'No se pudo guardar tu cuenta en este navegador.';
      }
    });
  }

  // ---------- Login ----------
  const formLogin = $('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarForm(formLogin)) {
        $('login-estado').textContent = '';
        return;
      }
      const correo = $('login-correo').value.trim().toLowerCase();
      if (correo === CUENTA_DEMO.correo) {
        // Única cuenta cuya contraseña se verifica (visible en este archivo: solo para demostración)
        if ($('login-clave').value !== CUENTA_DEMO.clave) {
          $('login-estado').textContent = 'Correo o contraseña incorrectos.';
          return;
        }
      } else {
        let usuario = null;
        try { usuario = JSON.parse(localStorage.getItem('ab-usuario')); } catch { /* sin cuenta */ }
        if (!usuario || usuario.correo !== correo) {
          $('login-estado').textContent = 'No encontramos una cuenta con ese correo. Puedes crearla en Regístrate.';
          return;
        }
      }
      try { sessionStorage.setItem('ab-sesion', correo); } catch { /* sigue igual */ }
      location.href = 'perfil.html';
    });

    // Cambio entre login y recuperar contraseña
    const cambiar = (verRecuperar) => {
      $('panel-login').hidden = verRecuperar;
      $('panel-recuperar').hidden = !verRecuperar;
      const destino = verRecuperar ? $('titulo-recuperar') : $('titulo-login');
      destino.setAttribute('tabindex', '-1');
      destino.focus();
    };
    $('btn-olvide').addEventListener('click', () => cambiar(true));
    $('btn-volver').addEventListener('click', () => cambiar(false));

    $('form-recuperar').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validarForm($('form-recuperar'))) return;
      // Mensaje neutro: no revela si el correo está registrado
      $('rec-estado').textContent = 'Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña. (Modo demostración: no se envió ningún correo.)';
    });
  }
})();
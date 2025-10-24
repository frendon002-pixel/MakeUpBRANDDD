// ======================= app.js =======================
// Chicos: lógica del "Hacer pedido" para playeras.
// Lee el formulario, calcula total (modelo * cantidad + extras + envío)
// y muestra un resumen. Está escrito paso a paso y con comentarios.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');
  const outNombre = document.getElementById('outNombre');
  const outLista  = document.getElementById('outLista');
  const outTotal  = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl  = document.getElementById('toastAviso');
  const toast    = bootstrap.Toast.getOrCreateInstance(toastEl);
  toastBtn.addEventListener('click', () => toast.show());

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente').value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla  = document.getElementById('selTalla');
    const selColor  = document.getElementById('selColor');
    const cantidad  = Number(document.getElementById('inpCantidad').value || 0);

    // Validación mínima:
    if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
      alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precios base
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo); // precio unitario del modelo
    let total = precioModelo * cantidad;

    // 3) Extras / personalización
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga   = document.getElementById('chkParcheLiga');

    const extrasSeleccionados = [];
    if (chkNombreNumero.checked) {
      total += getPrecioFromDataset(chkNombreNumero) * cantidad; // costo por prenda
      extrasSeleccionados.push('Nombre y número');
    }
    if (chkParcheLiga.checked) {
      total += getPrecioFromDataset(chkParcheLiga) * cantidad; // costo por prenda
      extrasSeleccionados.push('Parche de liga');
    }

    // Campos condicionales (solo se muestran en resumen si tienen contenido)
    const inpNombre = document.getElementById('inpNombre').value.trim();
    const inpNumero = document.getElementById('inpNumero').value.trim();

    // 4) Envío e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio.options[selEnvio.selectedIndex];
    const costoEnvio = getPrecioFromDataset(optEnvio);
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones').value.trim();

    // 5) Pintamos resumen
    outNombre.textContent = nombre;

    // Lista HTML del pedido
    outLista.innerHTML = `
      <li><strong>Modelo:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
      <li><strong>Talla:</strong> ${selTalla.value}</li>
      <li><strong>Color:</strong> ${selColor.value}</li>
      <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
      ${inpNombre || inpNumero ? `<li><strong>Personalización:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Número: ' + inpNumero : ''}</li>` : ''}
      <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
      ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
    `;

    outTotal.textContent = toMXN(total);

    // Habilitamos confirmar y pasamos nombre al modal
    btnConfirmar.disabled = false;
    confirmNombre.textContent = nombre;
  });

  // Reset: limpiar también el resumen
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outNombre.textContent = '—';
      outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
      outTotal.textContent = '$0';
      btnConfirmar.disabled = true;
    }, 0);
  });
});
// ===================== /app.js ======================
// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner con getElementById --------
  // Chicos: selecciono el banner por ID y el botón de demo.
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');

  // Al hacer clic, cambio clases de Bootstrap (ej. bg-dark -> bg-warning).
  btnPromo?.addEventListener('click', () => {
    // Limpio posibles fondos previos del banner
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    // Aplico un nuevo color de fondo (warning = amarillo)
    banner.classList.add('bg-warning');
    // Ajusto contraste del texto
    banner.classList.remove('text-white');
    banner.classList.add('text-dark');
  });

  // -------- Actividad 2: Testimonios --------
  // 2.1 VIP en azul (text-primary) usando getElementsByClassName
  // Chicos: HTML marca VIP con .testimonio-vip; aquí iteramos y estilizamos.
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary'); // color azul Bootstrap
  }

  // 2.2 TODOS los párrafos en rojo (text-danger) usando getElementsByTagName
  // OJO: esto afecta toda la página como pide la actividad.
  // Si solo quieres afectar la sección de testimonios, usa la línea comentada.
  const allParagraphs = document.getElementsByTagName('p');
  // const allParagraphs = document.querySelectorAll('#testimonios p'); // <- opción localizada
  for (const p of allParagraphs) {
    p.classList.add('text-danger');
  }

  // -------- Actividad 3: Formulario de contacto --------
  // 3.1 Primer input de texto con querySelector (le pongo bg-success para resaltarlo)
  // Chicos: querySelector toma el primer match del selector CSS dado.
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10'); // fondo verdoso suave

  // 3.2 Todos los botones del formulario a btn-danger con querySelectorAll
  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    // Quito estilos previos "suaves" y paso a rojo Bootstrap
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  // 3.3 Campo "nombre" via getElementsByName -> color de texto text-warning
  // Chicos: getElementsByName devuelve una NodeList por atributo name.
  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning'); // texto del input en amarillo
    // Opcional: también pinto el <label> asociado
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});
// ======= WhatsApp flotante: mostrar tras scroll + mensaje por horario =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return; // Si no hay botón en la página, salimos

  // 1) Mensaje dinámico según hora local (9 a 18 h "en línea")
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  // (Opcional) Prefill del texto en el chat
  const telefono = '527221234567'; // Chicos: 52 + 10 dígitos (México)
  const texto = encodeURIComponent('Hola, vengo del sitio de Profe Joako. Me interesa una playera.');
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // 2) Mostrar/ocultar por scroll (aparece al bajar 300px)
  const UMBRAL = 300;
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) {
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };

  // Estado inicial y listener
  toggleWA();
  window.addEventListener('scroll', toggleWA, { passive: true });
});
/*PRUEBA CARRITO*/
// ======================= app.js =======================
// Lógica fusionada: Formulario Pedido + DOM Activities + Carrito Compras
// ======================================================

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
// Asegura que el número sea válido y usa el formato de moneda mexicana.
// Maneja casos donde num podría ser null o undefined
const number = Number(num);
if (isNaN(number)) {
console.warn("toMXN received non-numeric value:", num);
return Number(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}
return number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}


/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
// Verifica si el elemento existe
if (!el) {
console.warn("getPrecioFromDataset received null element");
return 0;
}
// Para <select>, buscamos la opción seleccionada
if (el.tagName === 'SELECT') {
// Verifica si hay una opción seleccionada
if (el.selectedIndex < 0) return 0; // No hay selección
const opt = el.options[el.selectedIndex];
// Verifica si la opción tiene el dataset
const raw = opt?.dataset?.precio;
return raw ? Number(raw) : 0;
}
// Para <input> (checkbox)
const raw = el?.dataset?.precio;
return raw ? Number(raw) : 0;
}


// --- Lógica del Carrito de Compras ---
let itemsEnCarrito = []; // Array para llevar cuenta interna de los items {element, nombre, precio}
const listaCarrito = document.getElementById('lista-carrito');
const mensajeFeedback = document.getElementById('mensaje-feedback');
const btnEliminar = document.getElementById('btn-eliminar');
const carritoVacioMsg = document.getElementById('carrito-vacio');
const catalogoContainer = document.getElementById('catalogo'); // Contenedor de las cards de producto

// --- Función para mostrar mensajes de feedback (simplificada) ---
function mostrarMensaje(mensaje, tipo) {
if (!mensajeFeedback) {
console.error("Elemento #mensaje-feedback no encontrado.");
return;
}
mensajeFeedback.textContent = mensaje;
// Reset classes and add new ones
mensajeFeedback.className = `alert alert-${tipo} alert-neon mt-2`; // Mantiene estilo neón y margen
// Make visible immediately
mensajeFeedback.classList.remove('d-none');

// Hide after 3 seconds
setTimeout(() => {
mensajeFeedback.classList.add('d-none');
}, 3000);
}

// --- Función para agregar producto al carrito (Corregida) ---
function agregarProducto(nombre, precio) {
console.log(`Agregando al carrito: ${nombre} - ${toMXN(precio)}`);
if (!listaCarrito || !carritoVacioMsg || !btnEliminar) {
console.error("Elementos del carrito no encontrados en el DOM.");
return;
}

// Oculta el mensaje "vacío" si es el primer item
if (itemsEnCarrito.length === 0 && carritoVacioMsg) {
carritoVacioMsg.style.display = 'none';
}

const nuevoItem = document.createElement('li');
nuevoItem.classList.add('list-group-item', 'carrito-item');
// Usar toMXN para formatear el precio al mostrarlo
nuevoItem.innerHTML = `
<span>${nombre}</span>
<span class="fw-bold">${toMXN(precio)}</span>
`;
listaCarrito.prepend(nuevoItem); // Añade al inicio de la lista visual
// Guarda objeto con info Y la referencia al elemento LI
itemsEnCarrito.push({ element: nuevoItem, nombre: nombre, precio: precio });
btnEliminar.classList.remove('disabled'); // Habilita botón eliminar
mostrarMensaje(`"${nombre}" agregado al carrito.`, 'success');
}

// --- Función para eliminar el último producto agregado (Simplificada) ---
function eliminarProducto() {
console.log("Eliminando último producto del carrito");
if (!listaCarrito || !carritoVacioMsg || !btnEliminar) {
console.error("Elementos del carrito no encontrados en el DOM.");
return;
}

if (itemsEnCarrito.length > 0) {
const itemInfo = itemsEnCarrito.pop(); // Obtiene el objeto {element, nombre, precio} del último item
const itemAEliminar = itemInfo.element; // El elemento LI guardado

if (itemAEliminar && itemAEliminar.parentNode === listaCarrito) { // Verifica que el elemento exista y esté en la lista visual
listaCarrito.removeChild(itemAEliminar);
mostrarMensaje(`"${itemInfo.nombre}" eliminado.`, 'danger'); // Usa el nombre guardado

// Si el carrito queda vacío, muestra el mensaje y deshabilita el botón
if (itemsEnCarrito.length === 0) {
if(carritoVacioMsg) carritoVacioMsg.style.display = 'block';
if(btnEliminar) btnEliminar.classList.add('disabled');
}
} else {
console.warn("El elemento a eliminar no se encontró en la lista visual o ya fue removido.");
// Si el elemento no está, pero el array interno sí tenía algo,
// intentar actualizar el estado por si acaso.
if (itemsEnCarrito.length === 0) {
if(carritoVacioMsg) carritoVacioMsg.style.display = 'block';
if(btnEliminar) btnEliminar.classList.add('disabled');
}
}
} else {
mostrarMensaje('El carrito ya está vacío.', 'warning');
if(btnEliminar) btnEliminar.classList.add('disabled'); // Asegurarse que esté deshabilitado
}
}


// --- Listener Principal DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

// --- Referencias Formulario Pedido ---
const formPedido = document.getElementById('formPedido');
const outNombre = document.getElementById('outNombre');
const outLista = document.getElementById('outLista');
const outTotal = document.getElementById('outTotal');
const btnConfirmar = document.getElementById('btnConfirmar');
const confirmNombre = document.getElementById('confirmNombre');

// --- Referencias Toast (Aviso Validación Form Pedido) ---
const toastEl = document.getElementById('toastAviso');
const toastBody = document.getElementById('toastBody');
// Verificar si toastEl existe antes de crear la instancia
const toast = toastEl ? bootstrap.Toast.getOrCreateInstance(toastEl) : null;

// --- Lógica del Formulario de Pedido ---
// Verificar si formPedido existe antes de añadir listener
if (formPedido) {
formPedido.addEventListener('submit', (e) => {
e.preventDefault();

// 1) Leemos campos base
const nombre = document.getElementById('nombreCliente')?.value.trim();
const selModelo = document.getElementById('selModelo');
const selTalla = document.getElementById('selTalla');
const selColor = document.getElementById('selColor');
const cantidad = Number(document.getElementById('inpCantidad')?.value || 0);

// Validación
if (!nombre || !selModelo?.value || !selTalla?.value || !selColor?.value || cantidad < 1) {
// Solo mostrar toast si existe
if (toast && toastBody) {
toastBody.textContent = 'Completa nombre, modelo, versión, color y cantidad (mínimo 1).';
toast.show();
} else {
alert('Completa nombre, modelo, versión, color y cantidad (mínimo 1).'); // Fallback
}
return;
}

// 2) Precios base
const precioModelo = getPrecioFromDataset(selModelo);
let total = precioModelo * cantidad;

// 3) Extras
const chkNombreNumero = document.getElementById('chkNombreNumero');
const chkParcheLiga = document.getElementById('chkParcheLiga');
const extrasSeleccionados = [];
if (chkNombreNumero?.checked) { // Verificar si existe
total += getPrecioFromDataset(chkNombreNumero);
extrasSeleccionados.push('Garantía Extendida');
}
if (chkParcheLiga?.checked) { // Verificar si existe
total += getPrecioFromDataset(chkParcheLiga);
extrasSeleccionados.push('Seguro contra daños');
}
const inpNombre = document.getElementById('inpNombre')?.value.trim();
const inpNumero = document.getElementById('inpNumero')?.value.trim();

// 4) Envío e instrucciones
const selEnvio = document.getElementById('selEnvio');
const costoEnvio = getPrecioFromDataset(selEnvio);
total += costoEnvio;
// Usar ID correcto del HTML: txtInstrucciones
const txtInstr = document.getElementById('txtInstrucciones')?.value.trim();

// 5) Pintamos resumen (verificando si existen los elementos)
if (outNombre) outNombre.textContent = nombre;
if (outLista) outLista.innerHTML = `
<li><strong>Producto:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
<li><strong>Versión:</strong> ${selTalla.value}</li>
<li><strong>Color:</strong> ${selColor.value}</li>
<li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
${inpNombre || inpNumero ? `<li><strong>Datos Garantía:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Folio: ' + inpNumero : ''}</li>` : ''}
<li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
`;
if (outTotal) outTotal.textContent = toMXN(total);
if (btnConfirmar) btnConfirmar.disabled = false;
if (confirmNombre) confirmNombre.textContent = nombre;
});

// Reset Formulario Pedido
formPedido.addEventListener('reset', () => {
setTimeout(() => {
if (outNombre) outNombre.textContent = '—';
if (outLista) outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
if (outTotal) outTotal.textContent = '$0.00';
if (btnConfirmar) btnConfirmar.disabled = true;
}, 0);
});
} else {
console.warn("Elemento #formPedido no encontrado. La lógica del formulario de pedido no se ejecutará.");
}


// --- Lógica DOM Activities ---
const banner = document.getElementById('banner');
const btnPromo = document.getElementById('btnPromo');
btnPromo?.addEventListener('click', () => {
if (!banner) return;
banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
banner.classList.add('bg-warning');
banner.classList.remove('text-white');
banner.classList.add('text-dark');
});

const vipItems = document.getElementsByClassName('testimonio-vip');
// (No se añade clase JS, el estilo VIP viene del CSS con border-primary)

const testimonioParagraphs = document.querySelectorAll('#testimonios p');
for (const p of testimonioParagraphs) {
// Asegurarse de no añadir text-danger a los footers si son <p>
if (!p.closest('footer')) {
p.classList.add('text-danger');
}
}

const firstTextInputContacto = document.querySelector('#formContacto input[type="text"]');
firstTextInputContacto?.classList.add('bg-success', 'bg-opacity-10');

const contactoSubmitButton = document.querySelector('#formContacto button[type="submit"]'); // Más específico
if(contactoSubmitButton) {
contactoSubmitButton.classList.remove('btn-primary'); // Quitar azul por defecto si lo tuviera
contactoSubmitButton.classList.add('btn-warning', 'text-dark', 'btn-neon-glow'); // Poner amarillo neón
}


// Seleccionar específicamente el input 'nombre' dentro de '#formContacto'
const nombreInputContacto = document.querySelector('#formContacto input[name="nombre"]');
if (nombreInputContacto) {
nombreInputContacto.classList.add('border-warning', 'border-2');
const labelContacto = document.querySelector('#formContacto label[for="cNombre"]');
labelContacto?.classList.add('text-warning');
}


// --- Lógica Botón WhatsApp ---
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
const toggleWA = () => {
if (window.scrollY > 400) {
whatsappBtn.classList.add('show');
} else {
whatsappBtn.classList.remove('show');
}
};
window.addEventListener('scroll', toggleWA, { passive: true });
toggleWA(); // Llamada inicial por si la página carga con scroll
}

// --- Listener para Botones "Agregar al Carrito" (Delegación) ---
// Verificar si catalogoContainer existe
if (catalogoContainer) {
catalogoContainer.addEventListener('click', (event) => {
const boton = event.target.closest('.btn-agregar'); // Busca el botón más cercano al clic
if (boton) {
const nombre = boton.dataset.nombre;
const precio = parseFloat(boton.dataset.precio);
if (nombre && !isNaN(precio)) {
agregarProducto(nombre, precio);
} else {
console.error("Datos incompletos o inválidos en el botón:", boton.dataset);
mostrarMensaje("Error al obtener datos del producto.", "danger");
}
}
});
} else {
console.warn("Elemento #catalogo no encontrado. Los botones 'Agregar al Carrito' no funcionarán.");
}


// --- Listener para Botón "Eliminar Último Producto" ---
// Verificar si btnEliminar existe
if (btnEliminar) {
btnEliminar.addEventListener('click', eliminarProducto);
// Estado inicial del botón (deshabilitado si el carrito interno está vacío al cargar)
if (itemsEnCarrito.length === 0) {
btnEliminar.classList.add('disabled');
}
} else {
console.warn("Elemento #btn-eliminar no encontrado.");
}

});
// ===================== /app.js (Fin) ======================
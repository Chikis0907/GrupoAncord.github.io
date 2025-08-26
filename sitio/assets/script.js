// ====== SLIDER DATASETS ======

// === Dinámicos: integrar productos guardados (newProducts) al catálogo ===
function getDynamicProducts(){
  try{
    const list = JSON.parse(localStorage.getItem('newProducts') || '[]');
    // Normaliza a estructura del slider
    return (list || []).map(p => ({
      img: p.image || 'img/img3.jpg',
      title: p.name || 'Producto',
      desc: p.desc || '',
      price: (typeof p.price === 'number' ? p.price : parseFloat(p.price || '0')) || 0
    }));
  } catch(e){ return []; }
}

const CatalogoData = [
  { img: 'img/img32.jpeg', title: 'Horno de alto vacio', des: ' ', price: 50000.00 },
  { img: 'img/img30.jpg', title: 'Control de temperatura', des: ' ', price: 2300 },
  { img: 'img/img23.jpg', title: 'Control de temperatura DC2800', desc: ' ', price: 143000 },
  { img: 'img/img24.jpg', title: 'Video registrador', desc: ' ', price: 51200 },
  { img: 'img/img27.jpg', title: 'Medidor de flujo electromagnético', desc: ' ', price: 2300 },
  { img: 'img/img25.jpg', title: 'Pastillas de temperatura', desc: ' ', price: 18900 },
  { img: 'img/img28.jpg', title: 'Control de temperatura DC1202-1-7-0-0-1-0-0-0 110/220 vac', desc: ' ', price: 10880 },
  { img: 'img/img29.jpg', title: 'Interruptor de límite horizontal', desc: ' ', price: 250 },
];

const AcercaData = [
  { img: 'img/img20.jpg', title: 'TAV'},
  { img: 'img/img21.jpg', title: 'ISPEN'},
  { img: 'img/img31.png', title: 'IVA SCHMETZ'},
  { img: 'img/img19.jpg', title: 'SECO/WARWICK'},
  { img: 'img/img17.jpg', title: 'CHANGHENG'},
  { img: 'img/img22.jpg', title: 'FURNACARE'},
  { img: 'img/img18.jpg', title: 'PAULO'},
];


// ====== CART HELPERS (multi-item) ======
const CART_KEY = 'cartItems';

function readCart(){
  // migrate from old single item key if present
  const old = localStorage.getItem('cartItem');
  const arr = localStorage.getItem(CART_KEY);
  if (arr){ try { return JSON.parse(arr) || []; } catch { return []; } }
  if (old){
    try{
      const it = JSON.parse(old);
      const migrated = it ? [{ id: it.name, name: it.name, img: it.img, unitPrice: it.unitPrice || 0, qty: it.qty || 1 }] : [];
      localStorage.removeItem('cartItem');
      localStorage.setItem(CART_KEY, JSON.stringify(migrated));
      return migrated;
    } catch { return []; }
  }
  return [];
}
function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items || [])); }
function findInCart(id){ return readCart().find(it => it.id === id); }
function upsertCartItem(item){
  const list = readCart();
  const idx = list.findIndex(p => p.id === item.id);
  if (idx >= 0){
    // already exists -> return false to signal duplicate
    return { ok:false, items:list };
  } else {
    list.push(item);
    writeCart(list);
    return { ok:true, items:list };
  }
}
function updateQty(id, qty){
  const list = readCart();
  const idx = list.findIndex(p => p.id === id);
  if (idx >= 0){
    list[idx].qty = Math.max(1, qty);
    writeCart(list);
  }
  return list;
}
function removeItem(id){
  const list = readCart().filter(p => p.id !== id);
  writeCart(list);
  return list;
}

// ====== SLIDER HELPERS ======
function mountCatalogoSlider(){
  const CAT = [...CatalogoData, ...getDynamicProducts()];
  const img = document.getElementById('cat-image');
  const title = document.getElementById('cat-title');
  const desc = document.getElementById('cat-desc');
  const price = document.getElementById('cat-price');
  const prev = document.getElementById('cat-prev');
  const next = document.getElementById('cat-next');
  const addBtn = document.getElementById('add-to-cart');
  if (!img || !title || !desc || !price || !prev || !next || !addBtn) return;

  let i = 0;
  const render = () => {
    const it = CAT[i];
    img.src = it.img; img.alt = it.title;
    title.textContent = it.title;
    desc.textContent = it.desc;
    price.textContent = it.price !== undefined && it.price !== '' ? `$${it.price}` : '$0.00';
  };
  const step = (d) => { i = (i + d + CAT.length) % CAT.length; render(); };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  addBtn.addEventListener('click', () => {
    const it = CAT[i];
    const id = it.title; // simple id by title
    const res = upsertCartItem({ id, name: it.title, img: it.img, unitPrice: it.price || 0, qty: 1 });
    if (!res.ok){
      alert('este producto ya se encuentra en tu carrito');
    } else {
      // stay on catalog page and give a small notification
      alert('Producto agregado al carrito');
    }
  });

  render();
}

function mountAcercaSlider(){
  const img = document.getElementById('ac-image');
  const title = document.getElementById('ac-title');
  const desc = document.getElementById('ac-desc');
  const prev = document.getElementById('ac-prev');
  const next = document.getElementById('ac-next');
  if (!img || !title ||  !prev || !next) return;

  let i = 0;
  const render = () => {
    const it = AcercaData[i];
    img.src = it.img; img.alt = it.title;
    title.textContent = it.title;
    desc.textContent = it.desc;
  };
  const step = (d) => { i = (i + d + AcercaData.length) % AcercaData.length; render(); };

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  render();
}

// ====== CART PAGE ======

function mountCart(){
  const root = document.getElementById('cart-root');
  if (!root) return;

  function render(){
    const list = readCart();
    if (!list.length){
      root.innerHTML = '<p class="empty">Tu carrito está vacío.</p>';
      return;
    }
    const grand = list.reduce((s, it) => s + (it.unitPrice || 0) * (it.qty || 1), 0);
    root.innerHTML = `
      <div class="cart-list">
        ${list.map(it => `
          <div class="card cart-item" data-id="${it.id}">
            <img src="${it.img}" alt="${it.name}" width="200" height="150">
            <div>
              <h3>${it.name}</h3>
              <div>Precio unitario: <strong>$${it.unitPrice || 0}</strong></div>
              <div class="qty-controls" style="margin-top:8px;">
                <button class="qminus" aria-label="Disminuir">-</button>
                <span class="qval">${it.qty || 1}</span>
                <button class="qplus" aria-label="Aumentar">+</button>
              </div>
            </div>
            <div class="total item-total">$${(it.unitPrice || 0) * (it.qty || 1)}</div>
            <button class="btn remove">Eliminar</button>
          </div>
        `).join('')}
      </div>
      <div class="card">
        <h3 id="grand-total">Total: $${grand}</h3>
        <div class="admin-actions" style="margin-top:8px;gap:8px;flex-wrap:wrap;">
          <button class="btn" id="btn-email">Enviar lista por correo</button>
        </div>
      </div>
    `;

    // Wire events por producto
    root.querySelectorAll('.cart-item').forEach(row => {
      const id = row.getAttribute('data-id');
      const minus = row.querySelector('.qminus');
      const plus = row.querySelector('.qplus');
      const qval = row.querySelector('.qval');
      const totalEl = row.querySelector('.item-total');
      const removeBtn = row.querySelector('.remove');

      const sync = () => {
        const item = findInCart(id);
        if (!item) return render();
        qval.textContent = item.qty;
        totalEl.textContent = `$${(item.unitPrice || 0) * (item.qty || 1)}`;
        const grand2 = readCart().reduce((s, it) => s + (it.unitPrice || 0) * (it.qty || 1), 0);
        const summary = document.getElementById('grand-total');
        if (summary) summary.textContent = `Total: $${grand2}`;
      };

      minus.addEventListener('click', () => { 
        const item = findInCart(id); if (!item) return;
        updateQty(id, Math.max(1, (item.qty || 1) - 1)); sync();
      });
      plus.addEventListener('click', () => { 
        const item = findInCart(id); if (!item) return;
        updateQty(id, (item.qty || 1) + 1); sync();
      });
      removeBtn.addEventListener('click', () => { removeItem(id); render(); });
    });

    // Botón Enviar lista por correo -> abre modal
    const emailBtn = document.getElementById('btn-email');
    if (emailBtn) emailBtn.addEventListener('click', () => {
      const listNow = readCart();
      if (!listNow.length){
        alert('Tu carrito está vacío.');
        return;
      }
      const modalEl = document.getElementById('sendListModal');
      if (!modalEl) { alert('No se encontró el formulario de envío.'); return; }
      const form = document.getElementById('sendListForm');
      form && form.reset();
      setFeedback('');
      toggleSendLoading(false);
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    });
  }

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  mountCatalogoSlider();
  mountAcercaSlider();
  mountCart();
});


/* === Menu (burger/drawer) + header hide on scroll === */
(function(){
  if (document.body.dataset.menuInit) return; // guard against double-init
  document.body.dataset.menuInit = "1";

  let lastY = window.scrollY || 0;
  const header = document.querySelector('.header');
  const drawer = document.querySelector('.drawer');
  const burger = document.querySelector('.burger');
  const closeBtn = document.querySelector('.drawer__close');
  const links = document.querySelectorAll('.drawer a');
  const footer = document.querySelector('.footer');

  function updateAria(){
    if (!drawer) return;
    const isOpen = drawer.classList.contains('open');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    burger && burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  function toggleDrawer(){
    if (!drawer) return;
    drawer.classList.toggle('open');
    updateAria();
  }
  function closeDrawer(){
    if (!drawer) return;
    drawer.classList.remove('open');
    updateAria();
  }

  function onScroll(){
    const y = window.scrollY || 0;
    if (y > lastY && y > 80) { header && header.classList.add('header--hidden'); }
    else { header && header.classList.remove('header--hidden'); }
    lastY = y;

    if (footer){
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 20);
      footer.classList.toggle('footer--visible', nearBottom);
    }
  }

  burger && burger.addEventListener('click', toggleDrawer);
  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  links.forEach(a => a.addEventListener('click', closeDrawer));

  // Close when clicking outside the drawer
  document.addEventListener('click', (e) => {
    if (!drawer || !drawer.classList.contains('open')) return;
    const clickInsideDrawer = drawer.contains(e.target);
    const clickOnBurger = burger && burger.contains(e.target);
    if (!clickInsideDrawer && !clickOnBurger) closeDrawer();
  });

  // Close with ESC
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
  updateAria();
})();


// ====== Modal helpers + PDF + Email (agregados) ======
function validateEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function setFeedback(msg, cls){
  const el = document.getElementById('sendFeedback');
  if (!el) return;
  el.className = 'small mt-2 ' + (cls || '');
  el.textContent = msg || '';
}
function toggleSendLoading(loading, message){
  const btn = document.getElementById('confirmSendBtn');
  if (!btn) return;
  if (loading){
    btn.disabled = true;
    btn.innerText = message || 'Enviando...';
  } else {
    btn.disabled = false;
    btn.innerText = 'Enviar PDF';
  }
}
function fmt(n){ return (Number(n) || 0).toFixed(2); }
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'archivo.pdf';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove(); URL.revokeObjectURL(url);
  }, 0);
}
async function toDataURL(url){
  const resp = await fetch(url, { cache: 'no-cache' });
  const blob = await resp.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Generación del PDF
async function generateCartPDF(list, meta){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;

  // logo (opcional)
  try{
    const logoDataUrl = await toDataURL('img/groAncor.png'); // ajusta ruta si es necesario
    doc.addImage(logoDataUrl, 'PNG', margin, margin, 120, 55);
  } catch{}

  // Encabezado
  const title = 'Detalle de pedido';
  const dateStr = new Date().toLocaleString();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, pageW - margin, margin + 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generado: ${dateStr}`, pageW - margin, margin + 38, { align: 'right' });
  if (meta?.name || meta?.email){
    doc.text(`${meta?.name || ''} ${meta?.email ? '· ' + meta.email : ''}`, pageW - margin, margin + 54, { align: 'right' });
  }

  // Tabla
  const rows = list.map(it => ([
    it.name,
    String(it.qty || 1),
    `$${fmt(it.unitPrice || 0)}`,
    `$${fmt((it.unitPrice || 0) * (it.qty || 1))}`
  ]));
  const total = list.reduce((s, it) => s + (it.unitPrice || 0) * (it.qty || 1), 0);

  doc.autoTable({
    startY: 120,
    head: [['Producto', 'Cantidad', 'Precio unitario', 'Total']],
    body: rows,
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [30, 41, 59] }
  });

  // Total general
  const endY = doc.lastAutoTable.finalY || 120;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: $${fmt(total)}`, pageW - margin, endY + 30, { align: 'right' });

  // Salida
  const dataUrl = doc.output('datauristring');
  const blob = doc.output('blob');
  return { dataUrl, blob };
}

// Envío del formulario del modal
document.addEventListener('DOMContentLoaded', () => {
  const sendForm = document.getElementById('sendListForm');
  if (sendForm){
    sendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('buyerName').value.trim();
      const email = document.getElementById('buyerEmail').value.trim();
      if (!name || !validateEmail(email)){
        setFeedback('Por favor, escribe un nombre y un correo válidos.', 'text-danger');
        return;
      }

      const listNow = readCart();
      if (!listNow.length){
        setFeedback('Tu carrito está vacío.', 'text-danger');
        return;
      }

      try{
        toggleSendLoading(true, 'Generando PDF...');
        const { dataUrl, blob } = await generateCartPDF(listNow, { name, email });

        // ¿EmailJS inicializado?
        const canEmail = !!(window.emailjs && emailjs.__init && emailjs.__init.userID);
        if (canEmail){
          toggleSendLoading(true, 'Enviando correo...');
          const SERVICE_ID = 'TU_SERVICE_ID';
          const TEMPLATE_ID = 'TU_TEMPLATE_ID';

          const totalNow = listNow.reduce((s, it) => s + (it.unitPrice || 0) * (it.qty || 1), 0);
          const lines = listNow.map(it => `${it.name} x ${it.qty || 1} = $${fmt(it.unitPrice || 0)} (Item: $${fmt((it.unitPrice || 0) * (it.qty || 1))})`).join('\\n');

          const templateParams = {
            to_email: email,
            user_name: name,
            summary_text: `Detalle del pedido:\\n${lines}\\n\\nTotal general: $${fmt(totalNow)}`,
            attachments: [
              { name: 'pedido.pdf', data: dataUrl }
            ]
          };

          await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
          setFeedback('¡Correo enviado con éxito! También se descargó una copia del PDF.', 'text-success');

          // Descargar respaldo
          downloadBlob(blob, 'pedido.pdf');

          // Cerrar modal en 1.2s
          setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('sendListModal'));
            modal && modal.hide();
          }, 1200);
        } else {
          setFeedback('EmailJS no está inicializado. Descargando PDF para adjuntarlo manualmente...', 'text-warning');
          downloadBlob(blob, 'pedido.pdf');
          // Abre cliente de correo (no adjunta automáticamente)
          const subject = 'Pedido desde carrito';
          const body = `Hola,\\n\\nAdjunto el PDF con el detalle del pedido.\\n\\nGracias.\\n\\n${name}`;
          const params = new URLSearchParams({ subject, body });
          window.location.href = `mailto:${email}?${params.toString()}`;
        }
      } catch(err){
        console.error(err);
        setFeedback('Ocurrió un error al generar o enviar el PDF. Intenta de nuevo.', 'text-danger');
        toggleSendLoading(false);
      }
    });
  }
});

/* Tài Moto - bản thử nghiệm localStorage trên cùng trình duyệt/origin */
(() => {
  const KEYS = { products: 'taiMotoProducts', orders: 'taiMotoOrders', cart: 'taiMotoCart', categories: 'taiMotoCategories' };
  const $ = id => document.getElementById(id);
  const read = (key, fallback = []) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = value => Number(value || 0).toLocaleString('vi-VN') + ' ₫';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const demoProducts = [
    {id:'P-DEMO-1',name:'Sportbike cao cấp',price:520000000,type:'sport',year:'2024',image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85',description:'600–1000cc · Động cơ xăng · Xe minh họa',active:true},
    {id:'P-DEMO-2',name:'Naked Bike mạnh mẽ',price:380000000,type:'naked',year:'2024',image:'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=85',description:'650–900cc · Động cơ xăng · Xe minh họa',active:true},
    {id:'P-DEMO-3',name:'Touring đường dài',price:680000000,type:'touring',year:'2025',image:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85',description:'900–1300cc · Động cơ xăng · Xe minh họa',active:true}
  ];
  const defaultCategories = [
    {id:'sport',name:'Sportbike'}, {id:'naked',name:'Naked Bike'},
    {id:'touring',name:'Touring'}, {id:'other',name:'Khác'}
  ];
  if (localStorage.getItem(KEYS.products) === null) write(KEYS.products, demoProducts);
  if (localStorage.getItem(KEYS.categories) === null) write(KEYS.categories, defaultCategories);
  let categories = read(KEYS.categories, defaultCategories);
  let products = read(KEYS.products, demoProducts).filter(p => p.active !== false);
  let cart = read(KEYS.cart);
  let activeFilter = 'all';
  function categoryLabel(id) { return categories.find(c => c.id === id)?.name || id || 'Khác'; }
  function renderFilters() {
    const container = document.querySelector('.filters'); if (!container) return;
    container.replaceChildren();
    const all = [{id:'all',name:'Tất cả xe'}, ...categories];
    if (!all.some(c => c.id === activeFilter)) activeFilter = 'all';
    all.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'filter' + (c.id === activeFilter ? ' active' : '');
      btn.dataset.filter = c.id; btn.textContent = c.name;
      btn.addEventListener('click', () => {
        activeFilter = c.id;
        container.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
        renderProducts();
      });
      container.appendChild(btn);
    });
  }

  function renderProducts() {
    const grid = $('carGrid'); if (!grid) return;
    let list = products.filter(p => activeFilter === 'all' || p.type === activeFilter);
    const sort = $('sortCars')?.value;
    if (sort === 'low') list.sort((a,b) => Number(a.price)-Number(b.price));
    if (sort === 'high') list.sort((a,b) => Number(b.price)-Number(a.price));
    grid.replaceChildren();
    if (!list.length) { grid.innerHTML = '<p class="muted">Chưa có xe trong danh mục này.</p>'; return; }
    list.forEach(p => {
      const article = document.createElement('article'); article.className = 'car-card';
      article.dataset.type = p.type || 'other'; article.dataset.price = p.price;
      const image = p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">` : '<div class="car-image-placeholder">Chưa có ảnh</div>';
      article.innerHTML = `<div class="car-image">${image}<span class="car-tag">${escapeHtml(categoryLabel(p.type))}</span></div>
        <div class="car-info"><p class="car-meta">${escapeHtml(p.year || 'Chưa cập nhật')} | Nhập khẩu</p><h3>${escapeHtml(p.name)}</h3>
        <p class="price">${money(p.price)} <small>VNĐ</small></p><div class="car-specs"><span>${escapeHtml(p.description || 'Thông tin đang cập nhật')}</span></div>
        <button type="button" class="btn car-btn add-to-cart">Thêm vào giỏ</button></div>`;
      article.querySelector('button').addEventListener('click', () => addToCart(p));
      grid.appendChild(article);
    });
  }
  function addToCart(p) {
    const found = cart.find(item => item.id === p.id);
    if (found) found.qty += 1; else cart.push({id:p.id,name:p.name,price:Number(p.price),qty:1});
    write(KEYS.cart, cart); renderCart();
  }
  function renderCart() {
    const items = $('cartItems'); if (!items) return;
    const count = cart.reduce((sum,p) => sum + p.qty, 0);
    if ($('cartCount')) $('cartCount').textContent = count;
    const total = cart.reduce((sum,p) => sum + Number(p.price)*p.qty, 0);
    if ($('cartTotal')) $('cartTotal').textContent = money(total);
    if ($('checkoutSummary')) $('checkoutSummary').textContent = cart.length ? `Đơn hàng gồm ${count} sản phẩm, tổng cộng ${money(total)}.` : 'Vui lòng thêm xe vào giỏ hàng.';
    items.replaceChildren();
    if (!cart.length) { items.innerHTML = '<p class="muted">Giỏ hàng đang trống.</p>'; return; }
    cart.forEach(item => {
      const row = document.createElement('div'); row.className = 'cart-item';
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #ddd';
      const info = document.createElement('div'); info.textContent = `${item.name} × ${item.qty} — ${money(item.price * item.qty)}`;
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn outline'; remove.textContent = 'Xóa';
      remove.addEventListener('click', () => { cart = cart.filter(p => p.id !== item.id); write(KEYS.cart,cart); renderCart(); });
      row.append(info, remove); items.appendChild(row);
    });
  }

  renderFilters();
  $('sortCars')?.addEventListener('change', renderProducts);
  $('cartToggle')?.addEventListener('click', () => $('cartSection')?.scrollIntoView({behavior:'smooth'}));
  $('checkoutBtn')?.addEventListener('click', () => {
    if (!cart.length) { alert('Vui lòng thêm xe vào giỏ hàng trước khi đặt.'); return; }
    $('checkoutSection')?.scrollIntoView({behavior:'smooth'});
  });
  $('checkoutForm')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!cart.length) { alert('Giỏ hàng đang trống.'); return; }
    const total = cart.reduce((sum,p) => sum + Number(p.price)*p.qty, 0);
    const order = {
      id: 'DH' + Date.now(), createdAt: new Date().toISOString(), status: 'pending',
      customer: { name:$('buyerName').value.trim(), phone:$('buyerPhone').value.trim(), email:$('buyerEmail').value.trim(), address:$('buyerAddress').value.trim() },
      payment: $('paymentMethod').value, note:$('buyerNote').value.trim(),
      items: cart.map(p => ({id:p.id,name:p.name,price:Number(p.price),qty:p.qty})), total
    };
    const orders = read(KEYS.orders); orders.push(order); write(KEYS.orders, orders);
    cart = []; write(KEYS.cart, cart); renderCart();
    $('orderResult').hidden = false;
    $('orderResult').textContent = `Đặt hàng thành công! Mã đơn ${order.id}. Đơn hàng đã được lưu để xem trong trang quản trị.`;
    $('checkoutForm').reset();
  });
  $('contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const result = $('contactResult');
    if (result) result.textContent = 'Đã ghi nhận thông tin trên trang thử nghiệm. Chức năng gửi liên hệ lên máy chủ chưa được kết nối.';
    event.target.reset();
  });
  $('menuBtn')?.addEventListener('click', () => $('navMenu')?.classList.toggle('open'));
  window.addEventListener('storage', event => {
    if (event.key === KEYS.products) { products = read(KEYS.products, demoProducts).filter(p => p.active !== false); renderProducts(); }
    if (event.key === KEYS.categories) { categories = read(KEYS.categories, defaultCategories); renderFilters(); renderProducts(); }
    if (event.key === KEYS.cart) { cart = read(KEYS.cart); renderCart(); }
  });
  renderFilters(); renderProducts(); renderCart();
})();

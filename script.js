(() => {
const KEYS={products:'taiMotoProducts',orders:'taiMotoOrders',cart:'taiMotoCart',categories:'taiMotoCategories',news:'taiMotoNews',analytics:'taiMotoAnalytics'};
const $=id=>document.getElementById(id);
const read=(k,f=[])=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const money=v=>Number(v||0).toLocaleString('vi-VN')+' ₫';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const DEMO_NEWS=[
{id:'N001',title:'5 kinh nghiệm chọn mô tô phù hợp cho người mới',keyword:'kinh nghiệm chọn mô tô',slug:'5-kinh-nghiem-chon-mo-to-phu-hop-cho-nguoi-moi',metaDescription:'Tổng hợp 5 kinh nghiệm chọn mô tô cho người mới: nhu cầu, dung tích, chiều cao yên, chi phí vận hành và những điểm cần kiểm tra trước khi mua.',category:'Kinh nghiệm mô tô',cover:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',content:'<p>Chọn chiếc mô tô đầu tiên cần cân nhắc nhu cầu sử dụng, khả năng kiểm soát và ngân sách.</p><h2>Xác định nhu cầu sử dụng</h2><p>Hãy xác định bạn đi phố, đi tour hay sử dụng xe cho cả hai mục đích.</p>',status:'published',publishedAt:'2026-10-01T08:00:00.000Z',updatedAt:'2026-10-01T08:00:00.000Z'},
{id:'N002',title:'Mô tô Touring là gì? Những điều cần biết trước khi mua',keyword:'mô tô touring',slug:'mo-to-touring-la-gi-nhung-dieu-can-biet',metaDescription:'Tìm hiểu mô tô Touring, ưu điểm, nhược điểm và các tiêu chí quan trọng khi chọn xe để đi đường dài.',category:'Kiến thức xe',cover:'https://images.unsplash.com/photo-1558980394-0c7f7f3f0b5c?auto=format&fit=crop&w=1200&q=85',content:'<p>Mô tô Touring được thiết kế hướng đến những hành trình dài với tư thế lái thoải mái.</p><h2>Đặc điểm của xe Touring</h2><p>Xe thường có yên rộng, bình xăng lớn và nhiều trang bị hỗ trợ đường dài.</p>',status:'published',publishedAt:'2026-09-28T08:00:00.000Z',updatedAt:'2026-09-28T08:00:00.000Z'},
{id:'N003',title:'Checklist kiểm tra mô tô cũ trước khi xuống tiền',keyword:'kiểm tra mô tô cũ',slug:'checklist-kiem-tra-mo-to-cu-truoc-khi-mua',metaDescription:'Checklist kiểm tra mô tô cũ trước khi mua: giấy tờ, động cơ, khung sườn, phanh, lốp, điện và lịch sử bảo dưỡng.',category:'Tư vấn mua xe',cover:'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85',content:'<p>Mua mô tô cũ cần kiểm tra kỹ cả giấy tờ lẫn tình trạng thực tế của xe.</p><h2>Kiểm tra giấy tờ và nguồn gốc</h2><p>Đối chiếu thông tin xe, số khung, số máy và giấy tờ liên quan.</p>',status:'published',publishedAt:'2026-09-25T08:00:00.000Z',updatedAt:'2026-09-25T08:00:00.000Z'}
];
if(!localStorage.getItem(KEYS.news))write(KEYS.news,DEMO_NEWS);

const products=read(KEYS.products,[{id:'P1',name:'Sportbike cao cấp',price:520000000,type:'sport',year:'2024',image:'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85',description:'600–1000cc · Xe minh họa',active:true},{id:'P2',name:'Naked Bike mạnh mẽ',price:380000000,type:'naked',year:'2024',image:'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=85',description:'650–900cc · Xe minh họa',active:true}]).filter(p=>p.active!==false);
const categories=read(KEYS.categories,[{id:'sport',name:'Sportbike'},{id:'naked',name:'Naked Bike'},{id:'touring',name:'Touring'},{id:'other',name:'Khác'}]);
let cart=read(KEYS.cart), activeFilter='all';

function track(type,meta={}){const a=read(KEYS.analytics);const ua=navigator.userAgent;let browser='Khác';if(/Edg\//.test(ua))browser='Edge';else if(/Chrome\//.test(ua))browser='Chrome';else if(/Safari\//.test(ua)&&!/Chrome/.test(ua))browser='Safari';else if(/Firefox\//.test(ua))browser='Firefox';let device=/Mobi|Android/i.test(ua)?'Mobile':'Desktop';a.push({id:Date.now()+Math.random(),time:new Date().toISOString(),type,browser,device,path:location.pathname+location.hash,...meta});write(KEYS.analytics,a.slice(-5000))}
track('pageview');

function categoryLabel(id){return categories.find(c=>c.id===id)?.name||id||'Khác'}
function renderFilters(){const c=document.querySelector('.filters');if(!c)return;c.replaceChildren();[{id:'all',name:'Tất cả xe'},...categories].forEach(x=>{const b=document.createElement('button');b.className='filter '+(activeFilter===x.id?'active':'');b.textContent=x.name;b.onclick=()=>{activeFilter=x.id;renderFilters();renderProducts()};c.appendChild(b)})}
function renderProducts(){const g=$('carGrid');if(!g)return;let list=products.filter(p=>activeFilter==='all'||p.type===activeFilter);const s=$('sortCars')?.value;if(s==='low')list.sort((a,b)=>a.price-b.price);if(s==='high')list.sort((a,b)=>b.price-a.price);g.replaceChildren();list.forEach(p=>{const el=document.createElement('article');el.className='car-card';el.innerHTML=`<div class="car-image"><img src="${esc(p.image||'')}" alt="${esc(p.name)}"><span class="car-tag">${esc(categoryLabel(p.type))}</span></div><div class="car-info"><div class="muted">${esc(p.year||'')} | Nhập khẩu</div><h3>${esc(p.name)}</h3><p class="price">${money(p.price)}</p><div class="car-specs">${esc(p.description||'Thông tin đang cập nhật')}</div><button class="btn car-btn">Thêm vào giỏ</button></div>`;el.querySelector('button').onclick=()=>{const x=cart.find(i=>i.id===p.id);x?x.qty++:cart.push({id:p.id,name:p.name,price:+p.price,qty:1});write(KEYS.cart,cart);renderCart();track('add_to_cart',{productId:p.id})};g.appendChild(el)})}
function renderCart(){const box=$('cartItems');if(!box)return;const n=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);$('cartCount').textContent=n;$('cartTotal').textContent=money(total);$('checkoutSummary').textContent=cart.length?`Đơn hàng gồm ${n} sản phẩm, tổng cộng ${money(total)}.`:'Vui lòng thêm xe vào giỏ hàng.';box.replaceChildren();if(!cart.length){box.innerHTML='<p class="muted">Giỏ hàng đang trống.</p>';return}cart.forEach(i=>{const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<span>${esc(i.name)} × ${i.qty} — ${money(i.price*i.qty)}</span><button class="btn">Xóa</button>`;row.querySelector('button').onclick=()=>{cart=cart.filter(x=>x.id!==i.id);write(KEYS.cart,cart);renderCart()};box.appendChild(row)})}
function renderNews(){
 const g=$('newsGrid'); if(!g)return;
 const news=read(KEYS.news).filter(n=>n.status==='published')
   .sort((a,b)=>new Date(b.publishedAt||b.updatedAt||0)-new Date(a.publishedAt||a.updatedAt||0)).slice(0,6);
 g.replaceChildren();
 if(!news.length){g.innerHTML='<p class="muted">Chưa có bài viết.</p>';return}
 news.forEach(n=>{
   const el=document.createElement('article'); el.className='news-card';
   el.innerHTML=`<a href="#tin-tuc/${encodeURIComponent(n.slug)}">
     <div class="news-image"><img src="${esc(n.cover||'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85')}" alt="${esc(n.title)}"></div>
     <div class="news-info"><div class="news-meta">${esc(n.category||'Tin tức')} · ${new Date(n.publishedAt||n.updatedAt||Date.now()).toLocaleDateString('vi-VN')}</div>
     <h3>${esc(n.title)}</h3><p class="news-excerpt">${esc(n.excerpt||n.metaDescription||'')}</p></div></a>`;
   el.querySelector('a').onclick=()=>track('news_click',{slug:n.slug});
   g.appendChild(el);
 });
}

function setDocumentSEO(n){
 document.title=(n.title||'Tin tức Tài Moto')+' | Tài Moto';
 let desc=document.querySelector('meta[name="description"]');
 if(!desc){desc=document.createElement('meta');desc.name='description';document.head.appendChild(desc)}
 desc.content=n.metaDescription||n.excerpt||'Tin tức và kiến thức mô tô từ Tài Moto.';
 let canonical=document.querySelector('link[rel="canonical"]');
 if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}
 canonical.href=location.origin+location.pathname+'#tin-tuc/'+encodeURIComponent(n.slug);
}

function renderRelated(current){
 const box=$('relatedNews'); if(!box)return;
 const arr=read(KEYS.news).filter(n=>n.status==='published'&&n.slug!==current.slug)
   .sort((a,b)=>new Date(b.publishedAt||b.updatedAt||0)-new Date(a.publishedAt||a.updatedAt||0)).slice(0,3);
 box.innerHTML=arr.map(n=>`<article class="related-card"><a href="#tin-tuc/${encodeURIComponent(n.slug)}">
   <img src="${esc(n.cover||'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=85')}" alt="${esc(n.title)}">
   <div><h3>${esc(n.title)}</h3><span class="muted">${esc(n.category||'Tin tức')}</span></div></a></article>`).join('');
}

function showArticle(slugValue){
 const slugDecoded=decodeURIComponent(slugValue||'');
 const n=read(KEYS.news).find(x=>x.status==='published'&&x.slug===slugDecoded);
 if(!n){showHome();return}
 $('articlePage').classList.remove('hidden');
 document.querySelectorAll('main > section:not(#articlePage)').forEach(x=>x.classList.add('route-hidden'));
 $('articleTitle').textContent=n.title||'';
 $('articleCategory').textContent=n.category||'Tin tức';
 $('articleMeta').textContent=(n.category||'Tin tức')+' · '+new Date(n.publishedAt||n.updatedAt||Date.now()).toLocaleDateString('vi-VN');
 $('articleCover').src=n.cover||'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85';
 $('articleCover').alt=n.title||'';
 $('articleBody').innerHTML=n.content||'<p>Nội dung đang được cập nhật.</p>';
 renderRelated(n); setDocumentSEO(n); track('article_view',{slug:n.slug});
 window.scrollTo({top:0,behavior:'smooth'});
}

function showHome(){
 $('articlePage')?.classList.add('hidden');
 document.querySelectorAll('main > section.route-hidden').forEach(x=>x.classList.remove('route-hidden'));
 if(document.title!=='Tài Moto | Mô tô phân khối lớn chính hãng')document.title='Tài Moto | Mô tô phân khối lớn chính hãng';
 window.scrollTo({top:0,behavior:'smooth'});
}

function route(){
 const h=location.hash||'';
 const m=h.match(/^#tin-tuc\/(.+)$/);
 if(m)showArticle(m[1]); else showHome();
}
window.addEventListener('hashchange',route);
$('articleBack')?.addEventListener('click',()=>{location.hash='#news';});
$('copyArticleLink')?.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(location.href);alert('Đã sao chép liên kết bài viết.')}
 catch{alert('Không thể tự sao chép. Hãy sao chép URL trên thanh địa chỉ.')}
});

$('sortCars')?.addEventListener('change',renderProducts);
$('cartToggle')?.addEventListener('click',()=>{$('cartSection')?.scrollIntoView({behavior:'smooth'});track('cart_view')});
$('checkoutBtn')?.addEventListener('click',()=>{if(!cart.length)return alert('Vui lòng thêm xe vào giỏ hàng.');$('checkoutSection')?.scrollIntoView({behavior:'smooth'})});
$('checkoutForm')?.addEventListener('submit',e=>{e.preventDefault();if(!cart.length)return;const total=cart.reduce((s,x)=>s+x.price*x.qty,0),order={id:'DH'+Date.now(),createdAt:new Date().toISOString(),status:'pending',customer:{name:$('buyerName').value.trim(),phone:$('buyerPhone').value.trim(),email:$('buyerEmail').value.trim(),address:$('buyerAddress').value.trim()},payment:$('paymentMethod').value,note:$('buyerNote').value.trim(),items:cart,total};const orders=read(KEYS.orders);orders.push(order);write(KEYS.orders,orders);cart=[];write(KEYS.cart,cart);renderCart();$('orderResult').hidden=false;$('orderResult').textContent='Đặt hàng thành công! Mã đơn '+order.id;$('checkoutForm').reset();track('purchase',{orderId:order.id,value:total})});
$('contactForm')?.addEventListener('submit',e=>{e.preventDefault();$('contactResult').textContent='Đã ghi nhận yêu cầu tư vấn.';e.target.reset();track('contact_submit')});
$('menuBtn')?.addEventListener('click',()=>$('navMenu')?.classList.toggle('open'));
renderFilters();renderProducts();renderCart();renderNews();route();
})();
// Replace this with your real WhatsApp number in international format, digits only.
const WHATSAPP_NUMBER = "911234567890";

const products = [
  {id:1,name:"The Essential Tee",category:"Men",price:899,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Structured Overshirt",category:"Men",price:1899,tag:"NEW",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"Everyday Knit",category:"Women",price:1499,tag:"",image:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Relaxed Shirt",category:"Women",price:1299,tag:"NEW",image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Minimal Tote",category:"Accessories",price:799,tag:"",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Classic Layer",category:"Men",price:2199,tag:"",image:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Modern Essential",category:"Women",price:1699,tag:"",image:"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Daily Cap",category:"Accessories",price:599,tag:"",image:"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85"}
];
let cart = [];
const money = n => "₹" + n.toLocaleString("en-IN");
const grid = document.getElementById("productGrid");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function renderProducts(filter="All"){
  grid.innerHTML = products.filter(p=>filter==="All"||p.category===filter).map(p=>`
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
      <button class="add-button" onclick="addToCart(${p.id})">ADD TO BAG +</button></div>
      <div class="product-info"><div><p>${p.name}</p><p class="product-category">${p.category.toUpperCase()}</p></div><strong>${money(p.price)}</strong></div>
    </article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);const line=cart.find(x=>x.id===id);line?line.qty++:cart.push({...p,qty:1});renderCart();showToast("Added to your bag");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(item)item.qty+=delta;cart=cart.filter(x=>x.qty>0);renderCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);renderCart();}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("subtotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`
    <div class="cart-line"><img src="${x.image}" alt=""><div><strong>${x.name}</strong><p>${money(x.price)}</p><div class="qty"><button onclick="changeQty(${x.id},-1)">−</button>${x.qty}<button onclick="changeQty(${x.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${x.id})">✕</button></div>`).join(""):'<p class="empty">Your bag is currently empty.</p>';
}
function openCart(){drawer.classList.add("open");overlay.classList.add("show");drawer.setAttribute("aria-hidden","false");}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show");drawer.setAttribute("aria-hidden","true");}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800);}
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){showToast("Your bag is empty");return;}
  const lines=cart.map(x=>`${x.name} x ${x.qty} — ${money(x.price*x.qty)}`).join("\n");
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const message=`Hello AUREN! I'd like to place an order:\n\n${lines}\n\nSubtotal: ${money(total)}\n\nPlease confirm availability, size options, shipping and payment details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.filter);
}));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("nav").classList.toggle("show"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("show")));
renderProducts();renderCart();
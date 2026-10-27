import {product} from './data.js';
const key = 'puro-cart-v1';
export function readCart() {
  try {const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data.filter(x=>x.productId===product.id && product.demoOptions.some(o=>o.id===x.option) && Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=99):[];} catch {return [];}
}
export let cart=readCart();
export function saveCart(next){cart=next;try{localStorage.setItem(key,JSON.stringify(cart));}catch{/* Carrinho funciona em memória se o armazenamento estiver indisponível. */}}
export function addItem(option,quantity){const item=cart.find(x=>x.option===option);saveCart(item?cart.map(x=>x===item?{...x,quantity:Math.min(99,x.quantity+quantity)}:x):[...cart,{productId:product.id,option,quantity}]);}
export function setQuantity(option,quantity){saveCart(cart.map(x=>x.option===option?{...x,quantity}:x));}
export function removeItem(option){saveCart(cart.filter(x=>x.option!==option));}
export function count(){return cart.reduce((n,x)=>n+x.quantity,0);}
export function subtotal(){return cart.length===0?0:product.priceCents===null?null:cart.reduce((n,x)=>n+product.priceCents*x.quantity,0);}
export function money(cents){return cents===null?'A definir':new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(cents/100);}

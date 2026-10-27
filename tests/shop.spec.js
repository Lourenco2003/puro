import {test,expect} from '@playwright/test';
test('percurso completo da loja e carrinho',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:'À tua maneira.'})).toBeVisible();
 await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
 await expect.poll(()=>page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0))).toBeTruthy();
 await page.screenshot({path:`test-results/inicio-${info.project.name}.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('link',{name:'Descobrir a coleção'}).click();
 await expect(page.getByRole('heading',{name:'A coleção.'})).toBeVisible();
 await page.locator('.product-card').click();
 await page.getByRole('button',{name:'Adicionar ao carrinho'}).click();
 await expect(page.getByRole('alert').filter({hasText:'Seleciona uma opção'})).toBeVisible();
 await expect(page.locator('[name=size]').first()).toBeFocused();
 await page.getByLabel('Opção de teste 1',{exact:true}).check();
 await page.getByLabel('Quantidade',{exact:true}).fill('2');
 await page.getByRole('button',{name:'Ver imagem 2:',exact:false}).click();
 await expect(page.locator('#product-image')).toHaveAttribute('src','/images/puro-16.webp');
 await page.screenshot({path:`test-results/produto-${info.project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Adicionar ao carrinho'}).click();
 await expect(page.getByRole('dialog')).toContainText('Adicionado ao carrinho.');
 await page.getByRole('dialog').getByRole('link',{name:'Ver carrinho'}).click();
 await expect(page.locator('[data-quantity]')).toHaveValue('2');
 await page.locator('[data-quantity]').fill('3');await page.locator('[data-quantity]').press('Tab');
 await expect(page.locator('.cart-count')).toHaveText('3');
 await expect(page.locator('.summary strong')).toHaveText('A definir');
 await page.reload();await expect(page.locator('[data-quantity]')).toHaveValue('3');
 await page.getByRole('button',{name:'Finalizar compra'}).click();
 await expect(page.getByRole('dialog')).toContainText('Não foi criada nenhuma encomenda');
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Finalizar compra'})).toBeFocused();
 await page.getByRole('button',{name:'Remover',exact:true}).click();
 await expect(page.getByText('O teu carrinho está vazio.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});
test('menu, marca, informações e imagens válidas',async({page},info)=>{
 await page.goto('/');
 if(info.project.name==='telemovel'){
  await page.getByRole('button',{name:'Abrir menu'}).click();await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.locator('#mobile-menu')).toBeHidden();
  await page.getByRole('button',{name:'Abrir menu'}).click();await page.locator('#mobile-menu').getByRole('link',{name:'A PURO',exact:true}).click();
 } else await page.locator('.desktop-nav').getByRole('link',{name:'A PURO'}).click();
 await expect(page.getByRole('heading',{name:'Um espaço para seres tu.'})).toBeVisible();
 await page.getByRole('link',{name:'Envios',exact:true}).click();await expect(page.getByText('Condições, destinos, prazos e custos de envio: a definir.')).toBeVisible();
 await page.goto('/');await page.locator('.brand img').evaluate(im=>im.decode());
 await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
 const broken=await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})));return images.filter(i=>!i.naturalWidth).map(i=>i.src)});expect(broken).toEqual([]);
});
test('subtotal usa cêntimos quando existe preço confirmado',async({page})=>{
 await page.goto('/');
 const result=await page.evaluate(async()=>{
  const {product}=await import('/src/data.js');const c=await import('/src/cart.js');
  c.saveCart([]);const empty=c.subtotal();c.addItem('teste-1',2);const unknown=c.subtotal();
  // Valor sintético só dentro do teste; não é um preço publicado.
  product.priceCents=1234;const priced=c.subtotal();product.priceCents=null;c.saveCart([]);
  return {empty,unknown,priced};
 });expect(result).toEqual({empty:0,unknown:null,priced:2468});
});

/* eslint-disable @typescript-eslint/no-require-imports -- Test browser avviati con node --test. */
// Avviare prima il sito; MOBILE_TEST_URL può puntare anche a una build locale.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const baseURL = process.env.MOBILE_TEST_URL || 'http://localhost:3000';
let browser;
before(async () => { browser = await chromium.launch({ headless: true }); });
after(async () => { await browser?.close(); });

async function pagina(route, width = 390, height = 844, options = {}) {
  const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 1024, hasTouch: width < 1024, ...options });
  page.setDefaultTimeout(15000);
  await page.addInitScript(() => {
    sessionStorage.setItem('delsigel:porta-attraversata-v1', '1');
    localStorage.setItem('delsigel:consenso-cookie-v1', JSON.stringify({ scelta: 'rifiutato', scadenza: Date.now() + 86400000 }));
  });
  await page.goto(baseURL + route, { waitUntil: 'networkidle' });
  return page;
}

async function scorri(page, y) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(800); // Assestamento dello scrub, non solo del layout.
}

test('menu mobile: apertura, focus, uscita e link Prodotti funzionano', async () => {
  const page = await pagina('/it', 320, 568);
  try {
    await page.getByRole('button', { name: 'Apri il menu', exact: true }).click();
    await page.locator('#menu-delsigel').waitFor({ state: 'visible' });
    assert.equal(await page.locator('main').evaluate(e => e.inert), true);
    await page.keyboard.press('Escape');
    await page.locator('#menu-delsigel').waitFor({ state: 'hidden' });
    assert.equal(await page.getByRole('button', { name: 'Apri il menu', exact: true }).evaluate(e => e === document.activeElement), true);
    await page.getByRole('button', { name: 'Apri il menu', exact: true }).click();
    await page.locator('#menu-delsigel a').filter({ hasText: 'Prodotti' }).click();
    await page.locator('#menu-delsigel').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => Math.abs(document.querySelector('#catalogo').getBoundingClientRect().top) < 2);
    assert.equal(await page.locator('main').evaluate(e => e.inert), false);
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  } finally { await page.close(); }
});

test('home mobile: nessun overflow e pausa leggibile anche a 320×568', async () => {
  for (const [width, height] of [[320, 568], [390, 844]]) {
    const page = await pagina('/it', width, height);
    try {
      await page.waitForTimeout(800);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      const start = await page.locator('[data-scene-story-track]').evaluate(e => e.getBoundingClientRect().top + scrollY);
      await scorri(page, start + height * .8);
      const first = await page.locator('#storia').boundingBox();
      await scorri(page, start + height * 1.3);
      const second = await page.locator('#storia').boundingBox();
      assert.ok(Math.abs(first.y - second.y) < 2);
      assert.ok(Math.abs(second.y + second.height - height) < 2);
      assert.ok((await page.locator('#catalogo').boundingBox()).y >= height);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    } finally { await page.close(); }
  }
});

test('scheda prodotto: chiusura sempre visibile sopra il contenuto scorrevole', async () => {
  const page = await pagina('/it', 320, 568);
  try {
    const card = page.locator('#catalogo .card-catalogo button').first();
    await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(900); await card.click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });
    await dialog.locator('.overflow-y-auto').evaluate(e => { e.scrollTop = e.scrollHeight; });
    const close = dialog.getByRole('button', { name: /^Chiudi/ });
    await close.click({ trial: true }); // Aspetta che il pannello finisca l'ingresso.
    const box = await close.boundingBox();
    assert.ok(box.y >= 0 && box.y + box.height <= 568);
    assert.ok((await dialog.boundingBox()).width <= 320);
    await close.click(); await dialog.waitFor({ state: 'hidden' });
  } finally { await page.close(); }
});

test('Chi siamo: barra separata da immagini e testi, fallback sui viewport bassi', async () => {
  for (const [width, height] of [[390, 844], [768, 844], [1440, 900], [320, 568], [844, 390]]) {
    const page = await pagina('/it/chi-siamo', width, height);
    try {
      if (height < 800) {
        assert.equal(await page.locator('.history-sequence').isVisible(), false);
        assert.equal(await page.locator('.history-static').isVisible(), true);
        continue;
      }
      const track = await page.locator('[data-story-sequence]').evaluate(e => ({ top: e.getBoundingClientRect().top + scrollY, height: e.offsetHeight }));
      for (let chapter = 0; chapter < 6; chapter++) {
        await scorri(page, track.top + (track.height - height) * (chapter + .65) / 6);
        const status = await page.locator('[data-story-status]').boundingBox();
        const photo = await page.locator('[data-story-photos]').boundingBox();
        const copy = await page.locator('[data-story-copy] article').nth(chapter).boundingBox();
        assert.ok(photo.y + photo.height <= status.y + 1);
        assert.ok(copy.y + copy.height <= status.y + 1);
        assert.ok(copy.y >= (width < 768 ? photo.y + photo.height : 70) - 1);
      }
    } finally { await page.close(); }
  }
});

test('Contatti: font dei campi a 16 px, nessun precaricamento del catalogo', async () => {
  const page = await pagina('/it/contatti');
  try {
    assert.equal(await page.locator('#nome').evaluate(e => getComputedStyle(e).fontSize), '16px');
    const urls = await page.evaluate(() => performance.getEntriesByType('resource').filter(e => e.initiatorType === 'fetch').map(e => e.name));
    assert.ok(!urls.some(url => /products-4k|img\/configuratore|chi-siamo\/|Immagine/.test(url)), urls.join('\n'));
  } finally { await page.close(); }
});

test('preloader: apertura normale e uscita sicura senza bundle o JavaScript', async () => {
  for (const mode of ['normal', 'no-js', 'failed-js']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, javaScriptEnabled: mode !== 'no-js' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    try {
      if (mode === 'failed-js') await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
      await page.goto(baseURL + '/it/contatti', { waitUntil: 'networkidle' });
      await page.locator('.preloader-porta').waitFor({ state: 'hidden', timeout: 15000 });
      assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-preloader-attivo')), false);
      assert.notEqual(await page.evaluate(() => getComputedStyle(document.documentElement).overflow), 'hidden');
      assert.deepEqual(errors, []);
    } finally { await page.close(); }
  }
});

test('configuratore mobile: selezione ingredienti fino al prodotto completo', async () => {
  const page = await pagina('/it/configuratore');
  try {
    await page.locator('.tessera').first().click();
    await page.waitForFunction(() => document.querySelector('[data-livello]').dataset.livello === '3');
    await page.locator('.tessera').first().click();
    await page.waitForFunction(() => document.querySelector('[data-livello]').dataset.livello === '5');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  } finally { await page.close(); }
});

test('salati: pausa, catalogo espanso e ritorno restano utilizzabili', async () => {
  const page = await pagina('/it');
  try {
    const start = () => page.locator('.ponte-futuro').evaluate(e => e.getBoundingClientRect().top + scrollY);
    const clip = () => page.locator('[data-ponte-fondo]').evaluate(e => getComputedStyle(e).clipPath);
    await scorri(page, await start() + 400);
    assert.equal(await clip(), 'ellipse(85% 0% at 50% 102%)');
    const toggle = page.locator('[aria-controls="altri-salati"]');
    await toggle.click(); await page.waitForTimeout(800);
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await scorri(page, await start() + 400);
    assert.equal(await clip(), 'ellipse(85% 0% at 50% 102%)');
    await toggle.click(); await page.waitForTimeout(800);
    const closed = await start();
    await scorri(page, closed + 1100);
    assert.notEqual(await clip(), 'ellipse(85% 0% at 50% 102%)');
    await scorri(page, closed + 200);
    assert.equal(await clip(), 'ellipse(85% 0% at 50% 102%)');
  } finally { await page.close(); }
});

test('movimento ridotto: home e storia restano in flusso senza pause', async () => {
  const page = await pagina('/it', 390, 844, { reducedMotion: 'reduce' });
  try {
    assert.equal(await page.locator('[data-scene-mode]').getAttribute('data-scene-mode'), 'static');
    assert.equal(await page.locator('.ponte-corsa').isVisible(), false);
    await page.goto(baseURL + '/it/chi-siamo', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.history-sequence').isVisible(), false);
    assert.equal(await page.locator('.history-static').isVisible(), true);
  } finally { await page.close(); }
});

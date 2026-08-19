import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the e-TET hotsite", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(html, /<title>e-TET \| Estratificação de risco familiar<\/title>/i);
  assert.match(html, /Risco familiar calculado no ritmo real da visita/);
  assert.match(html, /Identidade visual para o trabalho de campo/);
  assert.match(html, /\/identity\/e-tet-logo\.png/);
  assert.match(html, /\/brand\/sus-stack\.svg/);
  assert.doesNotMatch(html, /\/identity\/camiseta-grupo\.png/);
  assert.match(html, /Menos dispersão, mais decisão no território/);
  assert.match(html, /Do login ao risco familiar em uma jornada única/);
  assert.doesNotMatch(html, /Interface organizada para apresentar o protótipo/);
  assert.match(html, /Instituições parceiras/);
  assert.match(html, /\/brand\/pet-saude\.png/);
  assert.match(html, /\/brand\/ucdb\.jpg/);
  assert.match(html, /\/brand\/sus-stack\.svg/);
  assert.match(html, /Simule a lógica da estratificação/);
  assert.match(html, /Abrir PDF horizontal/);
  assert.doesNotMatch(html, /Telas do produto/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("keeps the hotsite responsive styles and real content wired", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const appScreens = \[/);
  assert.match(page, /const flowSteps = \[/);
  assert.match(page, /const sentinelOptions = \[/);
  assert.match(page, /function PhoneMockup/);
  assert.match(page, /function PhoneScreen/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /type="checkbox"/);
  assert.match(page, /const brandLogos = \[/);
  assert.match(page, /footer-logos/);
  assert.match(page, /identity-logo/);
  assert.match(page, /telas recriadas com base no/);
  assert.doesNotMatch(page, /id="telas"/);
  assert.doesNotMatch(page, /screen-gallery/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/e-tet-hotsite\.gustavosandrade\.chatgpt\.site"\)/);
  assert.match(css, /--pet-orange/);
  assert.match(css, /--ucdb-blue/);
  assert.match(css, /--sesau-blue/);
  assert.match(css, /institution-strip/);
  assert.match(css, /footer-logos/);
  assert.match(css, /identity-section/);
  assert.match(css, /identity-logo/);
  assert.doesNotMatch(css, /shirt-showcase/);
  assert.match(css, /@media \(max-width: 1060px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /phone-glass/);
  assert.match(css, /phone-notch/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|codex-preview/);
});

test("keeps institutional logo assets available", async () => {
  await Promise.all([
    access(new URL("../public/brand/pet-saude.png", import.meta.url)),
    access(new URL("../public/brand/ucdb.jpg", import.meta.url)),
    access(new URL("../public/brand/sus.png", import.meta.url)),
    access(new URL("../public/identity/e-tet-logo.png", import.meta.url)),
  ]);
});

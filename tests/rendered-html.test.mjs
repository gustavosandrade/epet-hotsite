import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(html, /<title>e-TET \| Estratificacao de risco familiar<\/title>/i);
  assert.match(html, /e-TET: estratificacao de risco familiar mais simples para a APS/);
  assert.match(html, /O que hoje fica manual passa a ser guiado/);
  assert.match(html, /Do cadastro ao risco familiar/);
  assert.match(html, /Calculadora demonstrativa de risco/);
  assert.match(html, /Abrir guia completo/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("keeps the hotsite responsive styles and real content wired", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const flowSteps = \[/);
  assert.match(page, /const sentinelOptions = \[/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /type="checkbox"/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/e-tet-hotsite\.gustavosandrade\.chatgpt\.site"\)/);
  assert.match(css, /@media \(max-width: 1060px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|codex-preview/);
});

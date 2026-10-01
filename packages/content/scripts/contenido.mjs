// Regenera src/index.ts desde sinco-content-system (la fuente de verdad de las guías de voz, tono y estilo).
// Si esa carpeta no está junto al repo (otro equipo, CI), se conserva el archivo ya generado y no falla.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const paquete = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const constructor = resolve(paquete, "../../../sinco-content-system/build-assistant-prompt.mjs");
if (!existsSync(constructor)) {
  console.warn("sinco-content-system no está junto a este repo: se usa packages/content/src/index.ts tal como está.");
} else {
  execFileSync(process.execPath, [constructor, "--ts", resolve(paquete, "src/index.ts")], { stdio: "inherit" });
}

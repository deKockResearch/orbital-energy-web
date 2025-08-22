/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// from https://docs.sheetjs.com/docs/demos/static/astro
declare module '*.xlsx' { const data: string; export default data; }
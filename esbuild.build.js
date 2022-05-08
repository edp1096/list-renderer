// import { build } from 'esbuild'

require('esbuild').build({
    entryPoints: ["ts/list-renderer.ts"],
    bundle: true,
    outdir: "dist",
    minify: true,
    sourcemap: true,
    target: "es2020",
    // format: "cjs",
    format: "esm",
    // define: { "process.env.NODE_ENV": "production" }
    define: { "process.env.NODE_ENV": "developemnt" }
})

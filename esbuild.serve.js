// import { build } from 'esbuild'

require('esbuild').serve({
    servedir: './',
    host: "localhost",
    port: 8000,
}, {
    entryPoints: ["ts/list-renderer.ts"],
    bundle: true,
    // outdir: "dist",
    outfile: "dist/list-renderer.mjs",
    minify: true,
    sourcemap: true,
    target: "es2020",
    // format: "cjs",
    format: "esm",
    define: { "process.env.NODE_ENV": "developemnt" },
    // watch: true
})
    .then(() => console.log("Running server on http://localhost:8000"))
    .catch(() => process.exit(1))

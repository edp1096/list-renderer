import { build } from 'esbuild'

build({
    entryPoints: ["ts/list-renderer.ts"],
    bundle: true,
    outdir: "dist",
    minify: true,
    sourcemap: true,
    target: "es2020",
    format: "esm",
    define: { "process.env.NODE_ENV": "developemnt" },
    watch: true
})
    .then(() => console.log("Running esbuild.."))
    .catch(() => process.exit(1))

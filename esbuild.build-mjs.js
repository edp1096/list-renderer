import { build } from 'esbuild'

build({
    entryPoints: ["src/list-renderer.ts"],
    bundle: true,
    outfile: "dist/list-renderer.mjs",
    minify: true,
    sourcemap: true,
    target: "es2020",
    format: "esm",
    define: { "process.env.NODE_ENV": "production" },
    // define: { "process.env.NODE_ENV": "developemnt" },
})

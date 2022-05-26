// import { build } from 'esbuild'

require('esbuild').build({
    entryPoints: ["ts/list-renderer.ts"],
    bundle: true,
    outfile: "dist/list-renderer.js",
    minify: true,
    define: { "process.env.NODE_ENV": "production" },
    // define: { "process.env.NODE_ENV": "developemnt" },
})

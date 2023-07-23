import * as esbuild from "esbuild"
import htmlPlugin from '@chialab/esbuild-plugin-html';

import fs from "fs"
import { createServer, request } from "http"
import { spawn } from "child_process"

const serveDIR = "serve"
const clients = []
const port = 8000


const pluginRefresh = {
    name: 'refresh-plugin',
    setup(build) {
        build.onEnd(() => {
            fs.copyFileSync("html/index.html", `${serveDIR}/index.html`)
            clients.forEach((res) => res.write('data: update\n\n'))
            clients.length = 0
        })
    },
}

const ctxOptionHTML = {
    entryPoints: ["html/index.html"],
    bundle: false,
    outfile: `${serveDIR}/index.html`,
    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    minify: true,
    define: { "process.env.NODE_ENV": "'developemnt'" },
    plugins: [htmlPlugin(), pluginRefresh]
}

const ctxOption = {
    entryPoints: ["src/list-renderer.ts"],
    bundle: true,
    outfile: `${serveDIR}/list-renderer.js`,
    banner: { js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();' },
    minify: true,
    define: { "process.env.NODE_ENV": "'developemnt'" },
    plugins: [pluginRefresh]
}


if (!fs.existsSync(serveDIR)) { fs.mkdirSync(serveDIR) }

const ctxHTML = await esbuild.context({ ...ctxOptionHTML })
await ctxHTML.watch()

const ctx = await esbuild.context({ ...ctxOption })
await ctx.watch()

await ctx.serve({ servedir: `${serveDIR}/` }, {}).then(() => {
    createServer((req, res) => {
        const { url, method, headers } = req
        if (req.url === '/esbuild') {
            return clients.push(
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    Connection: 'keep-alive',
                })
            )
        }
        const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
        req.pipe(
            request({ hostname: '0.0.0.0', port: 8000, path, method, headers }, (prxRes) => {
                res.writeHead(prxRes.statusCode, prxRes.headers)
                prxRes.pipe(res, { end: true })
            }),
            { end: true }
        )
    }).listen(port)
}).then(() => {
    console.log(`Running server on http://localhost:${port}`)

    // Open browser
    setTimeout(() => {
        const op = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
        const ptf = process.platform
        if (clients.length === 0) spawn(op[ptf][0], [...[op[ptf].slice(1)], `http://localhost:${port}`])
    }, 250)

    process.on('SIGINT', () => {
        fs.rmSync("serve", { recursive: true })
        process.exit(0)
    })
})

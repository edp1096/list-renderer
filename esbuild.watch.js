import * as esbuild from "esbuild"
import htmlPlugin from '@chialab/esbuild-plugin-html';

import fs from "fs"
import { createServer, request } from "http"
import { spawn } from "child_process"

const serveDIR = "serve"
const clients = []
const ipaddr = "127.0.0.1"
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
    minify: false,
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
        const header = { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }
        if (req.url === '/esbuild') { return clients.push(res.writeHead(200, header)) }
        const path = ~url.split('/').pop().indexOf('.') ? url : `/index.html` //for PWA with router
        const requests = { hostname: ipaddr, port: port, path, method, headers }
        req.pipe(request(requests, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res, { end: true }) }), { end: true })
    }).listen(port)
}).then(() => {
    console.log(`Running server on http://${ipaddr}:${port}`)

    // Open browser
    setTimeout(() => {
        const shellCommands = { darwin: ['open'], linux: ['xdg-open'], win32: ['cmd', '/c', 'start'] }
        const currentOS = process.platform

        const cmd = shellCommands[currentOS][0]
        const options = [...[shellCommands[currentOS].slice(1)], `http://localhost:${port}`]

        if (clients.length === 0) { spawn(cmd, options) }
    }, 250)

    process.on('SIGINT', () => {
        fs.rmSync("serve", { recursive: true })
        process.exit(0)
    })
})

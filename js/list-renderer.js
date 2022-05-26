class ListRenderer {
    constructor(root) {
        this.root = root
        this.template = ""
        this.regexForVariables = /{{(.*?)}}/g
        this.loopDatas = {}

        this.baseTemplate = ""
    }

    evaluateString(cmd) { return new Function("'use strict'; return (" + cmd + ")")() }

    parseTemplate(el, dataName, loopName, idx) {
        if (typeof el != "object") { return null }

        const data = this.loopDatas[loopName][idx]

        let result = ""
        let condIF = el.getAttribute("lr-if")
        if (condIF != null) {
            let isShow = true

            for (const [k, v] of Object.entries(data)) {
                const tmpCondIF = condIF.replace(k, `"${v}"`)
                try { isShow = this.evaluateString(tmpCondIF) } catch (e) { continue }
                break
            }

            el.removeAttribute("lr-if")

            if ((isShow != null) && (!isShow)) {
                el.innerHTML = ""
                return el
            }
        }

        let condCLK = el.getAttribute("lr-click")
        if (condCLK != undefined) {
            condCLK = condCLK.replace("$index", idx)

            el.setAttribute("onclick", condCLK)
            el.removeAttribute("lr-click")
        }

        let condCHG = el.getAttribute("lr-change")
        if (condCHG != undefined) {
            condCHG = condCHG.replace("$index", idx)

            el.setAttribute("onchange", condCHG)
            el.removeAttribute("lr-change")
        }

        let dirID = el.getAttribute("lr-id")
        if (dirID != undefined) {
            dirID = dirID.replace("$index", idx)
            el.setAttribute("data-id", dirID)
            el.removeAttribute("lr-id")
        }

        if (el.children != undefined && el.children.length > 0) {
            let removeIDX = new Array()
            for (let i in el.children) {
                const child = this.parseTemplate(el.children[i], dataName, loopName, idx)
                if (child && child.innerHTML.trim() != "") { result += child.outerHTML }
            }

            el.innerHTML = ""
        } else {
            if (el.innerHTML != "") {
                el.innerHTML = el.innerHTML.replace(this.regexForVariables, (_, cmd) => {
                    let value = this.evaluateString(`${dataName}["${cmd}"]`)
                    if (value == undefined) { value = "" }
                    return value
                })
            }
        }

        if (result.length > 0) {
            el.innerHTML = result
        }

        return el
    }

    renderLoop() {
        this.template = this.root.innerHTML
        const c = this.root.children

        for (let i in c) {
            if ((c[i].nodeType != undefined) && (c[i].tagName.toLowerCase() != "script")) {
                const loopName = c[i].getAttribute("lr-loop")
                const loopData = this.evaluateString(loopName)
                this.loopDatas[loopName] = loopData

                this.baseTemplate = c[i].innerHTML
                let result = new Array()

                if (loopName != undefined) {
                    for (let j in loopData) {
                        c[i].innerHTML = this.baseTemplate

                        const child = this.parseTemplate(c[i], `${loopName}[${j}]`, loopName, j)
                        result.push(child.innerHTML)
                    }

                    c[i].innerHTML = result.join("").trim()
                    c[i].removeAttribute("lr-loop")
                }
            }
        }
    }

    render() { this.renderLoop() }

    restoreToTemplate() { this.root.innerHTML = this.template }

    reload() {
        this.restoreToTemplate()
        this.render()
    }
}

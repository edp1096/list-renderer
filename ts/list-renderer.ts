interface LoopDataType { [key: string]: LoopDataType }

class ListRenderer {
    root: HTMLElement
    template: string
    regexForVariables: RegExp
    loopVariableName: string
    loopDatas: LoopDataType
    baseTemplate: string
    singleTags: string[]

    constructor(root: HTMLElement) {
        this.root = root
        this.template = ""
        this.regexForVariables = /{{(.*?)}}/g
        this.loopDatas = {}
        this.loopVariableName = ""

        this.baseTemplate = ""
        this.singleTags = ["input", "img", "br", "hr", "link", "meta", "base", "area", "col", "embed", "keygen", "param", "source", "track", "wbr", "command"]
    }

    evaluateString(cmd: string): any { return new Function("'use strict'; return (" + cmd + ")")() }

    parseTemplate(el: Element, dataName: string, loopName: string, loopData: LoopDataType, idx: string): Element | null {
        if (typeof el != "object") { return null }

        // const data = this.loopDatas[loopName][idx]
        const data = loopData

        let result = ""
        let condIF = el.getAttribute("lr-if")
        if (condIF != null) {
            let isShow = true

            condIF = condIF.replace("$index", idx)

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

        let condCHK = el.getAttribute("lr-checked")
        if (condCHK != undefined) {
            condCHK = condCHK.replace("$index", idx)

            el.setAttribute("onchange", condCHK)
            el.removeAttribute("lr-change")
        }

        let dirID = el.getAttribute("lr-id")
        if (dirID != undefined) {
            dirID = dirID.replace("$index", idx)
            el.setAttribute("data-id", dirID)
            el.removeAttribute("lr-id")
        }

        if (el.children != undefined && el.children.length > 0) {
            for (let i in el.children) {
                const child = this.parseTemplate(el.children[i], dataName, loopName, data, idx)
                if (child) {
                    switch (true) {
                        case this.singleTags.includes(child.tagName.toLowerCase()):
                            result += child.outerHTML
                            break
                        case (child.innerHTML.trim() != ""):
                            result += child.outerHTML
                            break
                        default:
                            break
                    }
                }
            }

            el.innerHTML = ""
        } else {
            if (el.innerHTML != "" || this.singleTags.includes(el.tagName.toLowerCase())) {
                const attrs = el.getAttributeNames()
                for (let k in attrs) {
                    let attrValue = el.getAttribute(attrs[k])
                    if (attrValue == null) { continue }

                    // console.log("attr::", k, attrValue, el.tagName.toLowerCase())

                    attrValue = attrValue.replace("$index", idx)
                    attrValue = attrValue.replace(this.regexForVariables, (_: string, val: string) => {
                        let value = this.evaluateString(`${dataName}["${val}"]`)
                        if (value == undefined) { value = "" }
                        return value
                    })

                    el.setAttribute(attrs[k], attrValue.replace("$index", idx))
                }

                if (!this.singleTags.includes(el.tagName.toLowerCase())) {
                    el.innerHTML = el.innerHTML.replace(this.regexForVariables, (_: string, cmd: string) => {
                        let value = this.evaluateString(`${dataName}["${cmd}"]`)
                        if (value == undefined) { value = "" }
                        return value
                    })
                }
            }
        }

        if (result.length > 0) {
            el.innerHTML = result
        }

        return el
    }

    renderLoop(el: Element): void {
        if ((el.nodeType != undefined) && (el.tagName.toLowerCase() != "script")) {
            const loopName: string | null = el.getAttribute("lr-loop")
            if (loopName == undefined || loopName == null) { return }

            const loopData: LoopDataType = this.evaluateString(loopName)
            this.loopDatas[loopName] = loopData

            this.baseTemplate = el.innerHTML

            let result: string[] = new Array()

            if (loopName != undefined) {
                for (let j in loopData) {
                    el.innerHTML = this.baseTemplate

                    const child = this.parseTemplate(el, `${loopName}[${j}]`, loopName, loopData, j)
                    if (child == null) { continue }
                    result.push(child.innerHTML)
                }

                el.innerHTML = result.join("").trim()

                if (el.tagName.toLowerCase() == "list-renderer") { this.loopVariableName = loopName }
                el.removeAttribute("lr-loop")
            }
        }
    }

    render(): void {
        this.template = this.root.innerHTML

        switch (this.root.tagName.toLowerCase()) {
            case "list-renderer":
                this.renderLoop(this.root)
                // this.root.outerHTML = this.root.innerHTML
                break
            default:
                const c = this.root.children
                for (let i in c) { this.renderLoop(c[i]) }
                break
        }
    }

    restoreToTemplate(): void {
        if (this.root.tagName.toLowerCase() == "list-renderer") { this.root.setAttribute("lr-loop", this.loopVariableName) }
        this.root.innerHTML = this.template
    }

    reload(): void {
        this.restoreToTemplate()
        this.render()
    }
}

(globalThis as any).ListRenderer = ListRenderer
globalThis.customElements.define('list-renderer', class extends HTMLElement { })

export default ListRenderer

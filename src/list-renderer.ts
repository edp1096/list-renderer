interface LoopDataType { [key: string]: LoopDataType }

class ListRenderer {
    root: HTMLElement
    template: string
    regexForVariables: RegExp
    loopVariableName: string
    loopDatas: LoopDataType
    baseTemplate: string
    singleTags: string[]
    allowEmptyTags: string[]

    constructor(root: HTMLElement) {
        this.root = root
        this.template = ""
        this.regexForVariables = /{{(.*?)}}/g
        this.loopDatas = {}
        this.loopVariableName = ""

        this.baseTemplate = ""
        this.singleTags = ["input", "img", "br", "hr", "link", "meta", "base", "area", "col", "embed", "keygen", "param", "source", "track", "wbr", "command"]
        this.allowEmptyTags = ["div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "table", "tr", "td", "th", "thead", "tbody", "tfoot", "caption", "colgroup", "dl", "dt", "dd", "figure", "figcaption", "fieldset", "legend", "label", "select", "option", "optgroup", "button", "textarea", "pre", "code", "blockquote", "q", "cite", "ins", "del", "abbr", "acronym", "address", "bdo", "bdi", "q", "ruby", "rt", "rp", "iframe", "map", "area", "audio", "video", "canvas", "noscript", "script", "style"]
    }

    evaluateString(cmd: string): any { return new Function("'use strict'; return (" + cmd + ")")() }

    parseTemplate(el: Element, dataName: string, loopData: LoopDataType, idx: string): Element | null {
        if (typeof el != "object") { return null }

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
            if ((isShow != null) && (!isShow)) { return null }
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

        let dirCLASS = el.getAttribute("lr-class")
        if (dirCLASS != undefined) {
            dirCLASS = dirCLASS.replace("$index", idx)

            let classATTR = el.getAttribute("class")
            if (classATTR == null) { classATTR = "" }
            dirCLASS = dirCLASS.replace(this.regexForVariables, (_: string, val: string) => {
                let value = this.evaluateString(`${dataName}["${val}"]`)
                if (value == undefined || value == null) { value = "" }

                return value
            })

            if (dirCLASS == null) { dirCLASS = "" }

            el.setAttribute("class", `${classATTR} ${dirCLASS}`)
            el.removeAttribute("lr-class")
        }

        if (el.children != undefined && el.children.length > 0) {
            for (let j in el.childNodes) {
                switch (el.childNodes[j].nodeType) {
                    case Node.TEXT_NODE:
                        if (el.childNodes[j].textContent?.trim() != "") {
                            let text = el.childNodes[j].textContent?.trim()

                            if (text == undefined) { continue }
                            text = text.replace("$index", idx)
                            text = text.replace(this.regexForVariables, (_: string, val: string) => {
                                let value = this.evaluateString(`${dataName}["${val}"]`)
                                if (value == undefined || value == null) { value = "" }

                                return value
                            })

                            result += text
                        }

                        break
                    case Node.ELEMENT_NODE:
                        const child = this.parseTemplate((el.childNodes[j] as Element), dataName, data, idx)
                        if (child) {
                            switch (true) {
                                case this.singleTags.includes(child.tagName.toLowerCase()):
                                    result += child.outerHTML

                                    break
                                case this.allowEmptyTags.includes(child.tagName.toLowerCase()):
                                    result += child.outerHTML

                                    break
                                case (child.innerHTML.trim() != ""):
                                    result += child.outerHTML

                                    break
                                default:

                                    break
                            }
                        }

                        break
                    default:

                        break
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
                        if (value == undefined || value == null) { value = "" }

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

        if (result.length > 0) { el.innerHTML = result }

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

                    const child = this.parseTemplate(el, `${loopName}[${j}]`, loopData[j], j)
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

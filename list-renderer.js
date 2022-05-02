class ListRenderer {
    constructor(root) {
        this.root = root
        this.template = ""
        this.templates = new Array()
        this.lrEvents = new Array()
    }

    evaluateString(cmd) { return new Function("'use strict'; return (" + cmd + ")")() }

    prepareEvents(els) {
        let result = new Array()

        for (const el of els) {
            let lrCLKs = new Array()
            if (el.children.length > 0) {
                lrCLKs = this.prepareEvents(el.children)
                if (lrCLKs.length > 0) { result = result.concat(lrCLKs) }
            }

            lrCLKs = el.getAttribute("lr-click")
            if (lrCLKs != undefined && lrCLKs != null) {
                result = result.concat(lrCLKs)
                el.setAttribute("onclick", lrCLKs)
                el.removeAttribute("lr-click")
            }
        }

        return result
    }

    findAndSetList() {
        this.templates = new Array()

        const conds = new Array()
        const events = new Array()
        const variableMatchesList = new Array()
        const c = this.root.children
        const regexForVariables = /{{(.*?)}}/g

        for (const i in c) {
            if ((c[i].nodeType != undefined) && (c[i].tagName.toLowerCase() != "script")) {
                const arrayName = c[i].getAttribute("lr-loop")
                const arrayDatas = this.evaluateString(arrayName)

                if (arrayName != undefined) {
                    this.template = c[i].outerHTML.trim()

                    const lrCLKs = this.prepareEvents(c[i].children)

                    for (const j in c[i].children) {
                        const tpl = c[i].children[j]
                        if (tpl.outerHTML != undefined) {
                            conds.push(tpl.getAttribute("lr-if"))

                            tpl.removeAttribute("lr-if")
                            this.templates.push(tpl.outerHTML.trim())
                            variableMatchesList.push(this.templates[this.templates.length - 1].match(regexForVariables))
                        }
                    }

                    c[i].innerHTML = ""

                    for (const idx in arrayDatas) {
                        const arrayData = arrayDatas[idx]

                        const lrCLKsChange = new Array()
                        for (const j in lrCLKs) {
                            const lrCLK = lrCLKs[j]
                            const lrCLKChange = lrCLK.replace("$index", idx)
                            lrCLKsChange.push(lrCLKChange)
                        }

                        for (const k in this.templates) {
                            let isInsert = true
                            let dataChanged = this.templates[k]

                            for (const l in lrCLKsChange) {
                                const lrCLKChange = lrCLKsChange[l]
                                dataChanged = dataChanged.replace(lrCLKs[l], lrCLKChange)
                            }

                            const variableMatches = variableMatchesList[k]

                            for (const l in variableMatches) {
                                const variableMatch = variableMatches[l]
                                const tplVarName = variableMatch.replace(regexForVariables, "$1")

                                if ((conds[k] != null) && (conds[k].indexOf(tplVarName) != -1)) {
                                    const condition = conds[k].replace(tplVarName, "'" + arrayData[tplVarName] + "'")
                                    isInsert = this.evaluateString(condition)
                                }

                                if (!isInsert) {
                                    dataChanged = ""
                                    break
                                }

                                let tplVarValue = arrayData[tplVarName]
                                if (tplVarValue == undefined) { tplVarValue = "" }
                                dataChanged = dataChanged.replace(variableMatch, tplVarValue)
                                if (tplVarValue != undefined) { dataChanged = dataChanged.replace(variableMatch, tplVarValue) }
                            }

                            c[i].innerHTML += dataChanged
                        }

                    }
                }
            }
        }
    }

    render() { this.findAndSetList() }

    restoreToTemplate() { this.root.innerHTML = this.template }

    reload() {
        this.restoreToTemplate()
        this.render()
    }
}

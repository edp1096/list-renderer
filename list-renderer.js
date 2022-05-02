class ListRenderer {
    constructor(root) {
        this.root = root
        this.template = ""
        this.templates = new Array()
    }

    evaluateString(cmd) { return new Function("'use strict'; return (" + cmd + ")")() }

    findAndSetList() {
        this.templates = new Array()

        const conds = new Array()
        const variableMatchesList = new Array()
        const c = this.root.children
        const regexForVariables = /{{(.*?)}}/g

        for (const i in c) {
            if ((c[i].nodeType != undefined) && (c[i].tagName.toLowerCase() != "script")) {
                const arrayName = c[i].getAttribute("lr-loop")
                const arrayData = this.evaluateString(arrayName)

                if (arrayName != undefined) {
                    this.template = c[i].outerHTML.trim()

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

                    for (const j in arrayData) {

                        for (const k in this.templates) {
                            let isInsert = true
                            let dataChanged = this.templates[k]
                            const variableMatches = variableMatchesList[k]

                            for (const l in variableMatches) {
                                const variableMatch = variableMatches[l]
                                const tplVarName = variableMatch.replace(regexForVariables, "$1")

                                if ((conds[k] != null) && (conds[k].indexOf(tplVarName) != -1)) {
                                    const condition = conds[k].replace(tplVarName, "'" + arrayData[j][tplVarName] + "'")
                                    isInsert = this.evaluateString(condition)
                                }

                                if (!isInsert) {
                                    dataChanged = ""
                                    break
                                }

                                let tplVarValue = arrayData[j][tplVarName]
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

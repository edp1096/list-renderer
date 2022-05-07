class ListRenderer {
    root: HTMLElement
    template: string
    dataForDisplay: string[]

    constructor(root: HTMLElement) {
        this.root = root
        this.template = ""
        this.dataForDisplay = new Array()
    }

    evaluateString(cmd: string): any { return new Function("'use strict'; return (" + cmd + ")")() }

    prepareEvents(els: HTMLCollection): string[] {
        let result: string[] = new Array()

        for (const el of els) {
            let lrCLKs: string[] = new Array()
            if (el.children.length > 0) {
                lrCLKs = this.prepareEvents(el.children)
                if (lrCLKs.length > 0) { result = result.concat(lrCLKs) }
            }

            const clickCMD: string = el.getAttribute("lr-click")
            if (clickCMD != undefined && clickCMD != null) {
                result = result.concat(clickCMD)

                // Because js do shallow copy so, not need to return changed attributes of elements
                // structuredClone cannot be used because HTMLCollection object could not be cloned
                el.setAttribute("onclick", clickCMD)
                el.removeAttribute("lr-click")
            }
        }

        return result
    }

    findAndSetList() {
        this.dataForDisplay = new Array()

        const conds: string[] = new Array()
        const variableMatchesList: string[][] = new Array()
        const c: HTMLCollection = this.root.children
        const regexForVariables: RegExp = /{{(.*?)}}/g

        for (const i in c) {
            if ((c[i].nodeType != undefined) && (c[i].tagName.toLowerCase() != "script")) {
                const listName: string = c[i].getAttribute("lr-loop")
                const listDatas: string[] = this.evaluateString(listName)

                if (listName != undefined) {
                    this.template = c[i].outerHTML.trim()
                    const lrCLKs: string[] = this.prepareEvents(c[i].children)

                    for (const j in c[i].children) {
                        const tpl: Element = c[i].children[j]
                        if (tpl.outerHTML != undefined) {
                            conds.push(tpl.getAttribute("lr-if"))

                            tpl.removeAttribute("lr-if")
                            this.dataForDisplay.push(tpl.outerHTML.trim())
                            variableMatchesList.push(this.dataForDisplay[this.dataForDisplay.length - 1].match(regexForVariables))
                        }
                    }

                    c[i].innerHTML = ""

                    for (const idx in listDatas) {
                        const listData: string = listDatas[idx]

                        const lrCLKsChange: string[] = new Array()
                        for (const j in lrCLKs) {
                            const lrCLK = lrCLKs[j]
                            const lrCLKChange = lrCLK.replace("$index", idx)
                            lrCLKsChange.push(lrCLKChange)
                        }

                        for (const k in this.dataForDisplay) {
                            let isInsert: boolean = true
                            let dataChanged: string = this.dataForDisplay[k]

                            for (const l in lrCLKsChange) {
                                const lrCLKChange = lrCLKsChange[l]
                                dataChanged = dataChanged.replace(lrCLKs[l], lrCLKChange)
                            }

                            const variableMatches: string[] = variableMatchesList[k]

                            for (const l in variableMatches) {
                                const variableMatch: string = variableMatches[l]
                                const tplVarName: string = variableMatch.replace(regexForVariables, "$1")

                                if ((conds[k] != null) && (conds[k].indexOf(tplVarName) != -1)) {
                                    const condition = conds[k].replace(tplVarName, "'" + listData[tplVarName] + "'")
                                    isInsert = this.evaluateString(condition)
                                }

                                if (!isInsert) {
                                    dataChanged = ""
                                    break
                                }

                                let tplVarValue = listData[tplVarName]
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

export { ListRenderer }
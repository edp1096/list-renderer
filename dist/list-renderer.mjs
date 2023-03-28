var T=class{constructor(e){this.root=e,this.template="",this.regexForVariables=/{{(.*?)}}/g,this.loopDatas={},this.loopVariableName="",this.baseTemplate="",this.singleTags=["input","img","br","hr","link","meta","base","area","col","embed","keygen","param","source","track","wbr","command"],this.allowEmptyTags=["div","span","p","h1","h2","h3","h4","h5","h6","ul","ol","li","table","tr","td","th","thead","tbody","tfoot","caption","colgroup","dl","dt","dd","figure","figcaption","fieldset","legend","label","select","option","optgroup","button","textarea","pre","code","blockquote","q","cite","ins","del","abbr","acronym","address","bdo","bdi","q","ruby","rt","rp","iframe","map","area","audio","video","canvas","noscript","script","style"]}evaluateString(e){return new Function("'use strict'; return ("+e+")")()}parseTemplate(e,i,d,a){if(typeof e!="object")return null;let c=d,o="",g=e.getAttribute("lr-if");if(g!=null){let r=!0;g=g.replace("$index",a);for(let[n,t]of Object.entries(c)){let s=g.replace(n,`"${t}"`);try{r=this.evaluateString(s)}catch{continue}break}if(e.removeAttribute("lr-if"),r!=null&&!r)return null}let p=e.getAttribute("lr-click");p!=null&&(p=p.replace("$index",a),e.setAttribute("onclick",p),e.removeAttribute("lr-click"));let h=e.getAttribute("lr-change");h!=null&&(h=h.replace("$index",a),e.setAttribute("onchange",h),e.removeAttribute("lr-change"));let b=e.getAttribute("lr-checked");b!=null&&(b=b.replace("$index",a),e.setAttribute("onchange",b),e.removeAttribute("lr-change"));let f=e.getAttribute("lr-id");f!=null&&(f=f.replace("$index",a),e.setAttribute("data-id",f),e.removeAttribute("lr-id"));let u=e.getAttribute("lr-class");if(u!=null){u=u.replace("$index",a);let r=e.getAttribute("class");r==null&&(r=""),u=u.replace(this.regexForVariables,(n,t)=>{let s=this.evaluateString(`${i}["${t}"]`);return(s==null||s==null)&&(s=""),s}),u==null&&(u=""),e.setAttribute("class",`${r} ${u}`),e.removeAttribute("lr-class")}if(e.children!=null&&e.children.length>0){for(let r in e.childNodes)switch(e.childNodes[r].nodeType){case Node.TEXT_NODE:if(e.childNodes[r].textContent?.trim()!=""){let t=e.childNodes[r].textContent?.trim();if(t==null)continue;t=t.replace("$index",a),t=t.replace(this.regexForVariables,(s,m)=>{let l=this.evaluateString(`${i}["${m}"]`);return(l==null||l==null)&&(l=""),l}),o+=t}break;case Node.ELEMENT_NODE:let n=this.parseTemplate(e.childNodes[r],i,c,a);if(n)switch(!0){case this.singleTags.includes(n.tagName.toLowerCase()):o+=n.outerHTML;break;case this.allowEmptyTags.includes(n.tagName.toLowerCase()):o+=n.outerHTML;break;case n.innerHTML.trim()!="":o+=n.outerHTML;break;default:break}break;default:break}e.innerHTML=""}else if(e.innerHTML!=""||this.singleTags.includes(e.tagName.toLowerCase())){let r=e.getAttributeNames();for(let n in r){let t=e.getAttribute(r[n]);t!=null&&(t=t.replace("$index",a),t=t.replace(this.regexForVariables,(s,m)=>{let l=this.evaluateString(`${i}["${m}"]`);return(l==null||l==null)&&(l=""),l}),e.setAttribute(r[n],t.replace("$index",a)))}this.singleTags.includes(e.tagName.toLowerCase())||(e.innerHTML=e.innerHTML.replace(this.regexForVariables,(n,t)=>{let s=this.evaluateString(`${i}["${t}"]`);return s==null&&(s=""),s}))}return o.length>0&&(e.innerHTML=o),e}renderLoop(e){if(e.nodeType!=null&&e.tagName.toLowerCase()!="script"){let i=e.getAttribute("lr-loop");if(i==null||i==null)return;let d=this.evaluateString(i);this.loopDatas[i]=d,this.baseTemplate=e.innerHTML;let a=new Array;if(i!=null){for(let c in d){e.innerHTML=this.baseTemplate;let o=this.parseTemplate(e,`${i}[${c}]`,d[c],c);o!=null&&a.push(o.innerHTML)}e.innerHTML=a.join("").trim(),e.tagName.toLowerCase()=="list-renderer"&&(this.loopVariableName=i),e.removeAttribute("lr-loop")}}}render(){switch(this.template=this.root.innerHTML,this.root.tagName.toLowerCase()){case"list-renderer":this.renderLoop(this.root);break;default:let e=this.root.children;for(let i in e)this.renderLoop(e[i]);break}}restoreToTemplate(){this.root.tagName.toLowerCase()=="list-renderer"&&this.root.setAttribute("lr-loop",this.loopVariableName),this.root.innerHTML=this.template}reload(){this.restoreToTemplate(),this.render()}};globalThis.ListRenderer=T;globalThis.customElements.define("list-renderer",class extends HTMLElement{});var A=T;export{A as default};
//# sourceMappingURL=list-renderer.mjs.map

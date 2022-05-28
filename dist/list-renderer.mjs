var b=class{constructor(e){this.root=e,this.template="",this.regexForVariables=/{{(.*?)}}/g,this.loopDatas={},this.loopVariableName="",this.baseTemplate="",this.singleTags=["input","img","br","hr","link","meta","base","area","col","embed","keygen","param","source","track","wbr","command"]}evaluateString(e){return new Function("'use strict'; return ("+e+")")()}parseTemplate(e,t,o,u,r){if(typeof e!="object")return null;let l=u,c="",d=e.getAttribute("lr-if");if(d!=null){let a=!0;d=d.replace("$index",r);for(let[i,n]of Object.entries(l)){let s=d.replace(i,`"${n}"`);try{a=this.evaluateString(s)}catch{continue}break}if(e.removeAttribute("lr-if"),a!=null&&!a)return e.innerHTML="",e}let g=e.getAttribute("lr-click");g!=null&&(g=g.replace("$index",r),e.setAttribute("onclick",g),e.removeAttribute("lr-click"));let p=e.getAttribute("lr-change");p!=null&&(p=p.replace("$index",r),e.setAttribute("onchange",p),e.removeAttribute("lr-change"));let h=e.getAttribute("lr-checked");h!=null&&(h=h.replace("$index",r),e.setAttribute("onchange",h),e.removeAttribute("lr-change"));let m=e.getAttribute("lr-id");if(m!=null&&(m=m.replace("$index",r),e.setAttribute("data-id",m),e.removeAttribute("lr-id")),e.children!=null&&e.children.length>0){for(let a in e.children){let i=this.parseTemplate(e.children[a],t,o,l,r);if(i)switch(!0){case this.singleTags.includes(i.tagName.toLowerCase()):c+=i.outerHTML;break;case i.innerHTML.trim()!="":c+=i.outerHTML;break;default:break}}e.innerHTML=""}else if(e.innerHTML!=""||this.singleTags.includes(e.tagName.toLowerCase())){let a=e.getAttributeNames();for(let i in a){let n=e.getAttribute(a[i]);n!=null&&(n=n.replace("$index",r),n=n.replace(this.regexForVariables,(s,T)=>{let f=this.evaluateString(`${t}["${T}"]`);return f==null&&(f=""),f}),e.setAttribute(a[i],n.replace("$index",r)))}this.singleTags.includes(e.tagName.toLowerCase())||(e.innerHTML=e.innerHTML.replace(this.regexForVariables,(i,n)=>{let s=this.evaluateString(`${t}["${n}"]`);return s==null&&(s=""),s}))}return c.length>0&&(e.innerHTML=c),e}renderLoop(e){if(e.nodeType!=null&&e.tagName.toLowerCase()!="script"){let t=e.getAttribute("lr-loop");if(t==null||t==null)return;let o=this.evaluateString(t);this.loopDatas[t]=o,this.baseTemplate=e.innerHTML;let u=new Array;if(t!=null){for(let r in o){e.innerHTML=this.baseTemplate;let l=this.parseTemplate(e,`${t}[${r}]`,t,o,r);l!=null&&u.push(l.innerHTML)}e.innerHTML=u.join("").trim(),e.tagName.toLowerCase()=="list-renderer"&&(this.loopVariableName=t),e.removeAttribute("lr-loop")}}}render(){switch(this.template=this.root.innerHTML,this.root.tagName.toLowerCase()){case"list-renderer":this.renderLoop(this.root);break;default:let e=this.root.children;for(let t in e)this.renderLoop(e[t]);break}}restoreToTemplate(){this.root.tagName.toLowerCase()=="list-renderer"&&this.root.setAttribute("lr-loop",this.loopVariableName),this.root.innerHTML=this.template}reload(){this.restoreToTemplate(),this.render()}};globalThis.ListRenderer=b;globalThis.customElements.define("list-renderer",class extends HTMLElement{});var A=b;export{A as default};
//# sourceMappingURL=list-renderer.mjs.map

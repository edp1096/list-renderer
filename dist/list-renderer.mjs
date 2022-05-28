var b=class{constructor(e){this.root=e,this.template="",this.regexForVariables=/{{(.*?)}}/g,this.loopDatas={},this.loopVariableName="",this.baseTemplate="",this.singleTags=["input","img","br","hr","link","meta","base","area","col","embed","keygen","param","source","track","wbr","command"]}evaluateString(e){return new Function("'use strict'; return ("+e+")")()}parseTemplate(e,t,l,r){if(typeof e!="object")return null;let u=this.loopDatas[l][r],s="",c=e.getAttribute("lr-if");if(c!=null){let a=!0;c=c.replace("$index",r);for(let[i,n]of Object.entries(u)){let o=c.replace(i,`"${n}"`);try{a=this.evaluateString(o)}catch{continue}break}if(e.removeAttribute("lr-if"),a!=null&&!a)return e.innerHTML="",e}let g=e.getAttribute("lr-click");g!=null&&(g=g.replace("$index",r),e.setAttribute("onclick",g),e.removeAttribute("lr-click"));let d=e.getAttribute("lr-change");d!=null&&(d=d.replace("$index",r),e.setAttribute("onchange",d),e.removeAttribute("lr-change"));let h=e.getAttribute("lr-checked");h!=null&&(h=h.replace("$index",r),e.setAttribute("onchange",h),e.removeAttribute("lr-change"));let p=e.getAttribute("lr-id");if(p!=null&&(p=p.replace("$index",r),e.setAttribute("data-id",p),e.removeAttribute("lr-id")),e.children!=null&&e.children.length>0){for(let a in e.children){let i=this.parseTemplate(e.children[a],t,l,r);if(i)switch(!0){case this.singleTags.includes(i.tagName.toLowerCase()):s+=i.outerHTML;break;case i.innerHTML.trim()!="":s+=i.outerHTML;break;default:break}}e.innerHTML=""}else if(e.innerHTML!=""||this.singleTags.includes(e.tagName.toLowerCase())){let a=e.getAttributeNames();for(let i in a){let n=e.getAttribute(a[i]);n!=null&&(n=n.replace("$index",r),n=n.replace(this.regexForVariables,(o,f)=>{let m=this.evaluateString(`${t}["${f}"]`);return m==null&&(m=""),m}),e.setAttribute(a[i],n.replace("$index",r)))}this.singleTags.includes(e.tagName.toLowerCase())||(e.innerHTML=e.innerHTML.replace(this.regexForVariables,(i,n)=>{let o=this.evaluateString(`${t}["${n}"]`);return o==null&&(o=""),o}))}return s.length>0&&(e.innerHTML=s),e}renderLoop(e){if(e.nodeType!=null&&e.tagName.toLowerCase()!="script"){let t=e.getAttribute("lr-loop");if(t==null||t==null)return;let l=this.evaluateString(t);this.loopDatas[t]=l,this.baseTemplate=e.innerHTML;let r=new Array;if(t!=null){for(let u in l){e.innerHTML=this.baseTemplate;let s=this.parseTemplate(e,`${t}[${u}]`,t,u);s!=null&&r.push(s.innerHTML)}e.innerHTML=r.join("").trim(),e.tagName.toLowerCase()=="list-renderer"&&(this.loopVariableName=t),e.removeAttribute("lr-loop")}}}render(){switch(this.template=this.root.innerHTML,this.root.tagName.toLowerCase()){case"list-renderer":this.renderLoop(this.root);break;default:let e=this.root.children;for(let t in e)this.renderLoop(e[t]);break}}restoreToTemplate(){this.root.tagName.toLowerCase()=="list-renderer"&&this.root.setAttribute("lr-loop",this.loopVariableName),this.root.innerHTML=this.template}reload(){this.restoreToTemplate(),this.render()}};globalThis.ListRenderer=b;globalThis.customElements.define("list-renderer",class extends HTMLElement{});var L=b;export{L as default};
//# sourceMappingURL=list-renderer.mjs.map

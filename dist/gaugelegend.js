!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).GaugeLegend=t()}}((function(){return function t(e,i,n){function s(o,c){if(!i[o]){if(!e[o]){var h="function"==typeof require&&require;if(!c&&h)return h(o,!0);if(r)return r(o,!0);var a=new Error("Cannot find module '"+o+"'");throw a.code="MODULE_NOT_FOUND",a}var d=i[o]={exports:{}};e[o][0].call(d.exports,(function(t){return s(e[o][1][t]||t)}),d,d.exports,t,e,i,n)}return i[o].exports}for(var r="function"==typeof require&&require,o=0;o<n.length;o++)s(n[o]);return s}({1:[function(t,e,i){e.exports=class t{constructor(t){const e="http://www.w3.org/2000/svg";this.config=Object.assign({theme:"dark",size:"100px",unit:"",text1:"",text2:"",trigger:"idle"},t),this._legend=document.createElementNS(e,"svg"),this._tick=document.createElementNS(e,"path"),this.config.colors.forEach(((t,i)=>{let n=document.createElementNS(e,"path");n.setAttribute("id",`arc_${i}`),n.setAttribute("fill","none"),n.setAttribute("stroke",t),n.setAttribute("stroke-width",5),this._legend.appendChild(n)})),this._tick.setAttribute("id","tick"),this._tick.setAttribute("fill","none"),this._tick.setAttribute("stroke",""+("dark"===this.config.theme?"#dddddd":"#333333")),this._tick.setAttribute("stroke-width",3),this._legend.appendChild(this._tick),this.__flag__=!0}async refresh(){const e=this._container.offsetHeight/2,i=Math.round(180/this.config.breaks.length),n=(180-i)/2,s=document.querySelector(".valor"),r=await this._map.queryRenderedFeatures({layers:[this.config.layer]}).map((t=>1*t.properties[this.config.property])),o=Math.round(10*r.reduce(((t,e)=>t+e),0)/r.length)/10,c=this.config.breaks.map(((t,e)=>t>o?e:-1)).filter((t=>t>-1))[0],h=this.config.colors[c];!0===this.__flag__&&(this.config.breaks.forEach(((n,s)=>{document.querySelector(`#arc_${s}`).setAttribute("d",t.describeArc(e,e,e-5,i*s-90.1,i*(s+1)-89.1))})),delete this.__flag__),isNaN(o)?(s.style.color="#666",s.textContent="-",this._tick.setAttribute("d",t.describeArc(e,e,e-12,0,0))):(s.style.color=h,s.textContent=`${o}${""!==this.config.unit?` ${this.config.unit}`:""}`,this._tick.setAttribute("d",t.describeArc(e,e,e-12,i*c-n,i*c-n+3)))}static polarToCartesian(t,e,i,n){let s=(n-90)*Math.PI/180;return{x:t+i*Math.cos(s),y:e+i*Math.sin(s)}}static describeArc(e,i,n,s,r){let o=t.polarToCartesian(e,i,n,r),c=t.polarToCartesian(e,i,n,s),h=r-s<=180?"0":"1";return["M",o.x,o.y,"A",n,n,0,h,0,c.x,c.y].join(" ")}onAdd(t){return this._map=t,this._container=document.createElement("div"),this._container.className=`gauge-core gauge-${this.config.theme}`,this._container.style.height=this.config.size,this._container.style.width=this.config.size,this._container.innerHTML=`\n            <div class="titol text-${this.config.theme}">${this.config.text1}</div>\n            <div class="valor text-${this.config.theme}">-</div>\n            <div class="titol text-${this.config.theme}">${this.config.text2}</div>\n            <div class="min text-${this.config.theme}">${this.config.breaks[0]}</div>\n            <div class="max text-${this.config.theme}">${this.config.breaks[this.config.breaks.length-1]}</div>`,this._container.appendChild(this._legend),this._map.on(this.config.trigger,this.refresh.bind(this)),this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map.off(this.config.trigger,this.refresh.bind(this)),this._map=void 0}}},{}]},{},[1])(1)}));
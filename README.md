# Web Componenents
Web Components é uma suíte de diferentes tecnologias que permite a 
criação de elementos customizados reutilizáveis — com a 
funcionalidade separada do resto do seu código — e que podem ser utilizados em suas aplicações web.


## Motivacao 
Entender principais conceitos do web componenets </br>
- Elementos customizados
- Shadow DOM
- Templates HTML


## Feature
- Web Componenets possui [ciclos](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements) de vida para lidar com arvore DOM
- connectedCallBack(), quando arvore monta
- disconnectedCallback(), quando arvore desmonta
- attributeChangedCallback(), quando arvore sofre mudanca
- Normalmente construimos nossos componentes em classe extendemos os elementos html,tambem possivel extender built-in elements,funcionalidades dos atributos padrao html
- Ideal apos extends elements e a palavra super(),para lidar com heranca
- Web Componentes trabalha com conceito do [Shadow Dom](https://www.treinaweb.com.br/blog/o-que-e-dom-virtual-dom-e-shadow-dom) assim evita qualquer sobscrita de css,tag que utliza esse concieto e a <video>
- Para ativar o Shadow Dom utilizamos objeto  attachSHadow({mode: "open"})  
- Para HTML entender que isto e um custom elemento , usamos objeto customElements e seu metodo define
  
  ``` js
 
class ToolTip extends HTMLElement {
  constructor() {
    //super e para herdar todos os metodos do HTMLElement
    super();
    this.tooltipContainer;
    this.tooltipText = "Need message";
    this.attachShadow({ mode: "open" });
}

//primeiro argumento e o nome da tag,segundo a classe
customElements.define("kvm-tooltip", ToolTip);
 
 ```
  
 - Outra feature interessante de encapsulamento sao os templates,com ele conseguimos criar elementos que nao sao renderizados na pagina  assim que e carregada,mas conseguimos instancia em tempo de execucao no Javascript
 - Tem dois metodos para realizar o uso de template,abaixo esta exemplo de uma delas
 - Crio html com a tag template,normalmente usamos o slot junto,ideia do slot e permite filhos em nossas tags <nossa tag> {filhos} </nossa tag>
 - Consigo instanciar  construtor da classe o querySelector,porque a tag template ela nao e renderizada assim que a pagina carrega, diferente dos outros elementos do light DOM
 - Fique atento ao construtor os elementos do light DOM podem apenas ser acessados nos seus cilos de vida,com template nao ocorre isso
 - Apos pegar a tag template pelo id #span-tooltip eu clono todos os elementos do seu no e coloco no Shadow Dom usando metodo shadowRoot
 - Depois de tudo concluido consigo no ciclo de vida connectedCalback() pegar as tag que estao no template
  
  ```js
class ToolTip extends HTMLElement{  
  constructor() {
  //primeira maneira
  this.attachShadow({ mode: "open" });
  const template = document.querySelector("#span-tooltip");
  this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
      const span = this.shadowRoot.querySelector("span");
  
  }
}
```
  
``` html
  <template  id="span-tooltip">
    <slot></slot>  
  <template>
  
```
  
 - Outra maneira de iniciar templates e usando o recurso de javascript template string
 - Desta maneira nao preciso usar a tag <template> </template>   
 - Interessante nos slots que o valor colocado como default e ingorado quando colocamos um filho na nossa tag  <nossa tag></nossa tag> neste exemplo vai aparecer o valor default
 - <nossta tag>oiii</nossa tag> vai aparecer oiii
    
    
    
 ```js
    
     this.attachShadow({ mode: "open" });
     this.shadowRoot.innerHTML = `
            <style>
              div {
                 background-color: black;
                 color: white;
                 position: absolute
              }
            </style>
            <slot>Some default</slot>
            <span>(?)</span>
    `;
      
```    
  
  
- Eventos em web componentes sao identicos quando trabalhamos com classes, javascritp com html, ideal e uso do bind 
- Toda vez que um evento e acionado normalmente o this fara referencia quem o chamou,exemplo button tem evento de click o this nesse caso e  botao
- Por isso o motivo do [bind](https://academind.com/tutorials/this-keyword-function-references)
    
    
    
 ```js
 connectedCallback() { 
    const span = this.shadowRoot.querySelector("span");
    span.addEventListener("mouseenter", this._showMessage.bind(this));
    span.addEventListener("mouseleave", this._clearMessage.bind(this));
    this.style.position = "relative";
    this.shadowRoot.appendChild(span);
  } 
  
   _showMessage() {
    this.tooltipContainer = document.createElement("div");
    this.tooltipContainer.textContent = this.tooltipText;
    this.shadowRoot.appendChild(this.tooltipContainer);
  }
  
  _clearMessage() {
    this.shadowRoot.removeChild(this.tooltipContainer);
  }
    
```    
    
    
  
  
  
  

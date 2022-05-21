# Web Componenents
Web Components é uma suíte de diferentes tecnologias que permite a 
criação de elementos customizados reutilizáveis — com a 
funcionalidade separada do resto do seu código — e podem ser utilizados em suas aplicações web.


## Motivacao 
Entender principais conceitos do web componentes </br>
- Elementos customizados
- Shadow DOM
- Templates HTML

## Feature
- Web Componenets possui [ciclos](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements) de vida para lidar com árvore DOM
- connectedCallBack(), quando arvore monta
- disconnectedCallback(), quando arvore desmonta
- attributeChangedCallback(), quando arvore sofre mudança
- Normalmente construímos nossos componentes em classe estendemos os elementos html, também possível estender built-in elements, funcionalidades dos atributos padrão html
- Ideal apos extends elements e a palavra super(), para lidar com herança
- Web Componentes trabalha com conceito do [Shadow Dom](https://www.treinaweb.com.br/blog/o-que-e-dom-virtual-dom-e-shadow-dom) assim evita qualquer subscrita de css, tag  comum que utiliza esse conceito e a <video>
- Para ativar o Shadow Dom utilizamos objeto  attachShadow({mode: "open"})  
- Para HTML entender que isto e um custom elemento, usamos objeto customElements e seu método define
 
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
 - Desta maneira não preciso usar a tag <template> </template>   
 - Interessante nos slots que o valor colocado como default e ignorado quando colocamos um filho na nossa tag  <nossa tag></nossa tag> neste exemplo vai aparecer o valor default
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
  
  
  
- Eventos em web componentes são idênticos quando trabalhamos com classes, javascritp com html, ideal é uso do bind 
- Toda vez que um evento e acionado normalmente o this fara referencia quem o chamou, exemplo button tem evento de click o this nesse caso e  botão
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
    
    
- Para estilizar as tagas do slot,tem metodo ::slotted   
- Funcao slotted tem posibilidade de passar varios argumentos  ::slotted(.class),::slotted(#id),::slotted(a)
- Para lidar estilo do container do nosso elemento existe o método:host, segue mesmas regras qeu slotted     
  
   
   
   
``` js
 this.shadowRoot.innerHTML = `
            <style>
              ::slotted(.highlight){
                 border-bottom: 2px solid red;
              }
              :host {
                 background-color: red;
              }
              :host(.import) {
                  background-color: var(--primary-color,gray);
              }
              :host-context(p) {
                  font-weight: bold
              }
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
   
  
- Para mudar valores usamos o metodo attributeChangedCallk 
- Este método trabalha em conjunto com observedAttributes()
- ObservedAttributes() precisa retornar um array, com valores que você deseja ser observado
- Neste caso um utilizei um atributo que dei o nome text
- Ciclo de vida attributeChangedCallback() recebe três argumentos, nome do atributo que pretende monitorar, valor antigo e novo
- Atributo text esta na minah tag <kvm-tooltip text="" class=  ></kvm-tooltip>
   
``` js

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this.tooltipText = newValue;
    }
  }

 
  static get observedAttributes() {
    return ["text", "class"];
  }
   
   
   
   
```   
 
   
   
- Para criar tags com atributos customizados exemplo <minha tag text>
- Posso utilizar o método do javascript getAttribute(atributo que desejo)
- Logica foi usado no ciclo de vida connectedCallback() em vista que não consigo instanciar nada antes de ser montado na tela
   
   
   
   
``` js
   
   
connectedCallback() {
   if(this.hasAttribute("text")){
       this.tooltipText = this.getAttribute("text")
   }  
 }   
   
   
```   
   
   
   
   

// para renderizar de forma correta seus componentes temos que seguir o siglo de vida arvore do dom
// connectedCallback() permite acessar o dom assim que montado
// disconnectedCalllback() permite acessar o dom assim que foi desmontado
// attributeChangedCallback() //permite fazer update no Dom
class ToolTip extends HTMLElement {
  constructor() {
    //super e para herdar todos os metodos do HTMLElement
    super();
    this.tooltipContainer;
    this.tooltipText = "Need message";
    //sem o shadow dom os elementos de estilos globais irao sobescrever os outros estilos
    //shadow dom e uma arvore a parte da arvore comum  dom
    this.attachShadow({ mode: "open" });
    //consigo porque o span-tooltip no construtor porque e um template,
    //template consigo pegar em tempo de execucao no javascirpt
    //esse id esta na tag template

    //outra maneira de fazer template

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

    //maneira de fazer um template
    //const template = document.querySelector("#span-tooltip");
    //retorna o elementos clonados na arvore dom
    //https://developer.mozilla.org/pt-BR/docs/Web/API/Node/cloneNode
    //estou clonado a no da arvore do template e colcoando no shadow

    // this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    //estou tentando pegar o atributo que esta na tag html
    if (this.hasAttribute("text")) {
      this.tooltipText = this.getAttribute("text");
    }
    // const span = document.createElement("span");
    // https://developer.mozilla.org/pt-BR/docs/Web/API/Node/textContent
    //utilizar o textContent e melhor que usar o innerHtml
    // span.textContent = "(?)";
    const span = this.shadowRoot.querySelector("span");
    //tag span e qeu esta dentro da tag <template> </template>
    //sem o bind quem sera chamado com this e o span ,porque tem um evento
    //click,evento,prcisa do bind,para que o this referenciaa classe e nao quem o chamou
    //https://academind.com/tutorials/this-keyword-function-references
    span.addEventListener("mouseenter", this._showMessage.bind(this));
    span.addEventListener("mouseleave", this._clearMessage.bind(this));
    this.style.position = "relative";
    // assim estou acessando o dom nossa arvore e shadow dom this.appendChild(span);
    this.shadowRoot.appendChild(span);
  }

  //_ isto e uma convencao para dizer que este metodo e privado
  _showMessage() {
    this.tooltipContainer = document.createElement("div");
    this.tooltipContainer.textContent = this.tooltipText;
    //this.tooltipContainer.style.backgroundColor = "black";
    //this.tooltipContainer.style.color = "white";
    //this.tooltipContainer.position = "absolute";
    this.shadowRoot.appendChild(this.tooltipContainer);
  }

  _clearMessage() {
    this.shadowRoot.removeChild(this.tooltipContainer);
  }
}

//primeiro argumento e o nome da tag,segundo a classe
customElements.define("kvm-tooltip", ToolTip);

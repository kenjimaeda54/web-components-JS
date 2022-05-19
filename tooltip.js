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
  }

  connectedCallback() {
    //estou tentando pegar o atributo que esta na tag html
    if (this.hasAttribute("text")) {
      this.tooltipText = this.getAttribute("text");
    }

    const span = document.createElement("span");
    // https://developer.mozilla.org/pt-BR/docs/Web/API/Node/textContent
    //utilizar o textContent e melhor que usar o innerHtml
    span.textContent = "(?)";
    //sem o bind quem sera chamado com this e o span ,porque tem um evento
    //click,evento,prcisa do bind,para que o this referenciaa classe e nao quem o chamou
    //https://academind.com/tutorials/this-keyword-function-references
    span.addEventListener("mouseenter", this._showMessage.bind(this));
    span.addEventListener("mouseleave", this._clearMessage.bind(this));
    this.appendChild(span);
  }

  //_ isto e uma convencao para dizer que este metodo e privado
  _showMessage() {
    this.tooltipContainer = document.createElement("div");
    this.tooltipContainer.textContent = this.tooltipText;
    this.appendChild(this.tooltipContainer);
  }

  _clearMessage() {
    this.removeChild(this.tooltipContainer);
  }
}

//primeiro argumento e o nome da tag,segundo a classe
customElements.define("kvm-tooltip", ToolTip);

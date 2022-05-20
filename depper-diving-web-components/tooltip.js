// para renderizar de forma correta seus componentes temos que seguir o siglo de vida arvore do dom
// connectedCallback() permite acessar o dom assim que montado
// disconnectedCalllback() permite acessar o dom assim que foi desmontado
// attributeChangedCallback() //permite fazer update no Dom
class ToolTip extends HTMLElement {
  constructor() {
    //super e para herdar todos os metodos do HTMLElement
    super();
    this._renderTooltip = false;
    this._iconTooltip;
    this.tooltipText = "Need message";
    //sem o shadow dom os elementos de estilos globais irao sobescrever os outros estilos
    //shadow dom e uma arvore a parte da arvore comum  dom
    this.attachShadow({ mode: "open" });
    //consigo porque o span-tooltip no construtor porque e um template,
    //template consigo pegar em tempo de execucao no javascirpt
    //esse id esta na tag template

    //outra maneira de fazer template
    //
    //slotted e para estilizar conteudos dentro do slot
    //se desejo pegar todos elementos ::slotted(*)
    //se desejo estilizar o pai do web componente interno uso o host
    //https://developer.mozilla.org/en-US/docs/Web/CSS/:host_function
    //tambem consigo com host estilizar uma classe que esta sendo usado
    //na tag <kvm-tooltip class="import">
    //com host-context(alguma coisa) consigo pegar o elemento que esta
    //em volta da tag <p><kvm-tooltip> </kvm-tooltip> </p>
    //posso setar minhas variaveis css no html e em var alem de passar ela
    //consigo passar um padrao,caso nao exista sera o padrao usado
    //var(variaveis,padrao)
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
    this._iconTooltip = this.shadowRoot.querySelector("span");
    //tag span e qeu esta dentro da tag <template> </template>
    //sem o bind quem sera chamado com this e o span ,porque tem um evento
    //click,evento,prcisa do bind,para que o this referenciaa classe e nao quem o chamou
    //https://academind.com/tutorials/this-keyword-function-references
    this._iconTooltip.addEventListener(
      "mouseenter",
      this._showMessage.bind(this)
    );
    this._iconTooltip.addEventListener(
      "mouseleave",
      this._clearMessage.bind(this)
    );
    this.style.position = "relative";
    // assim estou acessando o dom nossa arvore e shadow dom this.appendChild(span);
    this.shadowRoot.appendChild(this._iconTooltip);
  }

  //ciclo de vida para caputarar atributos que mudaram
  //ele possui 3 argumentos,name do atributo,valor antigo e o novo valor
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this.tooltipText = newValue;
    }
  }

  //metodo estatico pertence a propria classe
  //a palavra get vem do orientado objetos get e setter
  //observedAttributes e um metodo do ciclo de vida ele observa os atributos
  static get observedAttributes() {
    //estou pegando o atribute text e o class
    // <kvm-tooltip text="" class=  ></kvm-tooltip>
    return ["text", "class"];
  }

  //e um ciclo de vida quando arvore e desmontado
  disconnectedCalllback() {
    this.iconTooltip.removeListener("mouseenter", this._showMessage);
    this.iconTooltip.removeListener("mouseleave", this._clearMessage);
  }

  //ideal e centralizar logica quem cria os elementos shadow Dow e removem
  //para isto crei esse metodo,a div que sera criada e removida estara todoa logica aqui
  _render() {
    //tenho que referenciar o shadowRoot,veja que o a div esta sendo adicoinado na linha 129
    //no shadowRoot
    let tooltipContainer = this.shadowRoot.querySelector("div");
    if (this._renderTooltip) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.textContent = this.tooltipText;
      //this.tooltipContainer.style.backgroundColor = "black";
      //this.tooltipContainer.style.color = "white";
      //this.tooltipContainer.position = "absolute";
      this.shadowRoot.appendChild(tooltipContainer);
    } else if (tooltipContainer) {
      this.shadowRoot.removeChild(tooltipContainer);
    }
  }

  //_ isto e uma convencao para dizer que este metodo e privado
  _showMessage() {
    this._renderTooltip = true;
    this._render();
  }

  _clearMessage() {
    this._renderTooltip = false;
    this._render();
  }
}

//primeiro argumento e o nome da tag,segundo a classe
customElements.define("kvm-tooltip", ToolTip);

class ConfirmLink extends HTMLAnchorElement {
  connectedCallback() {
    //this ja esta refenciando a tag a
    this.addEventListener("click", (event) => {
      if (!confirm("Are you sure you want to quit")) {
        //preventDefault vai fazer com que volte para estado inical do evento ou seja nao vai ocorrer submit
        event.preventDefault();
      }
    });
  }
}
//maneira de extender componentes
customElements.define("kvm-confirm-link", ConfirmLink, { extends: "a" });

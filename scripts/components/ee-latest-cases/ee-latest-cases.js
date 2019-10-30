import SimpleElement from "../../../scripts/SimpleElement.js";
import EeLostPersonCard from "../ee-lost-person-card/ee-lost-person-card.js";

window.customElements.define('ee-latest-cases', class EeBody extends SimpleElement {

    constructor(){
        super(import.meta.url);
    }

});
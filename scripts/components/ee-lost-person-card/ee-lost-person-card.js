import SimpleElement from "../../../scripts/SimpleElement.js";
import Carousel from "../../../node_modules/elix/define/Carousel.js";
import DrawerWithGrip from "../../../node_modules/elix/define/DrawerWithGrip.js";

export default class EeLostPersonCard extends SimpleElement {

    constructor() {
        super(import.meta.url);
    }

};

window.customElements.define('ee-lost-person-card', EeLostPersonCard);
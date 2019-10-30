import SimpleElement from "../../../scripts/SimpleElement.js";
import MacroCarousel from './macro-carousel.js'

window.customElements.define('ee-wizard', class EeWizard extends SimpleElement {

    constructor() {
        super(import.meta.url);
    }

    ressourcesAttachedCallback(){
        // get macro-carousel object
        let macroCarousel = this.shadowRoot.querySelector('macro-carousel');
        // init current slide
        this.shadowRoot.querySelector('#currentSlideNumber').innerHTML = macroCarousel.selected + 1;
        // add listener on slide changes and update current slide
        macroCarousel.addEventListener('macro-carousel-selected-changed',(event)=>{
            this.shadowRoot.querySelector('#currentSlideNumber').innerHTML = event.detail + 1;
        });
    }

});
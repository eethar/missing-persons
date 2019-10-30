import SimpleElement from "../../../scripts/SimpleElement.js";
import MacroCarousel from './macro-carousel.js'

window.customElements.define('ee-wizard', class EeWizard extends SimpleElement {

    constructor() {
        super(
            import.meta.url);
    }

    resourcesAttachedCallback() {
        // get macro-carousel object
        let macroCarousel = this.shadowRoot.querySelector('macro-carousel');
        this.initSlideInfo(macroCarousel, macroCarousel.selected);

        // add listener on slide changes
        macroCarousel.addEventListener('macro-carousel-selected-changed', (event) => {
            this.initSlideInfo(macroCarousel, event.detail);
        });

        // add listener on next button click
        this.shadowRoot.querySelector('#nextButton').addEventListener('click', () => {
            macroCarousel.next();
        });
    }


    /**
     * Sets the slide number, the title and next button text if provided,
     * the title is fetched from the 'title' attribute from the slide
     * the next button text is fetched from the 'nextButtonText' from the slide
     * if no text is provided for the last slide, 'Submit' is put by default
     * @param {*} macroCarousel : the unique macroCarousel used in the template
     * @param {*} slideIndex
     */
    initSlideInfo(macroCarousel, slideIndex) {
        // set slide number
        this.shadowRoot.querySelector('#currentSlideNumber').innerHTML = macroCarousel.selected + 1;

        // set the number of slides there is
        this.shadowRoot.querySelector('#totalSlideNumber').innerHTML = macroCarousel._slides.length;

        // set the title
        let title = macroCarousel._slides[slideIndex].element.getAttribute('title');
        //check if the node is already there, else create it
        let titleNode = this.querySelector('[slot=title]');
        if (titleNode == null) {
            titleNode = document.createElement('span');
            titleNode.setAttribute('slot', 'title');
        }
        titleNode.innerHTML = title;
        this.appendChild(titleNode);

        // set the next button text
        let nextButtonText = macroCarousel._slides[slideIndex].element.getAttribute('nextButtonText');
        // delete any slots for the button text
        let oldNextButtonTextNode = this.querySelector('[slot=nextButtonText]');
        if (oldNextButtonTextNode != null)
            oldNextButtonTextNode.remove();
        // set the text if not null
        if (nextButtonText != null) {
            let nextButtonTextNode = document.createElement('span');
            nextButtonTextNode.setAttribute('slot', 'nextButtonText');
            nextButtonTextNode.innerHTML = nextButtonText;
            this.appendChild(nextButtonTextNode);
        } else if (macroCarousel.selected == macroCarousel._lastViewIndex) {
            // if no text is provided for next button and we're in the last slide
            // put Submit by default
            let nextButtonTextNode = document.createElement('span');
            nextButtonTextNode.setAttribute('slot', 'nextButtonText');
            nextButtonTextNode.innerHTML = 'Submit';
            this.appendChild(nextButtonTextNode);
        }
    }

});
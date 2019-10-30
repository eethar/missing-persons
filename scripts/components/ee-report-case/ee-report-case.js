import SimpleElement from "../../../scripts/SimpleElement.js";
import {  } from "../../components/ee-wizard/ee-wizard.js";

window.customElements.define('ee-report-case', class EeReportCase extends SimpleElement {

    constructor() {
        super(import.meta.url);
    }

    resourcesAttachedCallback(){
        this.fetchAndAttacheTermsAndConditions();
    }

    fetchAndAttacheTermsAndConditions(){
        this.fetchResource('termsAndConditions.html', text => {
            let container = this.shadowRoot.querySelector('ee-wizard').querySelector('#termsAndConditions');
            container.innerHTML = text;
        });
    }

});
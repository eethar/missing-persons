import SimpleElement from "../../../scripts/SimpleElement.js";
import DateComboBox from '../../../node_modules/elix/define/DateComboBox.js';

window.customElements.define('ee-header', class EeHeader extends SimpleElement {

    constructor(){
        super(import.meta.url);
    }

});

/**
 * set a global variable with the name 'SEProductionMode' to true in order to use cache
 */
export default class SimpleElement extends HTMLElement {

    /**
     * accepts the URL of the module (sub-class) as an argument.
     * In sub classes we should call this constructor like this :
     * super(module.meta.url);
     */
    constructor(moduleUrl) {

        // make sure it's not intenciated, this should be an abstract class.
        if (new.target === SimpleElement) {
            throw new TypeError("Simple Elements: Cannot construct SimpleElement instances directly");
        }

        // call the super constructor
        super();

        // set the url of the module form the sub-class
        this.moduleUrl = moduleUrl;

        // set cache name
        this.CACHE_NAME = 'SimpleElements';

        // create a shadow root (according to the specs see link below, it is prefered to created shadow root in constructor)
        this.attachShadow({
            mode: 'open'
        });

    }


    // overriden from HTMLElement
    connectedCallback() {

        // add a default content (Loading...)
        this.appendChild(this.defaultContent());

        // extract the path from the url
        let path = this.moduleUrl.substr(0, (this.moduleUrl.lastIndexOf('/') + 1));

        // ressources requests
        let htmlRequest = new Request(path + this.localName + '.html');
        let cssRequest = new Request(path + this.localName + '.css');

        // check if already in cache
        caches.open(this.CACHE_NAME).then(cache => {

            let htmlCachePromise = cache.match(htmlRequest.url);
            let cssCachePromise = cache.match(cssRequest.url);

            // open cache
            Promise.all([htmlCachePromise, cssCachePromise]).then(responses => {
                // one of the ressources doesn't exist
                if (responses[0] === undefined || responses[1] === undefined) {

                    // use cache
                    let useCache = true;
                    if (typeof SEProductionMode === "undefined")
                        useCache = false;

                    // fetch ressources
                    this.fetchRessources(htmlRequest, cssRequest, useCache);
                } else {
                    // both html and css exist in cache
                    Promise.all([responses[0].text(), responses[1].text()]).then(texts => {
                        this.attacheRessources(texts[0], texts[1]);
                    });
                }
            });

        });

    }

    fetchRessources(htmlRequest, cssRequest, useCache) {

        let htmlFetchPromise = fetch(htmlRequest.clone());
        let cssFetchPromise = fetch(cssRequest);

        // once ressources are loaded, attached them to the current Element
        Promise.all([htmlFetchPromise, cssFetchPromise]).then(results => {

            // both ressources should exist
            if (!results[0].ok || !results[1].ok) {
                throw new TypeError('Simple Elements: Bad response status while fetching element ' + this.localName);
            }

            if (useCache) {
                // cache ressources
                caches.open(this.CACHE_NAME).then(cache => {
                    cache.put(htmlRequest, results[0]);
                    cache.put(cssRequest, results[1]);
                })
            }

            // read responses
            Promise.all([results[0].clone().text(), results[1].clone().text()]).then(texts => {
                this.attacheRessources(texts[0], texts[1]);
            });
        });

        // TODO : catch errors, 404s...
    }

    attacheRessources(html, css) {

        // remove default content inserted before
        this.querySelector("#" + this.defaultContent().id).remove();

        // create a html template
        const template = document.createElement('template');
        template.innerHTML = html.trim();


        // create a shadow root and attache template
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // create style element and append to shadow root
        const style = document.createElement('style');
        style.innerHTML = css.trim();
        this.shadowRoot.appendChild(style);

        // once ressources are loaded and attached call :
        this.ressourcesAttachedCallback();
    }

    ressourcesAttachedCallback() {
        //console.log(`Simple Elements: Ressources for element '${this.localName}' are attached, implement this method in your element to do something after ressources are loaded and attached !`);
    }

    defaultContent() {
        const loadingNode = document.createElement('h5');
        loadingNode.innerHTML = 'Loading...';
        loadingNode.id = 'defaultContent';
        return loadingNode;
    }

}

/*
    create shadow root in constructor : https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance
*/
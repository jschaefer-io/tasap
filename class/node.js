const entities = new (require('html-entities').XmlEntities);
const Utils = require('./utils');
const Element = require('./element');

/**
 * Main Node object
 */
class Node extends Element{

    /**
     * Constructor
     * @param node Node object
     * @param parent node Object
     * @param getBuilder Main Builder object
     */
    constructor(node, parent, getBuilder){
        super(getBuilder);

        this.parent = parent;
        this.state = {};
        this.util = Utils;
        this.type = node.type;

        if (this.type === 'tag' || this.type === 'script' || this.type === 'style') {
            this.name = node.name;
            this.attributes = node.attribs;
            this.buildChildrenDom(node.children);
        }
        else {
            this.data = node.data;
        }

        if (this.matchPattern(this.name) === true && this.constructor === Node) {
            throw new Error('Node with the name "' + this.name + '" matches the given Module-Pattern ' + this.getBuilder().options.pattern) + ' , but is not a defined Module.';
        }
    }

    /**
     * Renders the node with all its children
     * @returns string rendered html content
     */
    render(){
        this.inheritState();
        let out = '';
        switch (this.type) {
            case 'text':
                out += this.evalExpression(this.data);
                break;
            case 'directive':
                out += '<' + this.data + '>';
                break;
            case 'comment':
                out += '<!-- ' + this.evalExpression(this.data) + '-->';
                break;
            default: {
                let isClosing = (Node.isClosingTag(this.name) && !this.children.length),
                    isDeclarative = Node.isDeclarative(this.name);

                // Allow dynamic changing of tags
                if (this.attributes['@tag']) {
                    let replaceTag = this.evalExpression(this.attributes['@tag']);
                    if (replaceTag && replaceTag !== 'undefined') {
                        this.name = replaceTag;
                    }
                }

                out += '<' + this.name + this.getAttributeString() + ((isClosing && !isDeclarative) ? ' /' : '') + '>';
                if (!isClosing) {
                    out += Node.renderArray(this.children);
                    out += '</' + this.name + '>';
                }
            }
                break;
        }
        this.pushState();
        return out;
    }

    /**
     * Builds the attribute string
     * @returns string html attribute string
     */
    getAttributeString(){
        let out = '';
        for (let att in this.attributes) {
            if (att.indexOf('@') !== 0) {
                out += ' ' + att + '="' + entities.encode(this.evalExpression(this.attributes[att])) + '"';
            }
        }
        return out;
    }

    /**
     * Inherits the local state from the parent object
     */
    inheritState(){
        let parentState = {};
        if (this.parent && this.parent.state) {
            parentState = this.parent.state;
        }
        this.state = Object.assign({}, parentState, this.state);
    }

    /**
     * Push the local state to the parent object
     */
    pushState(){
        if (this.parent && this.parent.state) {
            this.parent.state = this.state;
        }
    }

    /**
     * Static helper to render a full array of nodes
     * @param arr list of nodes
     * @returns string rendered content
     */
    static renderArray(arr){
        return arr.reduce((str, item) => str + item.render(), '');
    }

    /**
     * Checks the given tag string and returns if it matches a self closing tag
     * @param tag tag string to check
     * @returns {boolean}
     */
    static isClosingTag(tag){
        return ['br', 'input', 'meta', 'link', 'img', '!DOCTYPE'].indexOf(tag) >= 0;
    }

    /**
     * Checks if the given tag is a declarative string
     * @param tag tag string to check
     * @returns {boolean}
     */
    static isDeclarative(tag){
        return ['!DOCTYPE'].indexOf(tag) >= 0;
    }
}

module.exports = Node;
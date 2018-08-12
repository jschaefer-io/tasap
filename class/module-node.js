const Node = require('./node');

/**
 * Main Module Node Object
 */
class ModuleNode extends Node{

    /**
     * Constructor
     * @param module module object
     * @param node node object
     * @param parent parent object
     * @param getBuilder builder object
     */
    constructor(module, node, parent, getBuilder){
        super(node, parent, getBuilder);
        this.module = module;
        this.state = Object.assign({}, this.module.attributes, this.attributes);
        this.moduleChildren = this.children;
        this.buildChildrenDom(this.module.node.children);
    }

    /**
     * Renders the Modules Dom with all its children
     * @returns string
     */
    render(){
        this.inheritState();
        return Node.renderArray(this.children);
    }

    /**
     * Inherit the local state from the parent node and
     * sets the module Block state
     */
    inheritState(){
        super.inheritState();
        if (this.state.Block) {
            this.state.parentBlock = this.state.Block;
        }
        this.state.Block = () => Node.renderArray(this.moduleChildren);
    }

    /**
     * Prevents state pushing of modules
     */
    pushState(){
    }
}

module.exports = ModuleNode;
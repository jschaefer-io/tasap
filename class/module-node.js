const Node = require('./node');

class ModuleNode extends Node{
	constructor(module, node, parent, getBuilder){
		super(node, parent, getBuilder);
		this.module = module;
		this.state = Object.assign(this.module.attributes, this.attributes);
		this.moduleChildren = this.children;
		this.buildChildrenDom(this.module.node.children);
	}
	render(){
		this.inheritState();
		let out = Node.renderArray(this.children);
		return out;
	}
	inheritState(){
		super.inheritState();
		if (this.state.Block) {
			this.state.parentBlock = this.state.Block;
		}
		this.state.Block = ()=>Node.renderArray(this.moduleChildren);
	}
	pushState(){
		return;
	}
}

module.exports = ModuleNode;
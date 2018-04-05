const Element = require('./element');

class Module extends Element{
	constructor(node, getBuilder){
		super(getBuilder);
		this.node = node;
		this.attributes = node.attribs;
		this.name = node.attribs.name;
		delete this.attributes.name;
	}
}


module.exports = Module;
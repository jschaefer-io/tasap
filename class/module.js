const Element = require('./element');

class Module extends Element{
	constructor(node, getBuilder){
		super(getBuilder);
		this.node = node;
		this.attributes = node.attribs;
		this.name = node.attribs.name;
		delete this.attributes.name;

		if (this.matchPattern(this.name) === false) {
			throw new Error('Module with the name "' + this.name + '" does not match the given Pattern: ' + this.getBuilder().options.pattern);
		}
	}
}


module.exports = Module;
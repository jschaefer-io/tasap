const entities  = new (require('html-entities').XmlEntities);

const Element = require('./element');

class Node extends Element{
	constructor(node, parent, getBuilder){
		super(getBuilder);

		this.parent = parent;
		this.state = {};

		this.type = node.type;
		if (this.type === 'text' || this.type === 'comment') {
			this.data = node.data;
		}
		else{
			this.name = node.name;
			this.attributes = node.attribs;
			this.buildChildrenDom(node.children);
		}

		if (this.matchPattern(this.name) === true && this.constructor === Node) {
			throw new Error('Node with the name "' + this.name + '" matches the given Module-Pattern ' + this.getBuilder().options.pattern) + ' , but is not a defined Module.';
		}
	}
	render(){
		this.inheritState();

		let out = '';
		if (this.type === 'text') {
			out += this.evalExpression(this.data);
		}
		else if (this.type === 'comment') {
			out += '<!-- ' + this.evalExpression(this.data) + '-->';
		}
		else{
			let isClosing = (Node.isClosingTag(this.name) && !this.children.length),
				isDeclarative = Node.isDeclarative(this.name);
			out += '<' + this.name + this.getAttributeString() + ((isClosing && !isDeclarative)? ' /' : '') + '>';
			if (!isClosing) {
				out += Node.renderArray(this.children);
				out += '</' + this.name + '>';
			}
		}
		this.pushState();
		return out;
	}

	getAttributeString(){
		let out = '';
		for(let att in this.attributes){
			out += ' ' + att + '="' + entities.encode(this.evalExpression(this.attributes[att])) + '"';
		}
		return out;
	}

	inheritState(){
		let parentState = {};
		if (this.parent && this.parent.state) {
			parentState = this.parent.state;
		}
		this.state = Object.assign({}, parentState, this.state);
	}

	pushState(){
		if (this.parent && this.parent.state) {
			this.parent.state = this.state;
		}
	}

	static renderArray(arr){
		return arr.reduce((str, item)=>str+item.render(), '');
	}
	static isClosingTag(tag){
		return ['br','input','meta','link', 'img', '!DOCTYPE'].indexOf(tag) >= 0;
	}
	static isDeclarative(tag){
		return ['!DOCTYPE'].indexOf(tag) >= 0;
	}
}


module.exports = Node;
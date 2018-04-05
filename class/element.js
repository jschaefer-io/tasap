class Element{
	constructor(getBuilder){
		this.getBuilder = getBuilder;
	}
	buildChildrenDom(children){
		this.children = this.getBuilder().buildRenderDom(children, this, this.getBuilder);
	}

	evalExpression(content){
		let expReplace = new RegExp('{{(.*)}}', 'g'),
			expEval = new RegExp('{{# (.*)}}', 'g'),
			evalPoly = (str)=>{
				return eval('(' + str + ')');
			};

		content = content.replace(expEval, (str, p1)=>{
			evalPoly(p1);
			return '';
		}).replace(expReplace, (str, p1)=>{
			return evalPoly(p1);
		});
		return content;
	}
}

module.exports = Element;
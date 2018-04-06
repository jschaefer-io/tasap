class Element{
	constructor(getBuilder){
		this.getBuilder = getBuilder;
	}
	buildChildrenDom(children){
		this.children = [];
		if (children) {
			this.children = this.getBuilder().buildRenderDom(children, this, this.getBuilder);	
		}		
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
	matchPattern(str){
		let pattern = this.getBuilder().options.pattern;
		if (pattern !== false) {
			let exp = new RegExp(pattern, 'g');
			return exp.test(str);
		}
		return null;
	}
}

module.exports = Element;
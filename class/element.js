/**
 * Main Element object
 */
class Element{

    /**
     * Constructor
     * @param getBuilder the main Template Builder
     */
    constructor(getBuilder){
        this.getBuilder = getBuilder;
    }

    /**
     * Build up the children DOM
     * @param children node array
     */
    buildChildrenDom(children){
        this.children = [];
        if (children) {
            this.children = this.getBuilder().buildRenderDom(children, this, this.getBuilder);
        }
    }

    /**
     * Evaluates the tasap {{ }} and {{# }} expressions
     * @param content content to evaluate
     * @returns string the evaluated content
     */
    evalExpression(content){
        const state = this.state; // eslint-disable-line no-unused-vars
        const utils = this.util; // eslint-disable-line no-unused-vars
        const Block = this.state.Block; // eslint-disable-line no-unused-vars
        let expReplace = new RegExp('{{(.*)}}', 'g'),
            expEval = new RegExp('{{# (.*)}}', 'g'),
            evalPoly = (str) =>{
                return eval('(' + str + ')');
            };

        content = content.replace(expEval, (str, p1) =>{
            evalPoly(p1);
            return '';
        }).replace(expReplace, (str, p1) =>{
            return evalPoly(p1);
        });
        return content;
    }

    /**
     * Checks if the current string matches the global options pattern
     * @param str string to check
     * @returns null|boolean
     */
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
/**
 * Utility Object
 */
class Utils{

    /**
     * Transform a string to an array
     * @param string string to split
     * @param delimiter delimiter string
     * @returns array
     */
    static toArray(string, delimiter = ' '){
        return string.split(delimiter).filter(i => i);
    }

    /**
     * Prefix every string in an array
     * @param array array to prefix
     * @param prefix string to add to the items
     * @returns array
     */
    static prefixArray(array, prefix){
        return array.map(i => prefix + i);
    }

    /**
     * Suffix every string in an array
     * @param array array to prefix
     * @param suffix string to add to the items
     * @returns array
     */
    static suffixArray(array, suffix){
        return array.map(i => i + suffix);
    }
}

module.exports = Utils;
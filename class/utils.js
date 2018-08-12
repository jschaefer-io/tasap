class Utils{

    static toArray(string, delimiter = ' '){
        return string.split(delimiter).filter(i => i);
    }

    static prefixArray(array, prefix){
        return array.map(i => prefix + i);
    }

    static suffixArray(array, suffix){
        return array.map(i => i + suffix);
    }
}

module.exports = Utils;
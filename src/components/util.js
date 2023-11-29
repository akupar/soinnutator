export function escapeClassName(className) {
    return className.replace(/./g, function (char) {
        if ( char.match(/[a-zA-Z0-9_-]/) ) {
            return char;
        }
        else if ( char in [ "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":",
                            ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "`", "{", "|", "}", "~" ] ) {

            return "\\" + char;
        } else {
            return "\\" + parseInt(char.charCodeAt(0), 16);
        }
    });
};

export function getBarClass(barSymbol) {
    switch ( barSymbol ) {
        case "|":
            return "bar";
        case "¦":
            return "bar-2";
        case " ":
            return "bar-space";
        default:
            throw new Error("Tuntematon bar-symboli: " + barSymbol);
    }
};

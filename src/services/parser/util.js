export function readPragma(text) {
    const m = text.match(new RegExp('^\\n*#([^ \\t\\n]+)(.*)\\n'));
    if ( !m ) {
        return null;
    }

    return {
        name: m[1].trim(),
        content: m[2].trim()
    };
}

export function removePragma(pragmaName, text) {
    return text.replace(new RegExp('^\\n*#' + pragmaName + '(.*?)\\n+'), "");
}

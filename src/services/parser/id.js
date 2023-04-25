let prefixes = {};

export const makeId = (prefix) => {
    if ( !prefixes[prefix] ) {
        prefixes[prefix] = 1;
    }
    return prefix + '-' + prefixes[prefix]++;
};

export const resetIds = () => {
    prefixes = {};
};

/**
 * List of all top-level pragmas and what field to map them.
 */
export default {
    title: {
        key: 'title',
        parser: value => value.trim(),
    },
    right: {
        key: 'rightTitle',
        parser: value => value.trim(),
    },
    structure: {
        key: 'structure',
        parser: value => value.split('|').map(item => item.trim()),
    }
};

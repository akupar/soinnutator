import chai from 'chai';
import chaiString from 'chai-string';
export const expect = chai.expect;

chai.use(chaiString);


export function MultiLineString(...args) {
    return args.join('\n');
};

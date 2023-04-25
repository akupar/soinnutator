import Phrase from './Phrase';

import { escapeClassName } from './util';

export default function Section({ doc }) {

    return (
        <div className={`section ${doc.title ? escapeClassName(doc.title) : ''}`} id={doc.id}>
            <h2>{ doc.title }</h2>
            {
                doc.rightTitle && <span className="right">{ doc.rightTitle }</span>
            }
            {
                doc.phrases?.map(phrase => (
                    <Phrase key={phrase.id} id={phrase.id} doc={phrase} />
                ))
            }
        </div>
    );
};

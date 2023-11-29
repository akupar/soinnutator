import Phrase from './Phrase';

import { escapeClassName } from './util';

export default function Section({ doc }) {

    return (
        <div className={`section ${!doc.title ? 'empty-section' : ''} ${doc.title ? escapeClassName(doc.title) : ''}`} id={doc.id}>
            { (doc.title || doc.rightTitle) && <h2>{ doc.title }
                {
                    doc.rightTitle && <span className="right">{ doc.rightTitle }</span>
                }
                </h2>
            }
            {
                doc.phrases?.map(phrase => (
                    <Phrase key={phrase.id} id={phrase.id} doc={phrase} />
                ))
            }
        </div>
    );
};

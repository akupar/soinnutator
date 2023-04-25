import { useContext } from "react";

import { getBarClass } from './util';
import ConventionContext from './ConventionContext';

export default function RowItem({ doc }) {
    const { mapping } = useContext(ConventionContext);
    const isChord = (doc.index === 0); // && typeof doc.data === "object");

    let chordOut = doc.text;
    if ( isChord ) {
        const chordIn = doc.text;
        chordOut = mapping[chordIn] ?? chordIn;
        //console.log("chordIn", chordIn, "out:", chordOut);
    }

    return (
        <td className={`${isChord ? 'chord' : ''} ${doc.bar ? getBarClass(doc.bar) : ''} ${doc.spaceAfter ? 'space-after' : ''}`}>
            {
                chordOut.split(/([$@])/g).map((part, index) =>
                    part === '$' ? (<span key={index} className="spacer"></span>) : (
                        part === '@' ? '\u00A0' : part
                    )
                )
            }
        </td>
    );
};

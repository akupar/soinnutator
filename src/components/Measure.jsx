import Row from './Row';

export default function Measure({ doc }) {
    const classes = [ 'measure' ];
    if ( doc.spaceAfter ) {
        classes.push('bar-end');
    }

    // Chord measures without lyrics
    if ( doc.rows.length === 1 && doc.rows[0].index === 0 ) {
        classes.push('chord-only-measure');
    }

    return (
        <div id={doc.id} className={classes.join(" ")}>
            {
                doc.rows?.map(row => (
                    <Row key={row.id} doc={row} />
                ))
            }
        </div>
    );
};

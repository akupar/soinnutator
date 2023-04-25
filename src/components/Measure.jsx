import Row from './Row';

export default function Measure({ doc }) {

    return (
        <table className={`measure-block ${doc.spaceAfter ? 'bar-end' : ''}`}>
        <tbody>
        {
            doc.rows?.map(row => (
                <Row key={row.index} doc={row} />
            ))
        }
        </tbody>
        </table>
    );
};

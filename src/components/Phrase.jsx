import Measure from './Measure';

export default function Phrase({ doc }) {

    return (
        <div className="phrase" id={doc.id}>
            {
                doc.measures?.map(measure => (
                    <Measure key={measure.id} id={measure.id} doc={measure} />
                ))
            }
        </div>
    );
};

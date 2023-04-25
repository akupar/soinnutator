import Measure from './Measure';

export default function Phrase({ doc }) {

    return (
        <div className="phrase">
            {
                doc.measures?.map((measure, index) => (
                    <Measure key={index} doc={measure} />
                ))
            }
        </div>
    );
};

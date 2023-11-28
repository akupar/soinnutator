import Part from './Part';

export default function Structure({ parts }) {

    return (
        <div className="structure">
            { parts.map((part, key) => (
                <Part key={key} text={part} />
            ))}
        </div>
    );
};

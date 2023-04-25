export default function ExampleLink({ load, name }) {
    return (
        <button className="example-link" onClick={() => load(name)}>{name}</button>
    );
};

export default function Part({ text }) {

    return (
        <div className={`part ${text}`}>
            { text }
        </div>
    );
};

export default function Convention({ convention, setConvention }) {
    return (
        <select onChange={event => setConvention(event.target.value)} value={convention}>
            <option value="B">English (B, B♭)</option>
            <option value="H">German (H, B)</option>
            <option value="I">Degree (I, IV, V)</option>
        </select>
    );
};

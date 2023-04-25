export default function BaseNote({ notes, setNote, note }) {
    return (
        <select onChange={event => setNote(event.target.value)} value={note ?? notes[0]}>
            {
                notes && notes.map(note => (<option key={note} value={note}>{note}</option>))
            }
        </select>
    );
};

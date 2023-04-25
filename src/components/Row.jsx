import RowItem from './RowItem';

export default function Row({ doc }) {
    return (
        <div className={`line line-${doc.index}`} id={doc.id}>
            {
                <RowItem doc={doc} />
            }
        </div>
    );
};

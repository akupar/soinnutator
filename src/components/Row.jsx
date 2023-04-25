import RowItem from './RowItem';

export default function Row({ doc }) {
    return (
        <tr className={`line-${doc.index}`}>
            {
                <RowItem doc={doc} />
            }
        </tr>
    );
};

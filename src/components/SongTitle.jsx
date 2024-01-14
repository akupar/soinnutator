export default function SongTitle({ doc }) {
    return (doc.metadata?.title ?? doc.metadata?.rightTitle) && (
        <h1>
            { doc.metadata.title || "" }
            {
                doc.metadata?.rightTitle && <span className="right">
                    { doc.metadata.rightTitle }
                </span>
            }
        </h1>
    );
};

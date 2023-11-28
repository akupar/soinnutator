import Section from './Section';
import Structure from './Structure';

export default function RenderRoot({ doc, fontSize }) {
    const fontSizePercent = (fontSize * 100) + "%";
    return (
        <div className='rendered' style={{ fontSize: fontSizePercent }}>
            <h1>
                { doc.metadata?.title || "[Untitled]" }
                {
                    doc.metadata?.rightTitle && <span className="right">
                        { doc.metadata.rightTitle }
                    </span>
                }
            </h1>
            {
                doc.sections?.map(section => (
                    <Section key={section.id} id={section.id} doc={section} />
                ))
            }
        </div>
    );
};

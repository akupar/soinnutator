import Section from './Section';

export default function RenderRoot({ doc, fontSize }) {
    const fontSizePercent = (fontSize * 100) + "%";
    return (
        <div className='rendered' style={{ fontSize: fontSizePercent }}>
            <h1>{ doc.title }</h1>
            {
                doc.rightTitle && <span className="right">{ doc.rightTitle }</span>
            }
            {
                doc.sections?.map(section => (
                    <Section key={section.id} id={section.id} doc={section} />
                ))
            }
        </div>
    );
};

import Section from './Section';
import Structure from './Structure';
import SongTitle from './SongTitle';

export default function RenderRoot({ doc, fontSize }) {
    const fontSizePercent = (fontSize * 100) + "%";
    return (
        <div className='rendered' style={{ fontSize: fontSizePercent }}>
            <SongTitle doc={ doc }/>
            {
                doc.metadata?.structure && <Structure parts={doc.metadata.structure}/>
            }

            {
                doc.sections?.map(section => (
                    <Section key={section.id} id={section.id} doc={section} />
                ))
            }
        </div>
    );
};

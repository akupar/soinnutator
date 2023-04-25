export default function DoubleIndicator({ doubleSharp, doubleFlat }) {

    return (
        <span className='double-indicator'>
            { doubleSharp
              &&  <span style={{ color: 'red' }} title="Double sharp found">
                  𝄪
            </span>
            }
            { doubleFlat
            && <span style={{ color: 'red' }} title="Double flat found">
                𝄫
            </span>
            }
        </span>
    );
};

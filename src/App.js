import { useEffect, useState } from 'react';

import Convention from './components/Convention';
import ConventionContext from './components/ConventionContext';
import Editor from './components/Editor';
import Message from './components/Message';
import RenderRoot from './components/RenderRoot';
import DoubleIndicator from './components/DoubleIndicator';
import BaseNote from './components/BaseNote';
import ExampleLink from './components/ExampleLink';
import Help from './components/Help';

import { initialCode } from './config';

import Parser from './services/parser';
import transponator from './services/transponation';
import degreer from './services/degree';
import { getChordNameInConvention } from './services/englishGerman';

import './App.css';
import './render.css';
import './columns.css';

const initialTitle = document.title;

function getChords(parsed) {
    const chords = new Set();
    if ( !parsed.sections ) {
        return [];
    }

    for ( const section of parsed.sections ) {
        for ( const phrase of section.phrases ) {
            for ( const measure of phrase.measures ) {
                if ( measure.rows[0] && measure.rows[0].data ) {
                    chords.add(measure.rows[0].text);
                }
            }
        }
    }

    return Array.from(chords);
}

function notename(chord) {
    let m = chord.match("^([A-G](𝄫|𝄪|♭|♯)?)(.*?)/([A-G](𝄫|𝄪|♭|♯)?)$");

    if ( !m ) {
        m = chord.match("^([A-G](𝄫|𝄪|♭|♯)?)(.*?)$");
    }

    if ( !m ) {
        //throw new Error("Not a chord: " + chord);
        return null;
    }

    return m[1];
}

function getNotes(chords) {
    const notes = new Set();
    for ( const chord of chords ) {
        const nn = notename(chord);
        if ( nn ) {
            notes.add(nn);
        }
    }

    return Array.from(notes);
}


function App() {
    const [code, setCode] = useState(initialCode);
    const [parsed, setParsed] = useState({});
    const [message, setMessage] = useState({});
    const [fontSize, setFontSize] = useState(1.0);
    const [key, setKey] = useState(null);
    const [outputConvention, setOutputConvention] = useState('H');
    const [inputConvention, setInputConvention] = useState('H');
    const [transponation, setTransponation] = useState({ amount: 0, dir: +1 });
    const [doubleSharpIndicator, setDoubleSharpIndicator] = useState(false);
    const [doubleFlatIndicator, setDoubleFlatIndicator] = useState(false);
    const [transponationMapping, setTransponationMapping] = useState({});
    const [mapping, setMapping] = useState({});

    useEffect(() => {
        if ( parsed.title && parsed.rightTitle ) {
            document.title = parsed.title + " — " + parsed.rightTitle;
        } else if ( parsed.title ?? parsed.rightTitle ) {
            document.title = parsed.title ?? parsed.rightTitle;
        }
    }, [parsed]);


    useEffect(() => {
        const chords = getChords(parsed);
        try {
            const newMapping = transponator.getChordMapping(chords, transponation.amount, transponation.dir);
            setTransponationMapping(newMapping);
        } catch ( err ) {
            setMessage({ type: 'error', title: 'Error reading chords', body: String(err) });
        }

    }, [parsed, transponation]);


    useEffect(() => {
        const mappedChords = Object.values(transponationMapping);

        setDoubleSharpIndicator(
            mappedChords
                .some(val => val.includes("𝄪"))
        );
        setDoubleFlatIndicator(
            mappedChords
                .some(val => val.includes("𝄫"))
        );

    }, [transponationMapping]);


    useEffect(() => {
        const chords = getChords(parsed);
        let newMapping = {};
        if ( outputConvention === "B" || outputConvention === "H" ) {
            for ( const [from, to] of Object.entries(transponationMapping) ) {
                const toto = getChordNameInConvention(to, outputConvention);
                newMapping[from] = toto;
            }
        } else if ( outputConvention === 'I' ) {
            try {
                newMapping = degreer.getChordMapping(chords, key ?? notename(chords[0]));
            } catch ( err ) {
                setMessage({ type: 'error', title: 'Error converting chords', body: String(err) });
            }
        }

        setMapping(newMapping);

    }, [outputConvention, key, transponationMapping, parsed]);

    const render = () => {
        const parser = new Parser(inputConvention);
        const parsed = parser.parse(code);
        if ( parsed && parsed.metadata ) {
            if ( parsed.metadata.title && parsed.metadata.rightTitle ) {
                document.title = parsed.metadata.title + " — " + parsed.metadata.rightTitle;
            } else {
                document.title = parsed.metadata.title ?? parsed.metadata.rightTitle ?? initialTitle;
            }
        }
        setParsed(parsed);
    };

    useEffect(render, [inputConvention, code]);


    const loadExample = async (name) => {
        try {
            const result = await fetch(`/soinnutator/examples/${name}.txt`);
            if ( result.headers.get('content-type').toLowerCase() !== "text/plain; charset=utf-8" ) {
                throw new Error(`Couldn't load ${name}`);
            }
            const text = await result.text();
            setCode(text);
        } catch ( err ) {
            setMessage({ type: 'error', title: 'Error fetching example', body: String(err) });
        }
    };



    const callPrint = () => {
        // eslint-disable-next-line no-restricted-globals
        print();
    };

    const changeTransponation = newAmount => {
        if ( newAmount === 12 || newAmount === -12 ) {
            newAmount = 0;
        }
        const oldAmount = transponation.amount;
        const dir = newAmount < oldAmount ? -1 : +1;
        setTransponation({ amount: newAmount, dir });
    };


    return (
        <div className="App">
            <ConventionContext.Provider value={{ mapping }}>
                <div className="render-toolbar no-print">
                    <button onClick={callPrint}>Print</button>
                    {' '}
                    <label>Font size: </label>
                    <input
                        type="number"
                        min="0.1"
                        max="2"
                        step="0.01"
                        onChange={(event) => setFontSize(event.target.value)}
                        value={fontSize}
                    />
                    {' '}
                    <label>Chord format: </label>
                    <Convention
                        convention={outputConvention}
                        setConvention={value => setOutputConvention(value)}
                    />
                    {' '}
                    { (outputConvention === "B" || outputConvention === "H")
                      && <>
                          <label>Transponation: </label>
                          <input
                              type="number"
                              min={-12}
                              max={12}
                              onChange={event => changeTransponation(Number(event.target.value))}
                              value={transponation.amount}
                          />
                      </>
                    }
                    { outputConvention === "I"
                      && <>
                          <label>I: </label>
                          <BaseNote notes={getNotes(getChords(parsed))} setNote={setKey} note={key} />
                      </>
                    }
                    {' '}
                    <DoubleIndicator doubleSharp={doubleSharpIndicator} doubleFlat={doubleFlatIndicator} />
                </div>
                <div className="rendering">
                    <RenderRoot doc={parsed} fontSize={fontSize} />
                </div>
                <div className="bottom-section no-print">
                    <Message message={message} setMessage={setMessage} />
                    <div className="examples-group">
                        <h3>Examples</h3>
                        <div className="examples">
                            <ExampleLink load={loadExample} name={"Drunken sailor"} />
                            <ExampleLink load={loadExample} name={"Vihreät niityt"} />
                            <ExampleLink load={loadExample} name={"Polte"} />
                            <ExampleLink load={loadExample} name={"Amsterdam"} />
                            <ExampleLink load={loadExample} name={"Hello"} />
                        </div>
                    </div>
                    <div className="code-group">
                        <button onClick={render}>Render</button>
                        {' '}
                        <label>Chord convention: </label>
                        <Convention convention={inputConvention} setConvention={setInputConvention} />
                        <Editor code={code} setCode={setCode} />
                    </div>
                    <Help/>
                </div>
            </ConventionContext.Provider>
        </div>
);
}

export default App;

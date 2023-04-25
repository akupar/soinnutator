import React from 'react';

import { HighlightWithinTextarea } from 'react-highlight-within-textarea'

const highlightings = [
  {
      highlight: '|',
      className: "hl-bar",
  },
    {
        highlight: /\b\(?[ABCDEFGH][^ \n]*\)?\b/g,
        className: "hl-chord",
    },
    {
        highlight: /(^|\n)#[^ \n]+/g,
        className: "hl-pragma",
    },
];

const Editor = ({ code, setCode }) => {
    return (
        <div className="scroll-pane">
            <HighlightWithinTextarea
                value={code}
                highlight={highlightings}
                onChange= {setCode}
            />
        </div>
    );
};

export default Editor;

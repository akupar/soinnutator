export default function Help() {

    return (
        <div className="help">
            <h2>Syntax</h2>
            <p>
                Separate groups of lines with empty lines.
            </p>

            <p>
                Add bars with <tt>|</tt>, and <tt>¦</tt>. Align texts on
                group of lines with spaces. When wors on a group of lines are aligned, so
                that at least one of the lines has two or more spaces in front of a word,
                the words are aligned on each line.
            </p>

            <p>
                Use <tt>$</tt> to add space.
            </p>

            <h2>Special metadata pragmas</h2>
            <dl>
                <dt>#title</dt>
                <dd>
                    <p>Set title of piece.</p>
                    <pre>
                        #title Hello song
                    </pre>
                </dd>

                <dt>#right</dt>
                <dd>
                    <p>Set text right of title, eg. composer or artist.</p>
                    <pre>
                        #right Hank de la Croix
                    </pre>
                </dd>

                <dt>#structure</dt>
                <dd>
                    <p>Display song structure. Separate parts with <tt>|</tt>.</p>
                    <pre>
                        #structure Verse 1 | Verse 2 | Chorus | Verse 3 | Chorus
                    </pre>
                </dd>

                <dt>#section</dt>
                <dd>
                    <p>Start a new section. Parametre: section name</p>
                    <pre>
                        #section Verse 1
                    </pre>
                </dd>
            </dl>
        </div>
    );
};

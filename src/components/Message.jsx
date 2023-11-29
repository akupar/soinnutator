import { useEffect } from 'react';

let timeoutId;
export default function Message({ message, setMessage }) {
    const { type, title, body } = message;

    useEffect(() => {
        timeoutId = window.setTimeout(() => {
            setMessage({ title: undefined, body: undefined });
        }, 4000);

        return () => window.clearTimeout(timeoutId);
    }, [title, body, setMessage]);

    const display = (body ?? title) ? 'block' : 'none';
    return (
        <div className='message-box'>
          <div className={`app-message ${type ?? ''}`} style={{ display: display }}>
            <h2>{title}</h2>
            <p>
                {body}
            </p>
        </div>
        </div>
    );
};

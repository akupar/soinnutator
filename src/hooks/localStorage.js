const [source, setSource] = useState(null);

useEffect(() => {
    if ( source !== null ) {
        localStorage.setItem('source', JSON.stringify(source));
    }
}, [source]);

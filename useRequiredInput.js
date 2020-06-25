const useRequiredInput = (text) => {
	const [text, setText] = useState(text)
	const [err, setErr] = useState("")

	useEffect(() => {
		if (!text){
			setErr("Empty")
		}
		else
			setErr("")
	},[text])

	return [text, setText, err]
}

const [text, setText, err] = useRequiredInput("")
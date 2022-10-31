function AddDescription(props) {
    const [description, setDescription] = useState("");
    const [myPresence, updateMyPresence] = useMyPresence();
    const addDescription = useMutation(({ storage }, description) => {
      const todo = storage.get("todos").get(props.index)
      todo.description = description
      storage.get("todos").set(props.index, todo)
    }, []);
    return (
        <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                updateMyPresence({ isTyping: true });
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                updateMyPresence({ isTyping: false });
                addDescription(description)
                setDescription("");
                }
            }}
            onBlur={() => updateMyPresence({ isTyping: false })}
            />
    )
}
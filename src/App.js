import { useState, Suspense } from "react";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";

function WhoIsHere() {
  const userCount = useOthers((others) => others.length);

  return (
    <div className="who_is_here">
      There are {userCount} other users online
    </div>
  );
}

function SomeoneIsTyping() {
  const someoneIsTyping = useOthers((others) =>
    others.some((other) => other.presence.isTyping)
  );

  return (
    <div className="someone_is_typing">
      {someoneIsTyping ? "Someone is typing..." : ""}
    </div>
  );
}

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

function AddGroupChat(props) {
  const [groupChat, setGroupChat] = useState("");
  const [myPresence, updateMyPresence] = useMyPresence();
  const addGroupChat = useMutation(({ storage }, groupChat) => {
    const todo = storage.get("todos").get(props.index)
    if (!todo.groupChat) {
      todo.groupChat = groupChat
    } else {
      todo.groupChat = todo.groupChat + '\n' + groupChat
    }
    
    storage.get("todos").set(props.index, todo)
  }, []);
  return (
    <input
        type="text"
        placeholder="Group chat"
        value={groupChat}
        onChange={(e) => {
          setGroupChat(e.target.value);
          updateMyPresence({ isTyping: true });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateMyPresence({ isTyping: false });
            setGroupChat(e.target.value);
            addGroupChat(groupChat)
            setGroupChat("");
          }
        }}
        onBlur={() => updateMyPresence({ isTyping: false })}
      />
  )
}

function AddType(props) {
  const addType = useMutation(({ storage }, type) => {
    const todo = storage.get("todos").get(props.index)
    todo.type = type
    storage.get("todos").set(props.index, todo)
  }, []);
  return (
    <select 
      name="type" 
      id="type"
      onChange={(e) => {
        addType(e.target.value)
      }}
    >
      <option value="develop">develop</option>
      <option value="debug">debug</option>
      <option value="data processing">data processing</option>
      <option value="devops">devops</option>
    </select>
  )
}

function AddDeadline(props) {
  const addDeadline = useMutation(({ storage }, deadline) => {
    const todo = storage.get("todos").get(props.index)
    todo.deadline = deadline
    storage.get("todos").set(props.index, todo)
  }, []);
  return (
    <input 
      type="date" 
      id="deadline" 
      name="deadline"
      value="2018-07-22"
      min="2018-01-01" 
      max="2050-12-31"
      onChange={(e) => {
          addDeadline(e.target.value)
      }}
    >
    </input>
  )
}

function Room() {
  const [draft, setDraft] = useState("");
  const [myPresence, updateMyPresence] = useMyPresence();
  const todos = useStorage((root) => root.todos);

  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push({ text })
  }, []);

  const deleteTodo = useMutation(({ storage }, index) => {
    storage.get("todos").delete(index);
  }, []);

  return (
    <div className="container">
      <WhoIsHere />
      <input
        type="text"
        placeholder="What needs to be done?"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          updateMyPresence({ isTyping: true });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateMyPresence({ isTyping: false });
            addTodo(draft);
            setDraft("");
          }
        }}
        onBlur={() => updateMyPresence({ isTyping: false })}
      />
      <SomeoneIsTyping />
      {todos.map((todo, index) => {
        let color;
        if (todo.deadline) {
          const deadline = new Date(todo.deadline);
          if (deadline < new Date()){
            color = 'red'
          }
        }
        return (
          <div key={index} className="todo_container">
            <div className="todo">{todo.text}</div>
            <div className="description">{todo.description}</div>
            <div className="type">{todo.type}</div>
            <div className="deadline">{todo.deadline}</div>
            <div className="groupChat">{todo.groupChat}</div>
            <AddDescription index={index}/>
            <AddType index={index}/>
            <AddDeadline index={index}/>
            <AddGroupChat index={index}/>
            <button
              className="delete_button"
              onClick={() => deleteTodo(index)}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function App({ roomId }) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ isTyping: false }}
      initialStorage={{ todos: new LiveList() }}
    >
      <Suspense fallback={<Loading />}>
        <Room />
      </Suspense>
    </RoomProvider>
  )
}

function Loading() {
  return (
    <div className="loading">
      <img src="https://liveblocks.io/loading.svg" alt="Loading" />
    </div>
  );
}

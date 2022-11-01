import { useState, Suspense } from "react";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";
import TodoCard from "./TodoCard";
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

function Room() {
  const [draft, setDraft] = useState("");
  const [myPresence, updateMyPresence] = useMyPresence();
  const todos = useStorage((root) => root.todos);
  console.log(todos);
  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push({ text })
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
          <TodoCard todo={todo} key={index} index={index}/>
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

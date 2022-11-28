import { useState, Suspense } from "react";
import dayjs from "dayjs";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";
import ColumnView from "./ColumnView";
import { v4 as uuidv4 } from 'uuid';
import { Typography } from "@mui/material";
function WhoIsHere() {
  const userCount = useOthers((others) => others.length);

  return (
    <div className="who_is_here" >
      <Typography sx={{ fontFamily:'Arial', color:'#667085', fontSize: 16, fontWeight: 'bold'}}>
        There are {userCount} other users online
      </Typography>
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
  const initialTask = {
    description: '', 
    type: 'Features', 
    deadline: dayjs().add(5, 'day'), 
    person: 'Nobody', 
    status: 'Not Started',
  }
  const [draft, setDraft] = useState("");
  const [myPresence, updateMyPresence] = useMyPresence();
  const todos = useStorage((root) => root.todos);
  console.log(todos);
  const addTodo = useMutation(({ storage }, text) => {
    storage.get("todos").push({ 
      text, 
      task_id: uuidv4(),
      ...initialTask })
  }, []);

  return (
    <div className="container" >
      <WhoIsHere />
      <input
        type="text"
        id="inputtitle"
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
      <ColumnView todos={todos} />
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

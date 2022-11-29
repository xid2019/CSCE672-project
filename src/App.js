import { useState, useEffect, Suspense } from "react";
import dayjs from "dayjs";
import { RoomProvider, useOthers, useUpdateMyPresence, useMyPresence, useStorage, useMutation } from "./liveblocks.config";
import { LiveList } from "@liveblocks/client";
import ColumnView from "./ColumnView";
import { v4 as uuidv4 } from 'uuid';
import { Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

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
  const [filterTodoPerson, setFilterTodoPerson] = useState("All");

  const [myPresence, updateMyPresence] = useMyPresence();
  const todos = useStorage((root) => root.todos);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  useEffect(() => {
    setFilteredTodos(todos);
    setFilterTodoPerson("All");
  }, [todos]);
  const filterTodos = (event) => {
    setFilterTodoPerson(event.target.value);
    console.log("filterTodos called")
    if (event.target.value==="All") {
      setFilteredTodos(todos)
    } else {
      setFilteredTodos(todos.filter(todo => todo.person===event.target.value))
    }
    
  };
  console.log("Todo lists are: ", todos);
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
      <Box sx={{ Width: 10 }}>
        <FormControl fullWidth>
          <Typography>Filtered By Person</Typography>
          <Select sx={{ width: 1/2 }} id="filterTodoPerson" value={filterTodoPerson} onChange={filterTodos}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Nobody">Nobody</MenuItem>
              <MenuItem value="Fengyi Wang">Fengyi Wang</MenuItem>
              <MenuItem value="Jincheng Li">Jincheng Li</MenuItem>
              <MenuItem value="Sibo Min">Sibo Min</MenuItem>
              <MenuItem value="Xiaomu Dong">Xiaomu Dong</MenuItem>
              <MenuItem value="Zihan Wang">Zihan Wang</MenuItem>
          </Select>
        </FormControl>
      </Box>
        
      <SomeoneIsTyping />
      <ColumnView todos={filteredTodos} />
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

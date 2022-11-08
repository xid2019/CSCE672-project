import React from 'react'
import TodoCard from "./TodoCard";

const ColumnView = ({todos}) => {
    console.log(todos)
    return (
        <div>
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
    )
}

export default ColumnView
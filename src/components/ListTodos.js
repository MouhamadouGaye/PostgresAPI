import React, { useEffect, useState } from "react";
import EditTodos from "./EditTodos";

const ListTodos = () => {
  const [todos, setTodos] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const getDatas = async () => {
    try {
      const res = await fetch("http://localhost:3006/todos");
      const data = await res.json();
      console.log(data);
      setTodos(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteTodo = await fetch(`http://localhost:3006/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <div>
      <h1>List Todo!</h1>
      <table class="table mt-5 text-center">
        <thead>
          <tr>
            <th>Desciption</th>
            <th>Editing</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos && todos.length > 0
            ? todos.map((item) => (
                <tr key={item.todo_id}>
                  <td>{item.description}</td>
                  <td>
                    <EditTodos todo={item} />
                    {/* <button
                      className="btn btn-primary"
                      onClick={(e) => handleEdit(item.todo_id)}
                    >
                      {" "}
                      Edit
                    </button> */}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDelete(item.todo_id)}
                    >
                      {" "}
                      Delete
                    </button>
                  </td>
                  {}
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
};

export default ListTodos;

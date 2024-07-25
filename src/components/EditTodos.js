import React, { useState } from "react";

const EditTodos = ({ todo }) => {
  const [description, setDescription] = useState(todo.description);

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const body = { description };
      const res = await fetch(`http://localhost:3006/todos/${todo.todo_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location.reload();

      // Clear the input field after submission
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    //!-- Button to Open the Modal -->
    <>
      <div class="modal" id={`id${todo.todo_id}`}>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Modal Heading</h4>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <form onSubmit={onSubmit}>
              <div class="modal-body">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  class="form-control"
                />
              </div>

              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#id${todo.todo_id}`}
      >
        Edit
      </button>
    </>
  );
};

export default EditTodos;

// import React, { Fragment, fragment, useEffect, useState } from "react";

// const InputTodo = () => {
//   const [description, setDescription] = useState("");

//   const onSubmit = async () => {
//     try {
//       const body = { description };
//       const res = await fetch("http://localhost:3006/todos", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(body),
//       });
//     } catch (err) {
//       console.log(err.message);
//     }
//   };

//   useEffect(() => {
//     onSubmit();
//   }, []);
//   return (
//     <Fragment>
//       <h1 className=" text-center mt-5">Kobe Todo List</h1>
//       <form className="d-flex mt-5" onSubmit={onSubmit}>
//         <input
//           type="text"
//           className="form-control"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <button className="btn btn-sucess"> Add</button>
//       </form>
//     </Fragment>
//   );
// };

// export default InputTodo;

import { useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const body = { description };
      const res = await fetch("http://localhost:3006/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <h1 className=" text-center mt-5">Kobe Todo List</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
};

export default InputTodo;

import { useState, useEffect } from "react";
import "./App.css";
import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";

function App() {
  const [title, setTitle] = useState([]);

  return (
    <div className="App">
      <div className="container">
        <InputTodo />
        <ListTodos />
      </div>
      {/* <ul className="">
        {title.map((item, index) => (
          <li key={index} className="container2">
            <span>{item.todo_id}</span>
            <h1>{item.description}</h1>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default App;

// import { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   const [title, setTitle] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await fetch("http://localhost:3006/todos");
//       if (!res.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setTitle(data);
//       } else {
//         console.error("Data is not an array:", data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="App">
//       <ul className="container">
//         {title.map((item, index) => (
//           <li key={index} className="container2">
//             <span>{item.todo_id}</span>
//             <h1>{item.description}</h1>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

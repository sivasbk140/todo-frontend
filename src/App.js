import React from 'react';
import Todo from './Todo'; // ✅ Make sure this path is correct

function App() {
  return (
    <div
      style={{
        backgroundImage: "url('/todoimage.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ color: "white", padding: "20px" }}>Hello SBK</h1>
      <Todo />
    </div>
  );
}

export default App; // ✅ This line is essential

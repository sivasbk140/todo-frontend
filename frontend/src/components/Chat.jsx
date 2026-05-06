import React from "react";

function Chat() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <i
        className="bi bi-cone-striped text-warning mb-3"
        style={{ fontSize: "5rem" }}
      ></i>
      <h2 className="fw-bold mb-2">Page is under construction</h2>
      <p className="text-muted mb-0">
        We're working on it. Please check back soon.
      </p>
    </div>
  );
}

export default Chat;

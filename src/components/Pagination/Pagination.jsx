import React, { useState } from "react";

 const Pagination = ({ data,totalPages,setCurrentPage,currentPage }) => {


  const handleClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-[80%] mx-auto">
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.nom}</li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              backgroundColor: currentPage === index + 1 ? "#007bff" : "#ccc",
              color: currentPage === index + 1 ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Pagination

import React from "react";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import EditProfi from "../components/EditProfi";

export default function Settings() {
  return (
    <>
    <Navbar />
    <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <EditProfi  />
        </Box>
      </Box>
    </>
  );
}

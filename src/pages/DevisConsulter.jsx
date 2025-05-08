import React from "react";
import Navbar from "../components/Navbar";
import DocumentConsulter from "../components/DocumentConsulter";

export default function DevisConsulter() {
  return (
    <>
      <Navbar />
      <DocumentConsulter typeDocument="Devis" />
    </>
  );
}
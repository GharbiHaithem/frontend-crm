import React from "react";
import Navbar from "../components/Navbar";
import DocumentConsulter from "../components/DocumentConsulter";

export default function FacturesConsulter() {
  return (
    <>
      <Navbar />
      <DocumentConsulter typeDocument="Facture" />
    </>
  );
}

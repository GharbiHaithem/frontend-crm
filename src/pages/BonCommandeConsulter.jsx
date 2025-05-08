import React from "react";
import Navbar from "../components/Navbar";
import DocumentConsulter from "../components/DocumentConsulter";

export default function BonCommandeConsulter() {
  return (
    <>
      <Navbar />
      <DocumentConsulter typeDocument="Bon Commande" />
    </>
  );
}
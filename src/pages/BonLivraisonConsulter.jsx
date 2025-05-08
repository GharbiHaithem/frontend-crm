import React from "react";
import Navbar from "../components/Navbar";
import DocumentConsulter from "../components/DocumentConsulter";

export default function BonLivraisonConsulter() {
  return (
    <>
      <Navbar />
      <DocumentConsulter typeDocument="Bon Livraison" />
    </>
  );
}

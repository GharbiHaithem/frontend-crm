import React from "react";
import Navbar from "../components/Navbar";
import DocumentForm from "../components/DocumentForm";

export default function FactureForm() {
  return (
    <>
      <Navbar />
      {/* Afficher directement le formulaire sans bouton */}
      <DocumentForm typeDocument="Facture" />
    </>
  );
}

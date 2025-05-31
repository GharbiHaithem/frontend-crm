import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Settings from "./pages/Settings";
import About from "./pages/About";
import ClientForm from "./components/ClientForm";
import Home from "./pages/Home";
import NavBar from "./components/Navbar";
import Sidenav from "./components/Sidenav";
import Article from "./pages/Article";
import CreateArticle from "./pages/createArticle";
import FamilleArticle from "./pages/FamilleArticle";
import CreateFamilleArticle from "./pages/createFamilleArticle";
import CategorieArticle from "./pages/CategorieArticle";
import CreateCategorieArticle from "./pages/createCategorieArticle";
import BonCommandePage from "./pages/BonCommande";
import Devis from "./pages/Devis";
import DocumentForm from "./components/DocumentForm";
import BonCommande from "./pages/BonCommande";
import DevisConsulter from "./pages/DevisConsulter";
import BonCommandeConsulter from "./pages/BonCommandeConsulter";
import BonLivraisonConsulter from "./pages/BonLivraisonConsulter";
import FacturesConsulter from "./pages/FacturesConsulter";
import BonCommandeForm from "./pages/BonCommandeForm";
import BonLivraisionForm from "./pages/BonLivraisionForm";
import BonLivraisonPage from "./pages/BonLivraision";
import FactureForm from "./pages/FactureForm";
import DocumentDetails from "./components/DocumentDetails";
import DocumentEdit from "./components/DocumentEdit";
import EditProfi from "./components/EditProfi";
import ClientPage from "./pages/ClientPage";
import EventCalendar from "./components/calendar/EventCalendar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Payement from "./components/Payement";
import PaymentSuccess from "./pages/PayementSuccess";
import DetailsClient from "./pages/DetailsClient";
import DetailsArticle from "./components/DetailsArticle/DetailsArticle";
import Caisse from "./components/Caisse";
import CaisseForm from "./components/CaisseForm";
import DetailsPayement from "./components/DetailsPayement";
import InfoProfil from "./pages/InfoProfil";
import { useAppStore } from "./appStore";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout component with Navbar and Sidebar
const DashboardLayout = ({ children }) => {
 
  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      <div className="flex">
        <Sidenav />
        <main className="flex-1 p-6 ml-16 md:ml-64 pt-20">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const darkMode = useAppStore((state) => state.darkMode); // ✅ lié au re-render
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <AuthProvider>
      <div className={`App  `}>
        <Routes>
          {/* Public routes */}
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        

          {/* Protected routes with dashboard layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/home" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClientPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
  <Route
            path="/clients/details/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DetailsClient />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients/new"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClientForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
  <Route
            path="/article/details/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DetailsArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClientForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/FamilleArticle"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FamilleArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/FamilleArticle/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateFamilleArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Articles"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Article />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Article/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            
     <Route
            path="/Article/update/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorieArticle"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CategorieArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categorieArticle/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateCategorieArticle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/devis"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Devis />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
  <Route
            path="/payement"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Payement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PaymentSuccess />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        
          <Route
            path="/documents/modifier/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/nouveau"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bon-commande"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonCommande />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/bon-livraison"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonLivraisonPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/devis-consulter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DevisConsulter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Bon Commande-consulter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonCommandeConsulter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Bon livraison-consulter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonLivraisonConsulter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/factures"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FacturesConsulter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/devis/ajouter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Devis />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Bon Commande/ajouter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonCommandeForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/Bon livraison/ajouter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BonLivraisionForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/facture/ajouter"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FactureForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/document/:typeDocument/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/document/:typeDocument/edit/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentEdit />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
 <Route
            path="/payement/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DetailsPayement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <About />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
     <Route
            path="/caisse"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Caisse />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/caisse/new"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CaisseForm />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
  <Route
            path="/infoProfil"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InfoProfil/>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/EventCalendar"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EventCalendar />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;

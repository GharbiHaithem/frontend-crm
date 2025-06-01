import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import { FaMoon, FaSun } from "react-icons/fa6";

// Menu items configuration
const menuItems = [
  { path: "/home", label: "Dashboard", icon: "home" },

  
  { path: "/clients", label: "Clients", icon: "users" },
  { path: "/articles", label: "Articles", icon: "document" },
  { path: "/FamilleArticle", label: "Famille d'articles", icon: "collection" },
  { path: "/categorieArticle", label: "Catégorie d'articles", icon: "tag" },
  { path: "/devis-consulter", label: "Devis", icon: "document-text" },
  {
    path: "/Bon Commande-consulter",
    label: "Bons de Commande",
    icon: "shopping-cart",
  },
  {
    path: "/Bon livraison-consulter",
    label: "Bons de Livraison",
    icon: "truck",
  },
  { path: "/factures", label: "Factures", icon: "receipt-tax" },
  { path: "/payement", label: "Payement", icon: "payement" },
  { path: "/EventCalendar", label: "Calendrier", icon: "calendar" },
  { path: "/settings", label: "Paramètres", icon: "cog" },
 
];

// Icon component to render the appropriate SVG based on icon name
const Icon = ({ name }) => {
  switch (name) {
    case "home":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
     case "caisse":
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7h16M4 11h16M4 15h16M4 19h16M8 3h8v4H8V3z"
      />
    </svg>
  );

    case "users":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    case "document":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    case "collection":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    case "tag":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      );
    case "document-text":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "shopping-cart":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "truck":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      );
    case "receipt-tax":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
          />
        </svg>
      );
      case "payement" : 
      return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v1.5H2.25v-1.5zM2.25 9.75h19.5v7.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25v-7.5zM6 15h2.25"
        />
      </svg>
      

      );
    case "calendar":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    case "cog":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case "information-circle":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      );
  }
};

export default function Sidenav() {
    const darkMode = useAppStore((state) => state.darkMode); // ✅ lié au re-render
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
   useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const navigate = useNavigate();
  const dopen = useAppStore((state) => state.dopen);
  const UpdateOpen = useAppStore((state) => state.UpdateOpen);
 const {role} = JSON.parse(localStorage.getItem('user'))
 console.log(role)
  return (
    <aside
      className={`fixed left-0 top-16 h-full bg-white shadow-md transition-all duration-300 z-40 ${
        dopen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex   flex-col h-full">
        {/* Header with toggle button */}
           
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`${dopen?'flex':'hidden'} `}>
              <span className="text-xl font-bold text-primary-700">Dashboard</span>
            </div>
          <button
            onClick={() => UpdateOpen(!dopen)}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            {dopen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
           {menuItems.map((item, index) => {
  // Ne pas afficher l'item "Articles" si le rôle est admin
  if (item.label === "Articles" &&  role === "represantant") {
    return null;
  }
 if ( item.label === "Clients"&&  role === "represantant") {
    return null;
  }
   if (item.label === "Articles"  &&  role === "represantant") {
    return null;
  }
    if ( item.label === "Catégorie d'articles"  &&  role === "represantant") {
    return null;
  }
    if ( item.label === "Famille d'articles" &&  role === "represantant") {
    return null;
  }
  
  return (
    <li key={index}>
      <button
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors ${
          dopen ? "justify-start" : "justify-center"
        }`}
      >
        <span className="text-gray-500">
          <Icon name={item.icon} />
        </span>
        {dopen && (
          <span className="ml-3 text-sm font-medium truncate">
            {item.label}
          </span>
        )}
      </button>
    </li>
  );
})}

  

          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {dopen && (
            <div className="text-xs text-gray-500 text-center">CRM v1.0.0</div>
          )}
        </div>
      </div>
    </aside>
  );
}

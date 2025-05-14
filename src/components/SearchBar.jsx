import React from 'react'
import axios from 'axios'
const SearchBar = ({ searchQuery, setSearchQuery ,setClients}) => {
        const handleSearch = async (value) => {
        try {
            const response = await axios.get(`http://localhost:5000/clients/search?query=${value}`);
            console.log(response.data);
            setClients(response.data)
        } catch (error) {
            console.error("Erreur de recherche:", error.response?.data || error.message);
        }
    };
       const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Utilisez un debounce au lieu de setTimeout
        const timer = setTimeout(() => {
            if(value.trim().length > 0) {
                handleSearch(value);
            }
        }, 500); // Réduisez à 500ms
        
        return () => clearTimeout(timer);
    };
      return (
            <div className="hidden md:block ml-6">
                  <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                              >
                                    <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                              </svg>
                        </div>
                        <input
                              type="text"
                              placeholder="Search..."
                              value={searchQuery}
                           onChange={handleChange}
                              className="block w-full pl-10 pr-3 py-3 border placeholder:font-bold border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                  </div>
            </div>
      )
}

export default SearchBar
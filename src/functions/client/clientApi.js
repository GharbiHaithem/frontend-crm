import axios from "axios";
import { BACKENDAPI } from "../../utils/constant/constant";

export const getAllClients = async (page = 1, filters = {}) => {
  try {
    const response = await axios.get(`${BACKENDAPI}/clients`, {
      params: { page, ...filters }, // Pass page & filters as query params
    });
    return response.data; // Return the fetched data
  } catch (error) {
    console.error('Erreur lors du chargement des clients', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

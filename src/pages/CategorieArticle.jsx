import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Paper,
  Menu,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { Delete, Edit, Add, Visibility, FilterList } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CategorieArticle() {
  const [categorieArticles, setCategorieArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategorieArticleId, setSelectedCategorieArticleId] = useState(null);
  const navigate = useNavigate();

    // Fetch fournisseurs from the backend
    const fetchCategorieArticle = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categorie"); // Update with your backend URL
        setCategorieArticles(response.data);
      } catch (error) {
        console.error("Error fetching Categorie Article:", error);
      }
    };

  // Delete categorie article by ID
  const deleteCategorieArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/categorie/${id}`);
      fetchCategorieArticle(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting categorie article:", error);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedCategorieArticleId(id);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategorieArticleId(null);
  };

  // Handle filter click
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setOpenFilterMenu((prev) => !prev);
  };

  // Handle filter close
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setOpenFilterMenu(false);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setPage(1); // Reset to the first page when applying filters
    fetchCategorieArticle();
    handleFilterClose();
  };

  // Handle next page
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Effect to fetch data when component mounts or filters/page change
  useEffect(() => {
    fetchCategorieArticle();
  }, [page, filters]);

  return (
    <>
      {/* Navbar fixe */}
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        {/* Sidenav */}
        <Sidenav />
        {/* Contenu principal */}
        <Container maxWidth="lg" style={{ padding: "20px", width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography
              variant="h4"
              style={{
                fontWeight: "bold",
                color: "#1976d2",
                fontSize: "2rem",
              }}
            >
              Liste des Catégories d'Articles
            </Typography>
            <div>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/categorieArticle/create"
                startIcon={<Add style={{ fontSize: "1.5rem" }} />}
                style={{
                  marginRight: "10px",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  padding: "10px 20px",
                }}
              >
                Ajouter une catégorie
              </Button>
              <IconButton
                onClick={handleFilterClick}
                color="primary"
                aria-label="filtrer"
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontSize: "1.5rem",
                }}
              >
                <FilterList style={{ fontSize: "1.5rem" }} />
              </IconButton>
            </div>
          </div>

          <Paper elevation={3} style={{ borderRadius: "10px", overflow: "hidden", width: "100%" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <CircularProgress size={50} />
              </div>
            ) : (
              <Table style={{ width: "100%" }}>
                <TableHead style={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    {["Code", "Designation Categorie", "Actions"].map((header, index) => (
                      <TableCell
                        key={index}
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "#1976d2",
                          fontSize: "1.2rem",
                          padding: "20px",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(categorieArticles) && categorieArticles.map((categorieArticle) => (
                    <TableRow key={categorieArticle._id} hover style={{ height: "60px" }}>
                      <TableCell style={{ fontSize: "1.1rem", padding: "20px" }}>
                        {categorieArticle.codeCategorie}
                      </TableCell>
                      <TableCell style={{ fontSize: "1.1rem", padding: "20px" }}>
                        {categorieArticle.designationCategorie}
                      </TableCell>
                      <TableCell style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenDialog(categorieArticle._id)}
                            aria-label="supprimer"
                            style={{ fontSize: "1.5rem" }}
                          >
                            <Delete style={{ fontSize: "1.5rem" }} />
                          </IconButton>
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`/CategorieArticle/update/${categorieArticle._id}`}
                            aria-label="modifier"
                            style={{ fontSize: "1.5rem" }}
                          >
                            <Edit style={{ fontSize: "1.5rem" }} />
                          </IconButton>
                          <IconButton
                            color="info"
                            component={Link}
                            to={`/details/${categorieArticle._id}`}
                            aria-label="détails"
                            style={{ fontSize: "1.5rem" }}
                          >
                            <Visibility style={{ fontSize: "1.5rem" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>

          {/* Menu des filtres */}
          <Menu
            anchorEl={filterAnchorEl}
            open={openFilterMenu}
            onClose={handleFilterClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <Paper style={{ padding: "20px", width: "300px", borderRadius: "10px" }}>
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  color: "#1976d2",
                  fontSize: "1.2rem",
                }}
              >
                Filtres
              </Typography>
              <TextField
                name="code"
                label="Code"
                value={filters.code || ""}
                onChange={handleFilterChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="medium"
                style={{ fontSize: "1.1rem" }}
              />
              <TextField
                name="designationCategorie"
                label="Designation Categorie"
                value={filters.designationCategorie || ""}
                onChange={handleFilterChange}
                fullWidth
                margin="normal"
                variant="outlined"
                size="medium"
                style={{ fontSize: "1.1rem" }}
              />
              <Button
                onClick={applyFilters}
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  marginTop: "10px",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  padding: "10px 20px",
                }}
              >
                Appliquer
              </Button>
            </Paper>
          </Menu>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton
              onClick={handlePreviousPage}
              disabled={page === 1}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ mx: 2, display: "flex", alignItems: "center" }}>
              Page {page} sur {totalPages}
            </Box>
            <IconButton
              onClick={handleNextPage}
              disabled={page === totalPages}
              color="primary"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Supprimer la Catégorie d'Article</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer cette catégorie d'article ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Non
          </Button>
          <Button
            onClick={() => {
              deleteCategorieArticle(selectedCategorieArticleId);
              handleCloseDialog();
            }}
            color="secondary"
          >
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
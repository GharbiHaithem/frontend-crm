import React from 'react';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Button, FormGroup } from '@mui/material';

const Filter = ({ showFilters, setShowFilters, filters, setFilters, search, setSearch, selectedFilters, setSelectedFilters, resetFilters, availableFilters }) => {
  const handleFilterToggle = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    showFilters && (
      <div style={{ marginLeft: '-20px' }}>
        <Box sx={{ width: '250px', padding: 2, backgroundColor: '#f8f8f8', borderRadius: 2, ml: 'auto', mr: 0, maxHeight: '300px', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Filtres</Typography>
          <TextField
            label="Rechercher un filtre"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormGroup>
            {availableFilters.filter(filter => filter.includes(search.toLowerCase())).map((filter) => (
              <FormControlLabel
                key={filter}
                control={<Checkbox checked={selectedFilters.includes(filter)} onChange={() => handleFilterToggle(filter)} />}
                label={filter.replace('_', ' ').toUpperCase()}
              />
            ))}
          </FormGroup>
          <Box mt={2}>
            {selectedFilters.map((filter) => (
              <TextField
                key={filter}
                name={filter}
                label={filter.replace('_', ' ').toUpperCase()}
                variant="outlined"
                fullWidth
                value={filters[filter] || ''}
                onChange={handleFilterChange}
                sx={{ mt: 1 }}
              />
            ))}
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary">Appliquer</Button>
            <Button variant="outlined" color="secondary" onClick={resetFilters}>Réinitialiser</Button>
          </Box>
        </Box>
      </div>
    )
  );
};

export default Filter;

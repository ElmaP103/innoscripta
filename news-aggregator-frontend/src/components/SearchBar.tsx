import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        date: '',
        category: '',
        source: ''
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Add search logic here
    };

    return (
        <form onSubmit={handleSearch}>
            <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
            />
            <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
            </select>
            <input
                type="date"
                onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
            <Button type="submit" variant="contained">Search</Button>
        </form>
    );
};

export default SearchBar;
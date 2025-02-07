import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import SearchBar from "./SearchBar";
import Preferences from "../pages/Preferences";
import { PrivateRoute } from "./PrivateRoute";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleLogout = () => {
    setShowSearch(false);
    setShowPreferences(false);
    logout();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => {
              setShowSearch(false);
              setShowPreferences(false);
              navigate("/");
            }}
          >
            News Aggregator
          </Typography>
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  setShowPreferences(!showPreferences);
                  setShowSearch(false);
                }}
              >
                Preferences
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setShowPreferences(false);
                }}
              >
                Search
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {showSearch && (
        <PrivateRoute>
          <SearchBar onSearch={() => {}} />
        </PrivateRoute>
      )}
      {showPreferences && (
        <PrivateRoute>
          <Preferences />
        </PrivateRoute>
      )}
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;

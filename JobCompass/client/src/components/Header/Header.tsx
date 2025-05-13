import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileBar from "../ProfileBar/ProfileBar.tsx";
import { AppBar, Box, Button, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { MapOutlined, ListOutlined } from "@mui/icons-material";

interface HeaderProps {
  mobileState: boolean;
  mobileMapMode: boolean;
  setMobileMapMode: React.Dispatch<React.SetStateAction<boolean>>;
  guestUser: { name: string; id: string; savedJobs: any[] } | null;
  loggedIn: boolean;
  handleLogout: () => void;
  user: any;
}

function Header({
  mobileState,
  mobileMapMode,
  setMobileMapMode,
  guestUser,
  loggedIn,
  handleLogout,
  user,
}: HeaderProps) {
  const location = useLocation();
  const theme = useTheme();
  const isJobPage = location.pathname === "/jobs";

  const toggleMapList = () => {
    setMobileMapMode(!mobileMapMode);
  };

  useEffect(() => {}, [location]);

  return (
    <AppBar position="relative" z-index='1' color="primary">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img
                src="/assets/Logo/compassfavicon.png"
                alt="JobCompass Logo"
                style={{ height: '32px', width: '32px' }}
              />
              <Typography variant="h6" component="h1">
                JobCompass
              </Typography>
            </Box>
          </Link>

          {mobileState && isJobPage && (
            <IconButton
              onClick={toggleMapList}
              color="inherit"
              size="medium"
            >
              {mobileMapMode ? (
                <ListOutlined />
              ) : (
                <MapOutlined />
              )}
            </IconButton>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        
        <ProfileBar
          user={user}
          handleLogout={handleLogout}
          mobileState={mobileState}
          loggedIn={loggedIn}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
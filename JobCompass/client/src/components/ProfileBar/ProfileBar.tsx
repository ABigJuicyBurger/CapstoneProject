import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { styled } from "@mui/material/styles";
import { MenuItemProps } from "@mui/material/MenuItem";

type ProfileBarType = {
  user: any;
  handleLogout: () => void;
  mobileState: boolean;
  loggedIn: boolean;
};

interface ProfileMenuItemProps {
  icon: React.ElementType;
  label: string,
  to?: string;
  onClick?: () => void;
}

type StyledMenuItemProps = MenuItemProps & {
  to?: string;
  component?: React.ElementType;
}

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "1.25rem",
  height: 40,
  width: 40,
  margin: "0 .5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1,2),
  minWidth: "100px",
})) 

const ProfileMenuItem = ({ icon: Icon, label, to, onClick }: ProfileMenuItemProps) => {
  return (
    <StyledMenuItem
      component={to ? RouterLink : 'button'}
      to={to}
      onClick={onClick}
    >
      <Icon sx={{ fontSize: '1.25rem' }} />
      <Typography variant="body1">{label}</Typography>
    </StyledMenuItem>
  );
};

const ProfileBar = ({
  user,
  handleLogout,
  mobileState,
  loggedIn,
}: ProfileBarType) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const avatarLetter = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : "";

  const savedJobsUrl = loggedIn
    ? `/user/${user.userName}/savedJobs`
    : `/guest/${user?.id || ""}savedJobs`;

  return (
    <Box className="fade-in" sx={{ animation: 'fadeIn 0.3 ease-in'}}>
      <Button
        onClick={handleClick}
        sx={{
          color: "inherit",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Typography variant="body1">{user?.userName}</Typography>
        <StyledAvatar>{avatarLetter}</StyledAvatar>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {loggedIn ? (
          <Box>
            <ProfileMenuItem
              icon={PersonIcon}
              label="Profile"
              to={`/user/${user.userName}/profile`}
              onClick={handleClose}
            />
            <ProfileMenuItem
              icon={WorkIcon}
              label="Saved Jobs"
              to={savedJobsUrl}
              onClick={handleClose}
            />
            <ProfileMenuItem
              icon={LogoutIcon}
              label="Logout"
              onClick={handleLogout}
            />
              
          </Box>
        ) : (
          <Box>
            <ProfileMenuItem
              icon={PersonIcon}
              label="Profile"
              to={savedJobsUrl}
              onClick={handleClose}
            />
            <ProfileMenuItem
              icon={LoginIcon}
              label="Sign In"
              to="/signIn"
              onClick={handleClose}
            />
            <ProfileMenuItem
              icon={PersonAddIcon}
              label="Register"
              to="/register"
              onClick={handleClose}
            />
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default ProfileBar;
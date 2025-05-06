import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { styled } from "@mui/material/styles";

type ProfileBarType = {
  user: any;
  handleLogout: () => void;
  mobileState: boolean;
  loggedIn: boolean;
};

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "1.25rem",
}));

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
    <Box>
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
          <>
            <MenuItem
              component={Link}
              to={`/user/${user.userName}/profile`}
              onClick={handleClose}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem
              component={Link}
              to={savedJobsUrl}
              onClick={handleClose}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Saved Jobs" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to={savedJobsUrl}
              onClick={handleClose}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Saved Jobs" />
            </MenuItem>
            <MenuItem
              component={Link}
              to="/signIn"
              onClick={handleClose}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem
              component={Link}
              to="/register"
              onClick={handleClose}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default ProfileBar;
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import zocoLogo from "../../assets/zoco-logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#EAE151",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={zocoLogo} alt="Zoco Logo" style={{ height: 40 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ ml: 2, color: "#000" }}
          >
            Dashboard
          </Typography>
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: { sm: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1" sx={{ color: "black" }}>
            {user?.name}
          </Typography>

          <Button
            color="secondary"
            onClick={logout}
            sx={{
              borderRadius: 1,
              backgroundColor: "secondary.main",
              borderColor: "secondary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "#FB3640",
                color: "white",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

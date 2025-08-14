import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  Popover,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

type HeaderProps = {
  onToggleTheme?: () => void;
  mode?: "light" | "dark";
};

const Header: React.FC<HeaderProps> = ({ onToggleTheme, mode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  // Busca nome do usuário do localStorage
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
    const name = localStorage.getItem("userName") || "Usuário";
    setUserName(name);
  }, []);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setIsAuth(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate("/login");
    setDrawerOpen(false);
  };

  // Links de navegação
  const navLinks = isAuth
    ? [
        { label: "Chamados", to: "/calleds" },
        { label: "Novo Chamado", to: "/calleds/novo" },
        { label: "Sair", action: handleLogout },
      ]
    : [
        { label: "Login", to: "/login" },
        { label: "Cadastro", to: "/register" },
      ];

  return (
    <AppBar position="static" color="default" sx={{ mb: 2 }}>
      <Toolbar>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ ml: 1, color: "#ff9800" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
              <Link
                to="/calleds"
                style={{ textDecoration: "none", color: "#ff9800" }}
              >
                UpWorker
              </Link>
            </Typography>
            <Tooltip title={mode === "dark" ? "Modo claro" : "Modo escuro"}>
              <IconButton
                color="inherit"
                onClick={onToggleTheme}
                aria-label="Alternar tema"
                sx={{ ml: 1 }}
              >
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {isAuth && (
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ justifyContent: "flex-end" }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#ff9800",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  onClick={handleAvatarClick}
                  aria-label="Perfil do usuário"
                >
                  {userName.charAt(0).toUpperCase()}
                </Box>
                <Typography
                  variant="subtitle1"
                  color="#ff9800"
                  sx={{ cursor: "pointer" }}
                  onClick={handleAvatarClick}
                  aria-label="Perfil do usuário"
                >
                  {userName}
                </Typography>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                  <Box
                    p={2}
                    minWidth={120}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Typography variant="subtitle1" color="#ff9800" mb={1}>
                      {userName}
                    </Typography>
                    <Button
                      color="inherit"
                      onClick={() => {
                        navigate("/profile-update");
                        handlePopoverClose();
                      }}
                      aria-label="Atualizar Nome"
                    >
                      Atualizar Nome
                    </Button>
                    <Button
                      color="inherit"
                      onClick={() => {
                        handleLogout();
                        handlePopoverClose();
                      }}
                      aria-label="Sair"
                    >
                      Sair
                    </Button>
                  </Box>
                </Popover>
              </Box>
            )}
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link
                to="/calleds"
                style={{ textDecoration: "none", color: "#ff9800" }}
              >
                UpWorker
              </Link>
            </Typography>
            <Tooltip title={mode === "dark" ? "Modo claro" : "Modo escuro"}>
              <IconButton
                color="inherit"
                onClick={onToggleTheme}
                aria-label="Alternar tema"
              >
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {isAuth ? (
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{ marginLeft: "auto" }}
              >
                <Button
                  color="inherit"
                  component={Link}
                  to="/calleds"
                  aria-label="Chamados"
                >
                  Chamados
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/calleds/novo"
                  aria-label="Novo Chamado"
                >
                  Novo Chamado
                </Button>
                {/* Avatar e nome do usuário como popover, última opção */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#ff9800",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 18,
                      cursor: "pointer",
                    }}
                    onClick={handleAvatarClick}
                    aria-label="Perfil do usuário"
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    color="#ff9800"
                    sx={{ cursor: "pointer" }}
                    onClick={handleAvatarClick}
                    aria-label="Perfil do usuário"
                  >
                    {userName}
                  </Typography>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Box
                      p={2}
                      minWidth={120}
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography variant="subtitle1" color="#ff9800" mb={1}>
                        {userName}
                      </Typography>
                      <Button
                        color="inherit"
                        onClick={() => {
                          handleLogout();
                          handlePopoverClose();
                        }}
                        aria-label="Sair"
                      >
                        Sair
                      </Button>
                    </Box>
                  </Popover>
                </Box>
              </Box>
            ) : (
              <Box>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  aria-label="Login"
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  aria-label="Cadastro"
                >
                  Cadastro
                </Button>
              </Box>
            )}
          </>
        )}
      </Toolbar>
      {/* Drawer para mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 220 }} onClick={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map((link, idx) => (
              <ListItem key={link.label} disablePadding>
                {link.to ? (
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    aria-label={link.label}
                  >
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                ) : (
                  <ListItemButton onClick={link.action} aria-label={link.label}>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;

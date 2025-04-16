import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import zocoLogo from '../../assets/zoco-logo.png'; 

// Colores personalizados para el Sidebar
const sidebarBgColor = '#2C3E50';  // Negro pastel
const sidebarTextColor = '#FFFFFF';
const sidebarHoverColor = '#34495E';  // Color ligeramente más oscuro para hover
const sidebarHoverUnderlineColor = '#F39C12';  // Amarillo para la línea de hover
const sidebarSelectedColor = '#1ABC9C'; // Color para el item seleccionado

// Estilo para los ListItems
const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  color: sidebarTextColor,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease-in-out',  // Transición suave para hover y selected
  
  '&:hover': {
    backgroundColor: sidebarHoverColor,
    '& .MuiListItemText-primary': {
      color: sidebarTextColor,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '0',
      bottom: '-5px',  // Línea debajo
      width: '100%',
      height: '3px',
      backgroundColor: sidebarHoverUnderlineColor, // Línea amarilla
      transition: 'all 0.3s ease', // Transición para la línea amarilla
    }
  },
  ...(selected && {
    backgroundColor: sidebarSelectedColor,
    '& .MuiListItemIcon-root': {
      color: sidebarTextColor,
    },
    '& .MuiListItemText-primary': {
      color: sidebarTextColor,
    },
  }),
}));

function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/dashboard',
      roles: ['admin', 'user'],
    },
    {
      text: 'Studies',
      icon: <SchoolIcon />,
      path: '/dashboard/studies',
      roles: ['admin', 'user'],
    },
    {
      text: 'Addresses',
      icon: <HomeIcon />,
      path: '/dashboard/addresses',
      roles: ['admin', 'user'],
    },
    ...(role === 'admin'
      ? [
          {
            text: 'Users',
            icon: <PeopleIcon />,
            path: '/dashboard/users',
            roles: ['admin'],
          },
        ]
      : []),
  ];

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{
            position: 'fixed',
            left: 10,
            top: 10,
            zIndex: theme.zIndex.drawer + 1,
            color: sidebarTextColor,
            backgroundColor: sidebarBgColor,
            '&:hover': {
              backgroundColor: sidebarHoverColor,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: sidebarBgColor,
            color: sidebarTextColor,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(7),
              [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
              },
            }),
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={toggleDrawer} sx={{ color: sidebarTextColor }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        <List>
          {menuItems.map((item) => (
            <StyledListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? toggleDrawer : undefined}
            >
              <ListItemIcon sx={{ color: sidebarTextColor }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;

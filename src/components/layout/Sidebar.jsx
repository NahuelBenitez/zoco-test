import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Toolbar 
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext'

function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

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
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
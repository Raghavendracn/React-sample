import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const drawerWidth = 300;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const workspaceData = [
  {
    id: 'LHCCMR01',
    location: 'Syracuse, New York',
    type: 'MRI',
    color: '#e91e63',
    isFavorite: true,
    isStarred: false,
    avatar: '🧠',
  },
  {
    id: 'CCICT01',
    location: 'Syracuse, New York',
    type: 'CT',
    color: '#2196f3',
    isFavorite: false,
    isStarred: true,
    avatar: '☁️',
  },
  {
    id: 'CCICT01',
    location: 'Syracuse, New York',
    type: 'CT',
    color: '#2196f3',
    isFavorite: false,
    isStarred: false,
    avatar: '☁️',
  },
  {
    id: 'LHCCMR01',
    location: 'Syracuse, New York',
    type: 'MRI',
    color: '#e91e63',
    isFavorite: false,
    isStarred: false,
    avatar: '🧠',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Account for navbar height
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
          My Workspace
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {workspaceData.map((workspace, index) => (
            <Card 
              key={`${workspace.id}-${index}`}
              sx={{ 
                border: '2px solid',
                borderColor: workspace.color,
                borderRadius: 2,
                position: 'relative',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: workspace.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    {workspace.avatar}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
                      {workspace.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {workspace.location}
                    </Typography>
                  </Box>
                  
                  <IconButton 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      backgroundColor: workspace.isFavorite ? 'rgba(255,0,0,0.1)' : 'transparent'
                    }}
                  >
                    {workspace.isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e91e63', fontSize: 18 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 18, color: '#666' }} />
                    )}
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <VisibilityIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      {workspace.isStarred ? (
                        <StarIcon sx={{ color: '#ff9800', fontSize: 16 }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <SettingsIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  
                  <IconButton size="small" sx={{ color: '#666' }}>
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Avatar,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
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
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface RoomData {
  modalityId: string;
  modalityDescription: string;
  type: string;
  siteAddress: string;
  phoneNumber: string;
  connectionType: string;
  isFavorite: boolean;
  isStarred: boolean;
  status: 'online' | 'offline' | 'maintenance';
}

const roomsData: RoomData[] = [
  {
    modalityId: 'LHMR01',
    modalityDescription: 'Magnetom Aera 1.5T',
    type: 'Lenoxhill/GS',
    siteAddress: '+1 212-772-3111',
    phoneNumber: '+1 212-772-3111 Extn: 1932',
    connectionType: 'WebRTC',
    isFavorite: true,
    isStarred: false,
    status: 'online',
  },
  {
    modalityId: 'LHMR01',
    modalityDescription: 'Magnetom Aera 1.5T',
    type: 'Lenoxhill/GS',
    siteAddress: '+1 212-772-3111',
    phoneNumber: '+1 212-772-3111 Extn: 1932',
    connectionType: 'WebRTC',
    isFavorite: false,
    isStarred: true,
    status: 'online',
  },
  {
    modalityId: 'LHMR01',
    modalityDescription: 'Magnetom Aera 1.5T',
    type: 'Lenoxhill/GS',
    siteAddress: '+1 212-772-3111',
    phoneNumber: '+1 212-772-3111 Extn: 1932',
    connectionType: 'WebRTC',
    isFavorite: false,
    isStarred: false,
    status: 'online',
  },
  {
    modalityId: 'LHMR01',
    modalityDescription: 'Magnetom Aera 1.5T',
    type: 'Lenoxhill/GS',
    siteAddress: '+1 212-772-3111',
    phoneNumber: '+1 212-772-3111 Extn: 1932',
    connectionType: 'WebRTC',
    isFavorite: false,
    isStarred: false,
    status: 'online',
  },
];

const presetFilters = [
  { label: 'Preset One', active: true },
  { label: 'Preset Two', active: false },
  { label: 'Preset Three', active: false },
  { label: 'Preset Four', active: false },
];

const DataTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', p: 0 }}>
      <Box sx={{ backgroundColor: 'white', p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
          Rooms <Typography component="span" color="text.secondary" sx={{ fontSize: '1rem' }}>(Total 2,392 rooms)</Typography>
        </Typography>

        {/* Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {presetFilters.map((filter) => (
            <Chip
              key={filter.label}
              label={filter.label}
              variant={filter.active ? 'filled' : 'outlined'}
              color={filter.active ? 'primary' : 'default'}
              onDelete={filter.active ? () => {} : undefined}
              deleteIcon={filter.active ? <CloseIcon /> : undefined}
              sx={{ 
                borderRadius: 1,
                height: 32,
                fontSize: '0.875rem'
              }}
            />
          ))}
          <Button
            variant="outlined"
            size="small"
            sx={{ 
              ml: 1, 
              textTransform: 'none',
              borderRadius: 1,
              height: 32
            }}
          >
            Save New Preset
          </Button>
        </Box>

        {/* Search and Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          
          <Typography variant="body2" color="text.secondary">
            1-5 of 13
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Modality ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Modality Description</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Site Address</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}>Connection Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#555', py: 2 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((room, index) => (
              <TableRow 
                key={index} 
                hover 
                sx={{ 
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.75rem',
                        backgroundColor: '#e91e63',
                        color: 'white'
                      }}
                    >
                      🧠
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {room.modalityId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {room.modalityDescription}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Custom additional note
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip 
                    label={room.type} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: 24
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">{room.siteAddress}</Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">{room.phoneNumber}</Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Chip 
                    label={room.connectionType}
                    size="small"
                    color="success"
                    sx={{ 
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      height: 24
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <IconButton size="small" sx={{ color: room.isFavorite ? '#e91e63' : '#666' }}>
                      {room.isFavorite ? (
                        <FavoriteIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <VisibilityIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: room.isStarred ? '#ff9800' : '#666' }}>
                      {room.isStarred ? (
                        <StarIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#666' }}>
                      <SettingsIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={handleMenuClick} sx={{ color: '#666' }}>
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={roomsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': {
                minHeight: 48
              }
            }}
          />
        </Box>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        <MenuItem onClick={handleMenuClose}>Duplicate</MenuItem>
      </Menu>
    </Box>
  );
};

export default DataTable;

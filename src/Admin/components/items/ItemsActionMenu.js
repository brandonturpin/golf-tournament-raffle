import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = [
  {label: 'Edit Item', link: "/admin/items"},
  'View Bidder',
  'Pause Item',
  'End Item',
  'Delete'
];

const ITEM_HEIGHT = 48;

export default function ItemsActionMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem component="a" href={`/admin/items/${props.id}`}> Edit Item </MenuItem>
        <MenuItem disabled={true} href={`#`}> QR Code </MenuItem>
        <MenuItem disabled={true} href={`#`}> View Bidder </MenuItem>
        <MenuItem disabled={true} href={`#`}> Pause Item </MenuItem>
        <MenuItem disabled={true} href={`#`}> End Item </MenuItem>
        <MenuItem disabled={true} href={`#`}> Delete Item </MenuItem>
      </Menu>
    </div>
  );
}

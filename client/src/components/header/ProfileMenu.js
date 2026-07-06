import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

function ProfileMenu({ logout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user } = useSelector((state) => state.userReducer);
  const history = useHistory();

  const initials = user?.fname
    ? `${user.fname[0]}${user.lname?.[0] || ""}`.toUpperCase()
    : "U";

  const handleNavigate = (path) => {
    setAnchorEl(null);
    history.push(path);
  };

  return (
    <>
      <button
        type="button"
        className="header__utility header__profile-btn"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Profile menu"
      >
        <span className="header__profile-initials">{initials}</span>
        <span>Account</span>
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          style: {
            borderRadius: 16,
            marginTop: 8,
            minWidth: 180,
            boxShadow: "0 8px 24px rgba(26,26,46,0.12)",
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate("/account")}>
          <AccountCircleOutlinedIcon style={{ marginRight: 10, color: "#222" }} />
          My Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/orders")}>
          <ReceiptOutlinedIcon style={{ marginRight: 10, color: "#222" }} />
          Orders
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/wishlist")}>
          <FavoriteBorderIcon style={{ marginRight: 10, color: "#222" }} />
          Wishlist
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            logout();
          }}
        >
          <PowerSettingsNewIcon style={{ marginRight: 10, color: "#222" }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;

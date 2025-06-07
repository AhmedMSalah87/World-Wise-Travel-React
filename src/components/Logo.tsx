import { Link } from "react-router";
import logo from "../assets/logo.png";

const Logo = ({ height = "3.25rem" }) => {
  return (
    <Link to="/">
      <img src={logo} alt="logo" style={{ height }} />
    </Link>
  );
};

export default Logo;

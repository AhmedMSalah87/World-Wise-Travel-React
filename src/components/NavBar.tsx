import { NavLink } from "react-router";
import Logo from "./Logo";
import { Button } from "./ui/button";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between">
      <Logo />
      <ul className="flex items-center gap-8">
        <li className="text-foreground uppercase font-bold">
          <NavLink
            to="/pricing"
            className={({ isActive }) => (isActive ? "text-primary" : "")}
          >
            Pricing
          </NavLink>
        </li>

        <li className="text-foreground uppercase font-bold">
          <NavLink
            to="/product"
            className={({ isActive }) => (isActive ? "text-primary" : "")}
          >
            Product
          </NavLink>
        </li>

        <li>
          <Button asChild className="font-bold uppercase">
            <NavLink to="/login">Login</NavLink>
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

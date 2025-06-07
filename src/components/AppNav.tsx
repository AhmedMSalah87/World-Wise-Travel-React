import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

const AppNav = () => {
  return (
    <nav className="mt-8 mb-5 uppercase bg-[#42484d] rounded-md">
      <ul className="flex text-sm font-semibold">
        <li>
          <NavLink
            to="cities"
            className={({ isActive }) =>
              cn("block px-5 py-1.5 rounded-md", isActive && "bg-[#242a2e]")
            }
          >
            cities
          </NavLink>
        </li>
        <li>
          <NavLink
            to="search"
            className={({ isActive }) =>
              cn("block px-5 py-1.5 rounded-md", isActive && "bg-[#242a2e]")
            }
          >
            search
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AppNav;

import Logo from "./Logo";
import AppNav from "./AppNav";

import { Outlet } from "react-router";

import type { Cities } from "./Cities";

const SideBar = ({ cities }: { cities: Cities }) => {
  return (
    <div className="flex flex-col basis-xl bg-secondary text-white items-center py-8 px-12">
      <Logo />
      <AppNav />
      <Outlet context={{ cities }} />
      <footer className="mt-auto text-muted-foreground text-xs">
        <p>© Copyright {new Date().getFullYear()} by WorldWise Inc.</p>
      </footer>
    </div>
  );
};

export default SideBar;

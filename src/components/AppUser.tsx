import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AppUser = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="absolute top-10 right-10 bg-secondary z-1000 py-1 px-1.5 flex items-center gap-1.5 text-white">
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <span>Welcome, {user?.username}</span>
      <Button onClick={handleLogOut} className="cursor-pointer">
        Logout
      </Button>
    </div>
  );
};

export default AppUser;

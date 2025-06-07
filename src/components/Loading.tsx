import { Spinner } from "./ui/Spinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner size="large">Loading...</Spinner>
    </div>
  );
};

export default Loading;

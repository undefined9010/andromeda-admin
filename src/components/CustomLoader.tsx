export const CustomLoader = () => (
  <span className="flex items-center justify-center h-5 mr-2">
    <span
      className="mx-[2px] bg-white w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ animationDelay: "0ms" }}
    ></span>

    <span
      className="mx-[2px] bg-white w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ animationDelay: "150ms" }}
    ></span>

    <span
      className="mx-[2px] bg-white w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ animationDelay: "300ms" }}
    ></span>
  </span>
);

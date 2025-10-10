import logo from "@/assets/vouchify-logo.png";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <img src={logo} alt="Vouchify" className="h-12 w-auto" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

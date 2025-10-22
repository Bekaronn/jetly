import { Link } from "react-router-dom";
import { Plane } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Jetly</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/booking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Мои бронирования
          </Link>
          <Link
            to="/login"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Войти
          </Link>
        </nav>
      </div>
    </header>
  );
}
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Link to="/dashboard" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
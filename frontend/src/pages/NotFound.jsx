import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section text-center py-32">
      <p className="font-display text-6xl font-extrabold text-primary mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-white mb-2">Looks like you took a wrong turn.</h1>
      <p className="text-offwhite/60 mb-8">This route doesn't exist, but the Sunday run does.</p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

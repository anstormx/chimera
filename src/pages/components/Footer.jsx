import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="w-full text-center fixed bottom-3 left-0 bg-transparent text-white text-base font-bold">
      Made with ❤️ by{" "}
      <Link
        to="https://github.com/anstormx"
        target="_blank"
        className="text-blue-500 hover:text-blue-600"
      >
        Aniket
      </Link>
    </div>
  );
}

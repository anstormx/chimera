import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="w-full py-2 text-center fixed bottom-0 left-0 bg-transparent text-white text-sm font-bold">
      <div className="mx-auto">
        Made with ❤️ by{" "}
        <Link
          to="https://github.com/anstormx"
          target="_blank"
          className="text-blue-500 hover:text-blue-600"
        >
          Aniket
        </Link>
      </div>
    </div>
  );
}

import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router.jsx";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

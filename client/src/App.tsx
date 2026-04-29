import { BrowserRouter } from "react-router";
import Router from "./routers/AppRouters";

export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
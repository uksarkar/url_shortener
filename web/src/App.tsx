import { Router } from "@solidjs/router";
import routes from "./routes";
import BaseLayout from "./layouts/base-layout";
import { Toaster } from "~/components/ui/toast";
import "./app.css";

function App() {
  return (
    <>
      <Router root={BaseLayout}>{routes}</Router>
      <Toaster />
    </>
  );
}

export default App;

import { Router } from "@solidjs/router";
import routes from "./routes";
import BaseLayout from "./layouts/base-layout";
import './app.css'

function App() {
  return <Router root={BaseLayout}>{routes}</Router>
}

export default App

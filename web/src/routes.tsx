import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import Home from "./pages/Home";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/About"))
  }
];

export default routes;

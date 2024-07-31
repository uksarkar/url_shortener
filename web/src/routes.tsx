import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import Home from "./pages/home";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/about"))
  }
];

export default routes;

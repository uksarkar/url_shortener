import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import Home from "./pages/home";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/links",
    component: lazy(() => import("./pages/links"))
  },
  {
    path: "/users",
    component: lazy(() => import("./pages/users"))
  }
];

export default routes;

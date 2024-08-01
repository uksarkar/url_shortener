import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";
import Home from "./pages/home";
import { BreadcrumbListItem } from "./stores/base-store";

interface RD extends Omit<RouteDefinition, "info"> {
  info?: {
    title?: string;
    breadcrumbs?: Omit<BreadcrumbListItem, "isActive">[];
  };
}
 
const routes: RD[] = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/links",
    component: lazy(() => import("./pages/links")),
    info: {
      title: "Links",
      breadcrumbs: [
        {
          label: "Home",
          to: "/"
        },
        {
          label: "Links",
          to: "/links"
        }
      ]
    }
  },
  {
    path: "/users",
    component: lazy(() => import("./pages/users")),
    info: {
      title: "Users",
      breadcrumbs: [
        {
          label: "Home",
          to: "/"
        },
        {
          label: "Users",
          to: "/users"
        }
      ]
    }
  }
];

export default routes;

import { createSignal } from "solid-js";

export interface BreadcrumbListItem {
  isActive: boolean;
  to: string;
  label: string;
} 

const [breadcrumbs, updateBreadcrumbs] = createSignal<BreadcrumbListItem[]>([]);

export const useBreadcrumbs = () => breadcrumbs();
export const setBreadcrumbs = (items: BreadcrumbListItem[]) =>
  updateBreadcrumbs(items);
export const defaultBreadcrumbs = () => {
  updateBreadcrumbs([
    {
      isActive: true,
      to: "/",
      label: "Home"
    }
  ]);
};
 
import { RouteSectionProps } from "@solidjs/router";
import { createEffect, createSignal, For, onMount } from "solid-js";
import { Nav } from "~/components/base/nav";
import { Search } from "~/components/base/search";
import { UserNav } from "~/components/base/user-nav";
import {
  DashboardIcon,
  IconMessages,
  IconUsers,
  LinkIcon,
  MentoringIcon,
  SettingIcon,
  WebIcon
} from "~/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { useCurrentMatches } from "@solidjs/router";
import {
  setBreadcrumbs,
  defaultBreadcrumbs,
  BreadcrumbListItem,
  useBreadcrumbs
} from "~/stores/base-store";
import { linksCount, setLinksCount } from "~/stores/link-count";
import { getLinksCount } from "~/api/link";

const BaseLayout = (props: RouteSectionProps) => {
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  // hooks
  const route = useCurrentMatches();

  onMount(() => {
    getLinksCount().then(res => {
      setLinksCount(res);
    });
  });

  // effects
  createEffect(() => {
    const currentRoute = route().at(0);
    if (
      currentRoute &&
      currentRoute.route.info &&
      currentRoute.route.info.title
    ) {
      document.title = currentRoute.route.info.title;
    } else {
      document.title = "Url shortener";
    }

    if (
      currentRoute &&
      currentRoute.route.info &&
      currentRoute.route.info.breadcrumbs
    ) {
      const items = currentRoute.route.info.breadcrumbs as Omit<
        BreadcrumbListItem,
        "isActive"
      >[];
      setBreadcrumbs(
        items.map((item, i) => ({ isActive: i === items.length - 1, ...item }))
      );
    } else {
      defaultBreadcrumbs();
    }
  });

  return (
    <>
      <header class="row-span-1 col-span-2 border-b">
        <div class="flex h-16 items-center px-4">
          <span onclick={() => setIsCollapsed(!isCollapsed())}>Logo</span>
          <div class="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </header>
      <div class="flex flex-grow overflow-hidden w-full">
        <aside class="sidebar" classList={{ "basis-15": !isCollapsed() }}>
          <Nav
            isCollapsed={isCollapsed()}
            links={[
              {
                title: "Dashboard",
                icon: DashboardIcon,
                to: "/"
              },
              {
                title: "Links",
                label: linksCount(),
                icon: LinkIcon,
                to: "/links"
              },
              {
                title: "Domains",
                icon: WebIcon,
                to: "/domains"
              }
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed()}
            links={[
              {
                title: "Users",
                icon: IconUsers,
                to: "/users"
              },
              {
                title: "Roles",
                icon: MentoringIcon,
                to: "/roles"
              },
              {
                title: "Settings",
                icon: SettingIcon,
                to: "/settings"
              },
              {
                title: "Support",
                label: "1",
                icon: IconMessages,
                to: "/support"
              }
            ]}
          />
        </aside>
        <main
          class="overflow-y-auto p-4"
          classList={{
            "basis-85": !isCollapsed(),
            "basis-full": isCollapsed()
          }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <For each={useBreadcrumbs()}>
                {(item, index) => (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.to} current={item.isActive}>
                      {item.label}
                    </BreadcrumbLink>
                    {index() !== useBreadcrumbs().length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </BreadcrumbItem>
                )}
              </For>
            </BreadcrumbList>
          </Breadcrumb>
          {props.children}
        </main>
      </div>
    </>
  );
};

export default BaseLayout;

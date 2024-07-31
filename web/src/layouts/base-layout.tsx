import { RouteSectionProps } from "@solidjs/router";
import { createSignal } from "solid-js";
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
import { Separator } from "~/components/ui/separator";

const BaseLayout = (props: RouteSectionProps) => {
  const [isCollapsed, setIsCollapsed] = createSignal(false);
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
                variant: "default"
              },
              {
                title: "Links",
                label: "9",
                icon: LinkIcon,
                variant: "ghost"
              },
              {
                title: "Domains",
                icon: WebIcon,
                variant: "ghost"
              },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed()}
            links={[
              {
                title: "Users",
                icon: IconUsers,
                variant: "ghost"
              },
              {
                title: "Roles",
                icon: MentoringIcon,
                variant: "ghost"
              },
              {
                title: "Settings",
                icon: SettingIcon,
                variant: "ghost"
              },
              {
                title: "Support",
                label: "1",
                icon: IconMessages,
                variant: "ghost"
              },
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
          {props.children}
        </main>
      </div>
    </>
  );
};

export default BaseLayout;

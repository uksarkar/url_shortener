import { RouteSectionProps } from "@solidjs/router";
import { createSignal } from "solid-js";
import { Nav } from "~/components/base/nav";
import { Search } from "~/components/base/search";
import { UserNav } from "~/components/base/user-nav";
import {
  IconArchive,
  IconFile,
  IconInbox,
  IconMessages,
  IconSend,
  IconShoppingCart,
  IconTrash,
  IconUpdates,
  IconUsers
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
        <aside classList={{ "basis-15": !isCollapsed() }}>
          <Nav
            isCollapsed={isCollapsed()}
            links={[
              {
                title: "Inbox",
                label: "128",
                icon: IconInbox,
                variant: "default"
              },
              {
                title: "Drafts",
                label: "9",
                icon: IconFile,
                variant: "ghost"
              },
              {
                title: "Sent",
                label: "",
                icon: IconSend,
                variant: "ghost"
              },
              {
                title: "Trash",
                label: "23",
                icon: IconTrash,
                variant: "ghost"
              },
              {
                title: "Archive",
                label: "",
                icon: IconArchive,
                variant: "ghost"
              }
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed()}
            links={[
              {
                title: "Social",
                label: "972",
                icon: IconUsers,
                variant: "ghost"
              },
              {
                title: "Updates",
                label: "342",
                icon: IconUpdates,
                variant: "ghost"
              },
              {
                title: "Forums",
                label: "128",
                icon: IconMessages,
                variant: "ghost"
              },
              {
                title: "Shopping",
                label: "8",
                icon: IconShoppingCart,
                variant: "ghost"
              },
              {
                title: "Promotions",
                label: "21",
                icon: IconArchive,
                variant: "ghost"
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
          {props.children}
        </main>
      </div>
    </>
  );
};

export default BaseLayout;

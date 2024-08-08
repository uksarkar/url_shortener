import type { Component } from "solid-js";
import { For, Show } from "solid-js";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { A } from "@solidjs/router";
import { useLocation } from "@solidjs/router";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: Component;
    to: string;
  }[];
}

export function Nav(props: NavProps) {
  const location = useLocation();

  function isActiveRoute(path: string, strict = true): boolean {
    return strict
      ? location.pathname === path
      : location.pathname.startsWith(path);
  }

  return (
    <div
      data-collapsed={props.isCollapsed}
      class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <For each={props.links}>
          {item => {
            const Icon = item.icon;
            return (
              <Show
                when={props.isCollapsed}
                fallback={
                  <A
                    href={item.to}
                    activeClass={cn(
                      buttonVariants({
                        variant: "default",
                        size: "sm",
                        class: "text-sm"
                      }),
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-start"
                    )}
                    inactiveClass={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        class: "text-sm"
                      }),
                      "justify-start"
                    )}
                    end
                  >
                    <div class="mr-2">
                      <Icon />
                    </div>
                    {item.title}
                    {item.label && (
                      <span
                        class={cn(
                          "ml-auto",
                          isActiveRoute(item.to) &&
                            "text-background dark:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </A>
                }
              >
                <Tooltip openDelay={0} closeDelay={0} placement="right">
                  <TooltipTrigger
                    as="a"
                    href={item.to}
                    class={cn(
                      buttonVariants({
                        variant: isActiveRoute(item.to) ? "default" : "ghost",
                        size: "icon"
                      }),
                      "size-9",
                      isActiveRoute(item.to) &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <Icon />
                    <span class="sr-only">{item.title}</span>
                  </TooltipTrigger>
                  <TooltipContent class="flex items-center gap-4">
                    {item.title}
                    <Show when={item.label}>
                      <span class="ml-auto text-muted-foreground">
                        {item.label}
                      </span>
                    </Show>
                  </TooltipContent>
                </Tooltip>
              </Show>
            );
          }}
        </For>
      </nav>
    </div>
  );
}

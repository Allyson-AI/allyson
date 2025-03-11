// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Icons } from "@allyson/ui/sdk/icons";
import { buttonVariants } from "@allyson/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@allyson/ui/drawer";
import { siteConfig } from "@allyson/ui/sdk/lib/config";
import { cn } from "@allyson/ui/lib/utils";
import Link from "next/link";
import { IconMenu } from "@tabler/icons-react";

export function MobileDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <IconMenu className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <Link
            href="/"
            title="brand-logo"
            className="relative mr-6 flex items-center space-x-2"
          >
            <Icons.logo className="w-auto h-[40px]" />
            <DrawerTitle>{siteConfig.name}</DrawerTitle>
          </Link>
          <DrawerDescription>{siteConfig.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              "text-white rounded-full group"
            )}
          >
            {siteConfig.cta}
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@allyson/ui/sheet";

import { useUser } from "@allyson/context";


export default function PlanSheet() {  

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" className="text-sm">
          View
        </Button>
      </SheetTrigger>
      <SheetContent className="pb-20">
        <SheetHeader>
          <SheetTitle className="text-left">Plan</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto max-h-full hide-scrollbar pb-20">
          <div className="relative flex-auto overflow-y-auto">
            <div className="overflow-y-auto">
              <div className="mb-6"></div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

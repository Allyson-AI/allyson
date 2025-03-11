// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@allyson/ui/sheet";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@allyson/ui/card";
import { Button } from "@allyson/ui/button";
import { IconTools } from "@tabler/icons-react";

export default function FunctionsSheet() {  
  const functions = [
    {
      name: "Save To File",
      description: "Allows allyson to save files for you in the cloud.",
    },
    {
      name: "Append To File",
      description: "Allows allyson to append to files that have been saved in the cloud."
    },
    {
        name: "Read From File",
        description: "Allyson will read files that she creates or you upload in the session."
    },
    {
        name: "Human Input",
        description: "Allyson will notify you if she needs your help with something to complete a task. Turn on your notifications to receive these messages"
    },
  ];
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="text-sm">
          <IconTools className="h-[1.2rem] w-[1.2rem] text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent className="pb-20">
        <SheetHeader>
          <SheetTitle className="text-left">Functions</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto max-h-full hide-scrollbar pb-20">
          <div className="relative flex-auto overflow-y-auto">
            <div className="overflow-y-auto justify-between space-y-4">
              {functions.map((func) => (
                <Card key={func.name} className="p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-md font-medium">
                          {func.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-zinc-500">
                          {func.description}
                        </CardDescription>
                      </div>
                      {/* <Switch /> */}
                    </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

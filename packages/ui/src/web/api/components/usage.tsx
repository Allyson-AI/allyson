// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FilesCreated } from "@allyson/ui/web/api/components/charts/files-created";
import { StorageUsed } from "@allyson/ui/web/api/components/charts/storage-used";
import { Spend } from "@allyson/ui/web/api/components/charts/spend";
import { SessionsStarted } from "@allyson/ui/web/api/components/charts/sessions-started";

export function Usage() {
  return (
    <div className="h-screen md:h-full overflow-y-auto hide-scrollbar pb-20 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-4">
        <SessionsStarted />
        <Spend />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FilesCreated />
        <StorageUsed />
      </div>
    </div>
  );
}

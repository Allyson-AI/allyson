import DocumentsClient from "@allyson/ui/web/documents/documents-client";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 h-screen overflow-hidden">
          <DocumentsClient />
      </div>
    </div>
  );
}
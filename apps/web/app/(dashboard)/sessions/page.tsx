import BrowserSessions from "@allyson/ui/web/browser/browser-sessions";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 h-screen overflow-hidden">
        <BrowserSessions />
      </div>
    </div>
  );
}

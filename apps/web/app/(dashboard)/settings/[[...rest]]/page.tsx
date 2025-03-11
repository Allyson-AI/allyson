import Settings from "@allyson/ui/web/settings";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 h-screen overflow-hidden">
          <Settings />
        </div>
      </div>
  );
}

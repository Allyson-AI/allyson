import Section from "@allyson/ui/www/section";
import { BarChart3, Brain, FileText, LineChart } from "lucide-react";
import ManualTasks from "./manual-tasks";

const data = [
  {
    id: 1,
    title: "Integrations",
    content: "Allyson integrates easily with your existing tools.",
    component: <ManualTasks />,
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Important Inbox",
    content: "Managed by Allyson so you only focus on what's important.",
    image: "/dash.png",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "Document Storage",
    content: "Easily chat with your documents & save email attachments.",
    image: "/dash.png",
    icon: <LineChart className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "Mobile App",
    content: "Allyson is also available on your iOS device.",
    image: "/dash.png",
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
];

export default function FeaturesSection() {
  return (
    <Section title="Integrations" subtitle="Integrates Easily with Your Existing Tools">
      <ManualTasks />
    </Section>
  );
}

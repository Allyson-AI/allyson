import BlurFade from "@allyson/ui/magicui/blur-fade";
import Section from "@allyson/ui/www/section";
import { Card, CardContent } from "@allyson/ui/card";
import { IconAlertTriangle, IconBrain, IconClock, IconOctagon } from "@tabler/icons-react";

const problems = [
    {
      title: "Information Overload",
      description:
        "Struggling to manage emails, documents, and online research, leading to missed opportunities and inefficient decision-making.",
      icon: <IconBrain />,
    },
    {
      title: "Time-Consuming Routine Tasks",
      description:
        "Wasting hours on repetitive tasks like drafting emails, scheduling meetings, and analyzing information, taking away from high-value work.",
      icon: <IconClock />,
    },
    {
      title: "Inefficient Task Management",
      description:
        "Difficulty in prioritizing and managing various tasks across different platforms, resulting in decreased productivity and missed deadlines.",
      icon: <IconAlertTriangle />,
    },
  ];
export default function ProblemSection() {
  return (
    <Section
      title="Problem"
      subtitle="Wasting time on tasks that can be automated."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}

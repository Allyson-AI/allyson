import Section from "@allyson/ui/www/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@allyson/ui/accordion";

export default function MainFaq() {
  const faqs = [
    {
      question: "What is Allyson?",
      answer: (
        <span>
          Allyson is an AI executive assistant that enhances your productivity
          by automating repetitive tasks such as inbox management, appointment
          scheduling, analyzing documents, web research & more.
        </span>
      ),
    },
    {
      question: "How can I get started with Allyson?",
      answer: (
        <span>
          You can get started with Allyson by signing up for an account on our
          website or mobile app. You can then subscribe to a plan to unlock all
          the premium features.
        </span>
      ),
    },
    {
      question: "What can Allyson do?",
      answer: (
        <span>
          Allyson can do a wide range of tasks, such as write drafts, manage your inbox on autopilot, schedule
          meetings, analyze documents, research the internet and more.
        </span>
      ),
    },
    {
      question: "Is my data safe with Allyson?",
      answer: (
        <span>
          Yes, Allyson is designed to comply with the highest standards of data
          security. We use industry-standard encryption and secure protocols to
          protect your data. We never share your data with third parties.
        </span>
      ),
    },
    {
      question: "What kind of support does Allyson provide?",
      answer: (
        <span>
          Allyson provides comprehensive support including documentation, video
          tutorials, and dedicated customer support. You can live chat or email
          us at{" "}
          <a href={`mailto:info@allyson.ai`} className="underline">
            info@allyson.ai
          </a>{" "}
          with any questions or feedback.
        </span>
      ),
    },
  ];

  return (
    <Section title="FAQ" subtitle="Frequently asked questions">
      <div className="mx-auto my-12 md:max-w-[800px]">
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col items-center justify-center space-y-2"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={faq.question}
              className="w-full border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
        Still have questions? Email us at{" "}
        <a href={`mailto:info@allyson.ai`} className="underline">
          info@allyson.ai
        </a>
      </h4>
    </Section>
  );
}

"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@allyson/ui/accordion";

export default function Faq({ faqs, keyword = "" }) {
  return (
    <section id="faq">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h4 className="text-xl font-bold tracking-tight text-zinc-400">
              {keyword} FAQs
            </h4>
            <h2
              style={{ fontFamily: "'ClashDisplay', sans-serif" }}
              className="text-4xl text-center  md:text-6xl font-bold mt-1 bg-clip-text text-transparent leading-none bg-gradient-to-r from-[#fff] via-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.3)]"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-md md:text-xl leading-8 text-zinc-200">
              Need help with something? Here are some of the most common
              questions we get.
            </p>
          </div>
          <div className="my-12 space-y-12">
            {faqs?.map((faq, idx) => (
              <section key={idx} id={"faq-" + faq.section}>
                <h2 className="mb-4 text-left text-base font-semibold tracking-tight text-foreground/60">
                  {faq.section}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col items-center justify-center"
                >
                  {faq.qa.map((faq, idx) => (
                    <AccordionItem
                      key={idx}
                      value={faq.question}
                      className="w-full"
                    >
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
          <h4 className="mb-12 text-center text-sm font-medium tracking-tight text-foreground/80">
            Still have questions? Email us at{" "}
            <a href="mailto:info@allyson.ai" className="underline">
              info@allyson.ai
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}

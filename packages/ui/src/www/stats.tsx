import Counter from "../counter";
export default function Stats() {
  const stats = [
    {
      number: 350,
      suffix: "+",
      text: "Integrations with your favorite tools",
    },
    {
      number: 90,
      suffix: "%",
      text: "Time saved on manual tasks.",
    },
    {
      number: 60,
      suffix: "%",
      text: "Decrease in the necessity to hire additional staff.",
    },
    {
      number: 5,
      suffix: " minutes",
      text: "Allyson is quick and easy to setup using your voice.",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="max-w-sm mx-auto grid gap-12 sm:grid-cols-2 md:grid-cols-4 md:-mx-5 md:gap-0 items-start md:max-w-none">
        {stats.map((stat, index) => (
          <div key={index} className="relative text-center md:px-5">
            <h4
              style={{ fontFamily: "'ClashDisplay', sans-serif" }}
              className="font-inter-tight text-2xl md:text-3xl font-bold tabular-nums mb-2"
            >
              <Counter number={stat.number} />
              {stat.suffix}
            </h4>
            <p className="text-sm text-zinc-500">{stat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export type MarketStatus = "OPEN" | "WAITING_FOR_SECOND" | "LOCKED" | "RESOLVED";

export interface Market {
  id: string;
  title: string;
  description: string;
  sideA: string;
  sideB: string;
  status: MarketStatus;
  category: string;
  expiresAt?: string;
}

export const markets: Market[] = [
  {
    id: "1",
    title: "Will Bitcoin hit $200K by end of 2025?",
    description: "A high-stakes prediction on Bitcoin's meteoric rise. Some say it's inevitable, others call it a pipe dream.",
    sideA: "Yes, $200K+",
    sideB: "No way",
    status: "OPEN",
    category: "Crypto",
  },
  {
    id: "2",
    title: "Elon Musk vs Mark Zuckerberg cage match",
    description: "The tech billionaire showdown that captivated the world. Will it actually happen?",
    sideA: "Fight happens in 2025",
    sideB: "Never happening",
    status: "OPEN",
    category: "Entertainment",
  },
  {
    id: "3",
    title: "GPT-5 releases before July 2025",
    description: "OpenAI's next frontier model. The race for AGI heats up.",
    sideA: "Released before July",
    sideB: "Delayed past July",
    status: "OPEN",
    category: "Tech",
  },
  {
    id: "4",
    title: "Lakers win 2025 NBA Championship",
    description: "Can LeBron secure another ring? The odds are stacked but legends find a way.",
    sideA: "Lakers win it all",
    sideB: "Someone else takes it",
    status: "OPEN",
    category: "Sports",
  },
  {
    id: "5",
    title: "Tesla Robotaxi launches commercially in 2025",
    description: "Elon's been promising this for years. Is 2025 finally the year?",
    sideA: "Launches in 2025",
    sideB: "Another delay",
    status: "OPEN",
    category: "Tech",
  },
  {
    id: "6",
    title: "Will there be a US recession in 2025?",
    description: "Economic indicators are mixed. Put your prediction where your money is.",
    sideA: "Recession hits",
    sideB: "Economy stays strong",
    status: "OPEN",
    category: "Finance",
  },
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Crypto: "bg-warning/20 text-warning",
    Entertainment: "bg-accent/20 text-accent",
    Tech: "bg-primary/20 text-primary-foreground",
    Sports: "bg-success/20 text-success",
    Finance: "bg-muted text-muted-foreground",
  };
  return colors[category] || "bg-muted text-muted-foreground";
};

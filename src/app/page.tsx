import Hero from "@/components/home/hero/Hero";
import RecentlyView from "@/components/home/recent/RecentlyView";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col flex-auto">
      <Hero />
      <RecentlyView />
    </main>
  );
}

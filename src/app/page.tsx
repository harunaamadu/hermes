import Hero from "@/components/home/hero/Hero";
import RecentlyView from "@/components/home/recent/RecentlyView";

export default function Home() {
  return (
    <main className="flex flex-col flex-auto">
      <Hero />
      <RecentlyView />

      <div className="relative block lg:hidden w-full h-[10dvh]" />

      
    </main>
  );
}

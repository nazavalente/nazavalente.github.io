"use client";

import { Award } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { seedAchievements } from "@/data/seedPortfolioData";
import { isPlaceholderValue } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function Achievements() {
  const { items, loading, error } = useCollection("achievements");
  const removedAchievements = ["Computer " + "Networks Practicum Assistant"];
  const visibleAchievements = (items.length > 0 ? items : seedAchievements).filter(
    (item) => !removedAchievements.includes(item.title)
  );
  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow="Achievements" title="Milestones and work I am proud of." />
        {loading && <Loading />}
        {error && <EmptyState title="Could not load achievements" description={error} />}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleAchievements.map((item) => (
            <Card key={item.id || item.title}>
              <Award className="h-8 w-8 text-teal-200" />
              {!isPlaceholderValue(item.year) && <p className="mt-5 text-sm text-slate-400">{item.year}</p>}
              <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
              {item.proofUrl && !isPlaceholderValue(item.proofUrl) && (
                <a href={item.proofUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-semibold text-teal-200 hover:text-teal-100">
                  View proof
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

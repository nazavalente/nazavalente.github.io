"use client";

import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { Badge } from "@/components/ui/Badge";
import { isPlaceholderValue } from "@/lib/utils";
import { seedExperiences } from "@/data/seedPortfolioData";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  const { items, loading, error } = useCollection("experiences");
  const visibleExperiences = items.length > 0 ? items : seedExperiences;
  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow="Experience" title="Work, lab, and academic responsibilities." />
        {loading && <Loading />}
        {error && <EmptyState title="Could not load experience" description={error} />}
        <div className="grid gap-4">
          {visibleExperiences.map((item) => (
            <Card key={item.id || `${item.role}-${item.organization}`}>
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.role}</h3>
                  <p className="mt-1 text-teal-200">{item.organization}</p>
                </div>
                {!isPlaceholderValue(item.period) && <Badge>{item.period}</Badge>}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
              {item.contributions?.length > 0 && (
                <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                  {item.contributions.filter((entry) => !isPlaceholderValue(entry)).map((entry) => (
                    <li key={entry} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

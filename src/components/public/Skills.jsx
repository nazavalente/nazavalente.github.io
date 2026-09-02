"use client";

import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { seedSkills } from "@/data/seedPortfolioData";
import { isPlaceholderValue } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function Skills() {
  const { items, loading, error } = useCollection("skills");
  const visibleSkills = (items.length > 0 ? items : seedSkills).filter(
    (skill) => skill.category !== "Computer Networks" && skill.name !== "Docker"
  );
  const grouped = visibleSkills.reduce((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] || []), skill];
    return acc;
  }, {});
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeader eyebrow="Skills" title="A balanced technical toolkit." description="Grouped by how the work usually gets done: interface, backend, data, tools, and networks." />
        {loading && <Loading />}
        {error && <EmptyState title="Could not load skills" description={error} />}
        <div className="grid gap-5 md:grid-cols-2">
          {Object.entries(grouped).map(([category, skills]) => (
            <Card key={category}>
              <h3 className="text-xl font-semibold text-white">{category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  skill.proofUrl && !isPlaceholderValue(skill.proofUrl) ? (
                    <a key={skill.id || `${skill.category}-${skill.name}`} href={skill.proofUrl} target="_blank" rel="noreferrer" className="rounded-full bg-teal-300/12 px-3 py-1.5 text-sm text-teal-100 transition hover:bg-teal-300/20">
                      {skill.name}
                    </a>
                  ) : (
                    <span key={skill.id || `${skill.category}-${skill.name}`} className="rounded-full bg-white/8 px-3 py-1.5 text-sm text-slate-200">{skill.name}</span>
                  )
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

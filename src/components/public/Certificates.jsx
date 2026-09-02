"use client";

import { FileBadge } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { seedCertificates } from "@/data/seedPortfolioData";
import { isPlaceholderValue } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function Certificates() {
  const { items, loading, error } = useCollection("certificates");
  const visibleCertificates = items.length > 0 ? items : seedCertificates;
  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow="Certificates" title="Certificates and formal learning." description="Verified learning records from CV evidence and provided credential links." />
        {loading && <Loading />}
        {error && <EmptyState title="Could not load certificates" description={error} />}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCertificates.map((item) => (
            <Card key={item.id || item.title} className="flex min-h-56 flex-col">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="mb-4 aspect-video w-full rounded-xl object-cover" /> : <FileBadge className="mb-4 h-10 w-10 text-teal-200" />}
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {[item.issuer, !isPlaceholderValue(item.year) ? item.year : ""].filter(Boolean).join(" · ")}
              </p>
              {!isPlaceholderValue(item.category) && <p className="mt-3 text-sm text-teal-200">{item.category}</p>}
              {item.certificateUrl && !isPlaceholderValue(item.certificateUrl) && (
                <a href={item.certificateUrl} target="_blank" rel="noreferrer" className="mt-auto inline-flex pt-5 text-sm font-semibold text-teal-200 hover:text-teal-100">
                  View credential
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

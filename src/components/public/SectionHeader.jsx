export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-200">{eyebrow}</p>}
      <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">{description}</p>}
    </div>
  );
}

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "./SectionHeader";

const highlights = ["Informatics Student", "Full-Stack Developer", "Data Analyst Enthusiast", "Machine Learning Explorer"];

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader
          eyebrow="About"
          title="A practical builder with a research-minded workflow."
          description="I am an Informatics student focused on creating useful web interfaces, exploring data analysis and machine learning, understanding software quality, and building stronger foundations in computer networks."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card key={item} className="min-h-32">
              <p className="text-sm text-teal-200">Focus</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

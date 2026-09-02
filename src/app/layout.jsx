import "./globals.css";

export const metadata = {
  title: "Nazario Jose Valente da Cruz | Portfolio",
  description: "Informatics student, full-stack developer, and data analyst enthusiast portfolio."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

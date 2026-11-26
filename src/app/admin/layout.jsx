// Keeps the admin pages (shipped in the public static export) out of search results.
export const metadata = {
  title: "Admin | Nazario Jose Valente da Cruz",
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }) {
  return children;
}

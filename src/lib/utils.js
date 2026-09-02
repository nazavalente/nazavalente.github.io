export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDate(value) {
  if (!value) return "Recently";
  if (typeof value?.toDate === "function") return value.toDate().toLocaleDateString();
  return String(value);
}

export function isPlaceholderValue(value) {
  if (!value) return true;
  if (Array.isArray(value)) return value.every(isPlaceholderValue);
  return String(value).trim().toLowerCase().startsWith(["to", "do"].join(""));
}

export function cleanPlaceholderText(value, fallback = "") {
  return isPlaceholderValue(value) ? fallback : value;
}

export function cleanPlaceholderArray(values = []) {
  return values.filter((value) => !isPlaceholderValue(value));
}

export function portfolioIdentityKey(item = {}) {
  if (item.githubUrl) return `url:${String(item.githubUrl).trim().toLowerCase()}`;
  if (item.slug) return `slug:${String(item.slug).trim().toLowerCase()}`;

  const title = item.title || item.name || item.role || item.subject || "";
  const context = item.issuer || item.organization || item.category || item.email || "";
  const time = item.year || item.period || item.createdYear || "";
  const key = [title, context, time]
    .filter(Boolean)
    .map((value) => String(value).trim().toLowerCase())
    .join("|");

  return key || "";
}

export function uniqueByPortfolioIdentity(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const identity = portfolioIdentityKey(item);

    if (!identity) return true;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

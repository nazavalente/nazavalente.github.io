import { slugify } from "./utils";

const GITHUB_USERNAME = "nazavalente";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

function inferCategory(repo) {
  const text = `${repo.name} ${repo.description || ""} ${repo.language || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
  if (text.includes("ai") || text.includes("artificial-intelligence")) return "AI";
  if (text.includes("machine") || text.includes("classification") || text.includes("prediction") || text.includes("notebook")) return "Machine Learning";
  if (text.includes("data") || text.includes("analysis") || text.includes("visualization")) return "Data Analysis";
  if (text.includes("mental") || text.includes("voices") || text.includes("team")) return "Team Project";
  if (["html", "css", "javascript", "typescript"].includes(String(repo.language || "").toLowerCase())) return "Web Development";
  return "Academic Project";
}

function techStackFromRepo(repo) {
  return [repo.language, ...(repo.topics || [])]
    .filter(Boolean)
    .map((item) => String(item).replace(/-/g, " "))
    .slice(0, 6);
}

export function mapGitHubRepoToRepository(repo, order = 0) {
  const category = inferCategory(repo);
  return {
    name: repo.name,
    description: repo.description || "Public GitHub repository by Nazario Jose Valente da Cruz.",
    techStack: techStackFromRepo(repo),
    language: repo.language || "",
    category,
    githubUrl: repo.html_url,
    status: "Public GitHub repository",
    order,
    updatedAt: repo.updated_at
  };
}

export function mapGitHubRepoToProject(repo, order = 0) {
  const category = inferCategory(repo);
  const techStack = techStackFromRepo(repo);
  return {
    title: repo.name.replace(/[-_]/g, " "),
    slug: slugify(repo.name),
    description: repo.description || "Public GitHub repository by Nazario Jose Valente da Cruz.",
    longDescription: repo.description || "This project is synced automatically from Nazario's public GitHub repositories.",
    problem: "Project details are synced from GitHub. A fuller case study can be added from the admin dashboard.",
    features: ["Public source repository", "Automatically synced from GitHub", repo.language ? `Main language: ${repo.language}` : "Repository metadata available"],
    techStack,
    category,
    role: "Project owner or contributor.",
    status: "Auto-synced from GitHub",
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || "",
    imageUrl: "",
    createdYear: repo.created_at ? String(new Date(repo.created_at).getFullYear()) : "",
    isFeatured: false,
    order,
    isGitHubAuto: true
  };
}

const CACHE_KEY = "github_repos_cache_v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchRawGitHubRepos() {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(data)) {
          return data;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    if (typeof window !== "undefined" && Array.isArray(repos)) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: repos }));
      } catch {
        // Ignore storage errors
      }
    }
    return repos;
  } catch (err) {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          if (Array.isArray(data)) return data;
        }
      } catch {
        // Ignore storage errors
      }
    }
    throw err;
  }
}

export async function fetchPublicGitHubRepositories() {
  const repos = await fetchRawGitHubRepos();
  return repos
    .filter((repo) => !repo.fork)
    .map((repo, index) => mapGitHubRepoToRepository(repo, index + 1));
}

export async function fetchPublicGitHubProjects() {
  const repos = await fetchRawGitHubRepos();
  return repos
    .filter((repo) => !repo.fork)
    .map((repo, index) => mapGitHubRepoToProject(repo, index + 100));
}

export async function fetchPublicGitHubProjectBySlug(slug) {
  const projects = await fetchPublicGitHubProjects();
  return projects.find((project) => project.slug === slug) || null;
}


export const projectFields = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug" },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "longDescription", label: "Long Description", type: "textarea" },
  { name: "problem", label: "Problem / Purpose", type: "textarea" },
  { name: "developmentProcess", label: "Development Process", type: "textarea", table: false },
  { name: "features", label: "Features", type: "array" },
  { name: "techStack", label: "Tech Stack", type: "array" },
  { name: "category", label: "Category", required: true },
  { name: "role", label: "Role", type: "textarea" },
  { name: "status", label: "Status" },
  { name: "githubUrl", label: "GitHub URL" },
  { name: "liveUrl", label: "Live Demo URL" },
  { name: "imageUrl", label: "Image URL", type: "upload" },
  { name: "createdYear", label: "Created Year" },
  { name: "isFeatured", label: "Featured", type: "boolean", table: false },
  { name: "order", label: "Order" }
];

export const repositoryFields = [
  { name: "name", label: "Repository Name", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "techStack", label: "Tech Stack", type: "array" },
  { name: "language", label: "Language" },
  { name: "category", label: "Category" },
  { name: "githubUrl", label: "GitHub URL" },
  { name: "status", label: "Status" },
  { name: "order", label: "Order" }
];

export const achievementFields = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "year", label: "Year" },
  { name: "category", label: "Category" },
  { name: "proofUrl", label: "Proof URL" },
  { name: "icon", label: "Icon" },
  { name: "order", label: "Order" }
];

export const skillFields = [
  { name: "name", label: "Name", required: true },
  { name: "category", label: "Category", required: true },
  { name: "level", label: "Level" },
  { name: "proofUrl", label: "Proof URL" },
  { name: "order", label: "Order" }
];

export const experienceFields = [
  { name: "role", label: "Role", required: true },
  { name: "organization", label: "Organization", required: true },
  { name: "period", label: "Period" },
  { name: "startDate", label: "Start Date" },
  { name: "endDate", label: "End Date" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "contributions", label: "Contributions", type: "array" },
  { name: "techStack", label: "Tech Stack", type: "array" },
  { name: "order", label: "Order" }
];

export const certificateFields = [
  { name: "title", label: "Title", required: true },
  { name: "issuer", label: "Issuer" },
  { name: "year", label: "Year" },
  { name: "certificateUrl", label: "Certificate URL", type: "upload" },
  { name: "imageUrl", label: "Image URL", type: "upload" },
  { name: "category", label: "Category" },
  { name: "order", label: "Order" }
];

export const messageFields = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "subject", label: "Subject" },
  { name: "message", label: "Message", type: "textarea" },
  { name: "isRead", label: "Read", type: "boolean" }
];

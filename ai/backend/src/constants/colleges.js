export const getCollegeFromEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const customDomains = process.env.ALLOWED_EMAIL_DOMAINS
    ? process.env.ALLOWED_EMAIL_DOMAINS.split(",").map((d) => d.trim().toLowerCase())
    : [];

  const isAllowed = customDomains.some((allowed) => {
    if (!allowed) return false;
    if (allowed.startsWith(".")) {
      return domain.endsWith(allowed);
    }
    return domain === allowed;
  });

  if (!isAllowed) {
    return null;
  }

  const collegeName = domain.split(".")[0];
  return collegeName.charAt(0).toUpperCase() + collegeName.slice(1);
};


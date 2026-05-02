export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export const validateProjectInput = (project) => {
  const errors = [];

  if (!project.title || typeof project.title !== "string" || project.title.trim().length === 0) {
    errors.push("Project title is required");
  }

  if (project.repo_url && !validateURL(project.repo_url)) {
    errors.push("Invalid repository URL");
  }

  if (project.live_url && !validateURL(project.live_url)) {
    errors.push("Invalid live URL");
  }

  if (project.screenshot_url && !validateURL(project.screenshot_url)) {
    errors.push("Invalid screenshot URL");
  }

  if (!Array.isArray(project.tech_stack)) {
    errors.push("Tech stack must be an array");
  }

  return errors;
};

export const validateContactMessage = (message) => {
  const errors = [];

  if (!message.sender_name || typeof message.sender_name !== "string" || message.sender_name.trim().length === 0) {
    errors.push("Sender name is required");
  }

  if (!validateEmail(message.sender_email)) {
    errors.push("Invalid email address");
  }

  if (!message.message || typeof message.message !== "string" || message.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }

  return errors;
};

const idify = (word: string): string => {
  return word
    .trim() // Remove leading and trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ''); // Remove leading or trailing hyphens
};

export default idify;

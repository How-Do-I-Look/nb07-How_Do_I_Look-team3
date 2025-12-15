/**
 * @param {Array<string>} tagNames
 * @param {number} [limit=5]
 * @returns {Array<string>}
 */
export function calculatePopularTags(tagNames, limit = 5) {
  if (!Array.isArray(tagNames)) {
    console.error("calculatePopularTags expects an array of tag names.");
    return [];
  }

  const tagCounts = {};
  tagNames.forEach((name) => {
    tagCounts[name] = (tagCounts[name] || 0) + 1;
  });

  const sortedTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name]) => name);

  return sortedTags.slice(0, limit);
}

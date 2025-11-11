import { createComparison, defaultRules } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const compare = createComparison({
    search: defaultRules.contains,
  });

  return function applySearching(data, state) {
    const searchQuery = state[searchField]?.toLowerCase().trim();

    if (!searchQuery) {
      return data;
    }

    // @todo: #5.2 — применить компаратор
    const result = data.filter((item) => {
      return Object.entries(item).some(([key, value]) => {
        if (typeof value === "string") {
          return compare(value, searchQuery, "search");
        }
        return false;
      });
    });

    return result;
  };
}

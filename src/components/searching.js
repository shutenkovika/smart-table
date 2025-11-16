export function initSearching(searchField) {
  // @todo: #5.1 — хранить имя поля для поиска

  return function applySearching(query, state, action) {
    const searchParam = state[searchField];

    return searchParam
      ? Object.assign({}, query, {
          search: searchParam, // устанавливаем в query параметр 'search'
        })
      : query;
  };
}

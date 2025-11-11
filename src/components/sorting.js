import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;
      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => {
        // Перебираем все кнопки сортировки
        if (column.dataset.value !== "none") {
          // Ищем ту, которая не в начальном состоянии (т.е., активно сортирует)
          field = column.dataset.field; // Сохраняем поле для сортировки
          order = column.dataset.value; // и направление сортировки ('asc' или 'desc')
        }
      });
    }

    return sortCollection(data, field, order);
  };
}

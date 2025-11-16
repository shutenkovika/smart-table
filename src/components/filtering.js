// import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

//const compare = createComparison(defaultRules);
export function initFiltering(elements) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      // Очистку селекта здесь не требуем, просто добавляем опции
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };
  const applyFiltering = (query, state, action) => {
    // код с обработкой очистки поля (из исходного filtering.js, адаптированный)
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;
      const inputElement = elements[fieldName];

      if (inputElement) {
        inputElement.value = "";
      }
    }

    // @todo: #4.5 — собираем параметры фильтра для сервера
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        // ищем поля ввода в фильтре с непустыми данными
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // чтобы сформировать в query вложенный объект фильтра
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    // если в фильтре что-то добавилось, применим к запросу
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}

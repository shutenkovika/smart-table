import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
// @todo: подключение
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

let applyPagination;
let applySorting;
let applyFiltering;
let applySearching;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage, 10);
  const page = parseInt(state.page ?? 1, 10);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState();
  let result = [...data];
  // @todo: использование
  if (applySearching) {
    result = applySearching(result, state, action);
  }

  if (applyFiltering) {
    result = applyFiltering(result, state, action);
  }

  if (applySorting) {
    result = applySorting(result, state, action);
  }

  if (applyPagination) {
    result = applyPagination(result, state, action);
  }

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");

    if (!input || !label) return el;

    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;

    if (isCurrent) {
      label.classList.add("bg-blue-500", "text-white", "font-bold");
      label.classList.remove("bg-white", "text-gray-700");
    } else {
      label.classList.add("bg-white", "text-gray-700");
      label.classList.remove("bg-blue-500", "text-white", "font-bold");
    }

    return el;
  }
);

const headerElements = sampleTable.header.elements;
applySorting = initSorting([
  headerElements.sortByDate,
  headerElements.sortByTotal,
]);

applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers,
});

applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();

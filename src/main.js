import "./fonts/ys-display/fonts.css";
import "./style.css";

//import { data as sourceData } from "./data/dataset_1.js";
//
import { initData } from "./data.js";

import { processFormData } from "./lib/utils.js";
// @todo: подключение
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const API_URL = "http://localhost:3000/orders";

const api = initData();

let indexes = {};

let applyPagination;
let updatePagination;

let applySorting;
let applyFiltering;
let applySearching;
let updateIndexes;

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
async function render(action) {
  let state = collectState();
  let query = {};

  // @todo: использование
  if (applySearching) {
    query = applySearching(query, state, action);
  }

  if (applyFiltering) {
    query = applyFiltering(query, state, action);
  }

  if (applySorting) {
    query = applySorting(query, state, action);
  }

  if (applyPagination) {
    query = applyPagination(query, state, action);
  }

  const { total, items } = await api.getRecords(query);

  // Вызываем updatePagination для обновления кнопок
  if (updatePagination) {
    updatePagination(total, query);
  }

  sampleTable.render(items);
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

({ applyPagination, updatePagination } = initPagination(
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
));

const headerElements = sampleTable.header.elements;
applySorting = initSorting([
  headerElements.sortByDate,
  headerElements.sortByTotal,
]);

({ applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
));

applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  // Получаем индексы асинхронно (indexes объявляется в начале файла)
  indexes = await api.getIndexes();

  if (updateIndexes) {
    updateIndexes(sampleTable.filter.elements, {
      searchBySeller: indexes.sellers,
    });
  }
}
init().then(render);

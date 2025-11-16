//import { getField } from "../lib/sort.js";

export const initSorting = (elements) => {
  // Переменные для хранения состояния сортировки (используются в замыкании)
  let sort;
  let direction;

  const getNextDirection = (currentDirection) => {
    switch (currentDirection) {
      case "asc":
        return "desc";
      case "desc":
        return "asc";
      default:
        return "asc";
    }
  };

  elements.forEach((element) => {
    element.addEventListener("click", () => {
      // Получаем имя поля из аттрибута и обновляем состояние
      const field = getField(element);
      const nextDirection =
        sort === field ? getNextDirection(direction) : "asc";

      sort = field;
      direction = nextDirection;

      const input = element.closest("form").querySelector('input[name="page"]');
      if (input) {
        input.value = 1;
      }

      elements.forEach((el) => {
        el.classList.remove("asc", "desc");
      });
      element.classList.add(direction);
    });
  });

  return (query, state, action) => {
    // @todo: #5.1 — формируем параметр сортировки в виде field:direction
    // Если есть и поле, и направление, формируем строку, иначе null
    const sortParam = sort && direction ? `${sort}:${direction}` : null;

    // Добавляем параметр sort к query по общему принципу
    return sortParam ? Object.assign({}, query, { sort: sortParam }) : query;
  };
};

const $expensesInputContainer = document.querySelector('.js-sum-container');
const $expensesSumInput = $expensesInputContainer.querySelector('.js-sum-input');
const $addBtn = document.querySelector('.js-add-sum');
const $resetBtn = document.querySelector('.js-reset-expenses-btn');
const $errorCostTooltip = document.querySelector('.js-error-cost-tooltip');
const $dropdownContainer = document.querySelector('.js-dropdown-wrapper');
const $dropdownHead = $dropdownContainer.querySelector('.js-dropdown-head');
const $dropdownItemList = $dropdownContainer.querySelectorAll('.js-dropdown__list-item');
const $dropdownSelectedValue = $dropdownContainer.querySelector('.js-selected-value');
const $historyList = document.querySelector('.js-history-list');
const $modalContainer = document.querySelector('.js-modal');
const $modalCloseBtn = $modalContainer.querySelector('.js-close-modal-btn');
const $newLimitContainer = $modalContainer.querySelector('.js-limit-container');
const $newLimitInput = $modalContainer.querySelector('.js-new-limit-input');
const $setLimitBtn = $modalContainer.querySelector('.js-set-limit-btn');
const $openCorrectModalBtn = document.querySelector('.js-correct-limit-btn');
const $limitValue = document.querySelector('.js-limit');
const $total = document.querySelector('.js-total-expenses');
const $status = document.querySelector('.js-status');

let expensesData = [];
let selectedExpensesType = '';
let isExpensesTypeSelected = false;
let isDropdownOpen = false;
let limit = 10000;
let totalExpenses = 0;

/**
 * Добавление слушателей
 */
document.body.addEventListener('click', bodyClickHandler.bind(this));
$addBtn.addEventListener('click', addCostItem.bind(this, $expensesSumInput));
$resetBtn.addEventListener('click', clearExpenses.bind(this));
$dropdownHead.addEventListener('click', showDropdownList.bind(this));
$dropdownItemList.forEach((item) => {
  item.addEventListener('click', selectExpensesType.bind(this, item));
});
$openCorrectModalBtn.addEventListener('click', showModal.bind(this));
$setLimitBtn.addEventListener('click', updateLimit.bind(this));

/**
 * Добавление затрат
 */
function addCostItem(input) {
  if (!validateInput(input)) {
    showValidationError($expensesInputContainer);
  } else {
    const expensesItem = createExpensesItem(Number(input.value));
    hideValidationError($expensesInputContainer);
    expensesData.push(expensesItem);
    renderExpensesList();
    clearSelection();
    updateExpensesSum();
    validateStatus();
  }
}

function createExpensesItem(expensesSum) {
  return {
    expensesSum: expensesSum,
    expensesType: isExpensesTypeSelected ? selectedExpensesType : 'Забыл за что',
  };
}

function showDropdownList() {
  $dropdownContainer.classList.add('dropdown-active');
  setTimeout(() => (isDropdownOpen = true), 300);
}

function hideDropdownList() {
  $dropdownContainer.classList.remove('dropdown-active');
  setTimeout(() => (isDropdownOpen = false), 300);
}

function selectExpensesType(listItem) {
  isExpensesTypeSelected = true;
  selectedExpensesType = listItem.dataset.id;
  $dropdownSelectedValue.innerText = selectedExpensesType;
  hideDropdownList();
}

function renderExpensesList() {
  if (!expensesData.length) {
    $historyList.innerText = 'Пока нет затрат ))';
    return;
  }

  let historyHtml = '';
  $historyList.innerHTML = '';

  expensesData.forEach((item, index) => {
    historyHtml += `
    <div class="expenses-list__item">
      <div class="item-number">${index + 1}.</div>
      <div class="item-value">${item.expensesSum.toLocaleString()} руб.</div>
      <span class="defis">-</span>
      <div class="item-category">${item.expensesType}</div>
    </div>
    `;
  });

  $historyList.innerHTML = historyHtml;
}

function clearSelection() {
  $expensesSumInput.value = '';
  selectedExpensesType = 'Добавьте статью расходов';
  $dropdownSelectedValue.innerText = selectedExpensesType;
  isExpensesTypeSelected = false;
}

/**
 * Посчитать общую сумму затрат
 */
function updateExpensesSum() {
  calculateCotsAmount();
  writeNewAmount();
}

function calculateCotsAmount() {
  totalExpenses = expensesData.reduce((acc, item) => acc + item.expensesSum, 0);
}

function writeNewAmount() {
  $total.innerText = `${totalExpenses.toLocaleString()} руб.`;
}

/**
 * Сбросить расходы
 */
function clearExpenses() {
  if (!expensesData.length) {
    return;
  }

  expensesData = [];
  calculateCotsAmount();
  writeNewAmount();
  renderExpensesList();
  validateStatus();
}

/**
 * Валидация расходов
 */
function validateStatus() {
  const difference = limit - totalExpenses;
  updateStatus(difference);
}

function updateStatus(difference) {
  if (difference >= 0) {
    clearStatusError();
    $status.innerText = 'Все хорошо';
  } else {
    addStatusError();
    $status.innerText = `Все плохо (${difference.toLocaleString()} руб.)`;
  }
}

function addStatusError() {
  $status.classList.remove('option__status-good');
  $status.classList.add('option__status-bad');
}

function clearStatusError() {
  $status.classList.add('option__status-good');
  $status.classList.remove('option__status-bad');
}

/**
 * Редактирование лимита
 */
function showModal() {
  $modalContainer.classList.add('modal-active');
}

function hideModal() {
  $modalContainer.classList.remove('modal-active');
  clearLimitInput();
}

function setLimit(newValue) {
  limit = +newValue;
  setLimitText(limit);
}

function setLimitText(value) {
  $limitValue.innerText = value.toLocaleString();
}

function updateLimit() {
  if (!validateInput($newLimitInput)) {
    showValidationError($newLimitContainer);
  } else {
    hideValidationError($newLimitContainer);
    setLimit($newLimitInput.value);
    validateStatus();
    hideModal();
  }
}

function clearLimitInput() {
  $newLimitInput.value = '';
}

/**
 * Обработчик события "click" на body
 */
function bodyClickHandler(event) {
  if (isDropdownOpen) {
    hideDropdownList();
  } else if (event.target === $modalContainer || event.target === $modalCloseBtn) {
    hideModal();
  }
}

/**
 * Общие функции
 */
function showValidationError(element) {
  element.classList.add('tooltip-error');
}

function hideValidationError(element) {
  element.classList.remove('tooltip-error');
}

function validateInput(input) {
  if (!input.value || isNaN(Number(input.value)) || Number(input.value) <= 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * Инициализация приложения
 */
function init() {
  clearSelection();
  renderExpensesList();
  setLimitText(limit);
  updateExpensesSum();
  validateStatus();
}

init();

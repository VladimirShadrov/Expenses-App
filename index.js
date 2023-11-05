const $expensesInputContainer = document.querySelector('.js-sum-container');
const $expensesSumInput = $expensesInputContainer.querySelector('.js-sum-input');
const $addBtn = document.querySelector('.js-add-sum');
const $correctLimitBtn = document.querySelector('.js-correct-limit-btn');
const $resetBtn = document.querySelector('.js-reset-expenses-btn');
const $errorCostTooltip = document.querySelector('.js-error-cost-tooltip');
const $dropdownContainer = document.querySelector('.js-dropdown-wrapper');
const $dropdownHead = $dropdownContainer.querySelector('.js-dropdown-head');
const $dropdownItemList = $dropdownContainer.querySelectorAll('.js-dropdown__list-item');
const $dropdownSelectedValue = $dropdownContainer.querySelector('.js-selected-value');
const $historyList = document.querySelector('.js-history-list');
const $modalContainer = document.querySelector('.js-modal');
const $modalCloseBtn = $modalContainer.querySelector('.js-close-modal-btn');
const $openCorrectModalBtn = document.querySelector('.js-correct-limit-btn');
const $limitValue = document.querySelector('.js-limit');
const $total = document.querySelector('.js-total-expenses');

const expensesData = [];
let selectedExpensesType = '';
let isExpensesTypeSelected = false;
let isDropdownOpen = false;
let limit = 10000;

/**
 * Добавление слушателей
 */
document.body.addEventListener('click', bodyClickHandler.bind(this));
$addBtn.addEventListener('click', addCostItem.bind(this, $expensesSumInput));
$correctLimitBtn.addEventListener('click', () => console.log('Correct'));
$resetBtn.addEventListener('click', () => console.log('Reset'));
$dropdownHead.addEventListener('click', showDropdownList.bind(this));
$dropdownItemList.forEach((item) => {
  item.addEventListener('click', selectExpensesType.bind(this, item));
});
$openCorrectModalBtn.addEventListener('click', showModal.bind(this));

/**
 * Добавление затрат
 */
function addCostItem(input) {
  if (!validateCostInput(input)) {
    showValidationError($expensesInputContainer);
  } else {
    const expensesItem = createExpensesItem(Number(input.value), selectedExpensesType);
    hideValidationError($expensesInputContainer);
    expensesData.push(expensesItem);
    renderExpensesList();
    clearSelection();
  }
}

function validateCostInput(input) {
  if (!input.value || isNaN(Number(input.value)) || Number(input.value) <= 0) {
    return false;
  } else {
    return true;
  }
}

function createExpensesItem(expensesSum, expensesType) {
  return {
    expensesSum: expensesSum.toLocaleString(),
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
      <div class="item-value">${item.expensesSum} руб.</div>
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
 * Редактирование лимита
 */
function showModal() {
  $modalContainer.classList.add('modal-active');
}

function hideModal() {
  $modalContainer.classList.remove('modal-active');
}

function setLimit(value) {
  $limitValue.innerText = value.toLocaleString();
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

/**
 * Инициализация приложения
 */
function init() {
  renderExpensesList();
  clearSelection();
  setLimit(limit);
}

init();

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

const expensesFieldsObject = {
  sum: {
    field: $expensesSumInput,
    parent: $expensesInputContainer,
    get isValid() {
      return +this.field.value ? true : false;
    },
    showValidationError() {
      this.parent.classList.add('tooltip-error');
    },
    clearError() {
      this.parent.classList.remove('tooltip-error');
    },
  },
  type: {
    field: $dropdownSelectedValue,
    parent: $dropdownContainer,
    get isValid() {
      return this.field.innerText !== 'Добавьте статью расходов';
    },
    showValidationError() {
      this.parent.classList.add('tooltip-error');
    },
    clearError() {
      this.parent.classList.remove('tooltip-error');
    },
  },

  get formValid() {
    return this.sum.isValid && this.type.isValid;
  },
};

const limitObject = {
  newLimit: {
    field: $newLimitInput,
    parent: $newLimitContainer,
    get isValid() {
      return +this.field.value ? true : false;
    },
    showValidationError() {
      this.parent.classList.add('tooltip-error');
    },
    clearError() {
      this.parent.classList.remove('tooltip-error');
    },
  },
  get formValid() {
    return this.newLimit.isValid;
  },
};

let expensesData = [];
let selectedExpensesType = '';
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
$expensesSumInput.addEventListener('focus', () => {
  expensesFieldsObject.sum.clearError();
});
$newLimitInput.addEventListener('focus', () => {
  limitObject.newLimit.clearError();
});

/**
 * Добавление затрат
 */
function addCostItem(input) {
  if (validateInput(expensesFieldsObject)) {
    const expensesItem = createExpensesItem(Number(input.value));
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
    expensesType: selectedExpensesType,
  };
}

function showDropdownList() {
  expensesFieldsObject.type.clearError();
  $dropdownContainer.classList.add('dropdown-active');

  setTimeout(() => (isDropdownOpen = true), 300);
}

function hideDropdownList() {
  $dropdownContainer.classList.remove('dropdown-active');
  setTimeout(() => (isDropdownOpen = false), 300);
}

function selectExpensesType(listItem) {
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
  limitObject.newLimit.clearError();
}

function setLimit(newValue) {
  limit = +newValue;
  setLimitText(limit);
}

function setLimitText(value) {
  $limitValue.innerText = value.toLocaleString();
}

function updateLimit() {
  if (validateInput(limitObject)) {
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

function validateInput(fieldsObject) {
  Object.values(fieldsObject).forEach((field) => {
    if (field instanceof Object) {
      field.clearError();
    }
  });

  if (fieldsObject.formValid) {
    return true;
  } else {
    Object.values(fieldsObject).forEach((field) => {
      if (field instanceof Object && !field.isValid) {
        field.showValidationError();
      }
    });
    return false;
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

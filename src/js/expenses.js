import { includeHTML } from './include.js';

includeHTML("/partials/header.html", "header");
includeHTML("/partials/footer.html", "footer");

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("expense-name");
  const amountInput = document.getElementById("expense-amount");
  const list = document.getElementById("expense-list");
  const totalEl = document.getElementById("expense-total");

  function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    list.innerHTML = "";
    let total = 0;
    expenses.forEach((exp, i) => {
      total += parseFloat(exp.amount);
      const li = document.createElement("li");
      li.textContent = `${exp.name} - $${exp.amount.toFixed(2)}`;
      list.appendChild(li);
    });
    totalEl.textContent = total.toFixed(2);
  }

  document.getElementById("add-expense-btn").addEventListener("click", () => {
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    if (!name || isNaN(amount)) return;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push({ name, amount });
    localStorage.setItem("expenses", JSON.stringify(expenses));

    nameInput.value = "";
    amountInput.value = "";
    loadExpenses();
  });

  loadExpenses();
});

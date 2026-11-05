const STORAGE_KEY = "spendwise.expenses.v1";
let expenses = [];
try { expenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); if (!Array.isArray(expenses)) expenses = []; } catch { expenses = []; }
const money = value => new Intl.NumberFormat("en-NG", {style:"currency",currency:"NGN"}).format(value);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
const form = document.querySelector("#expenseForm");
function render() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  document.querySelector("#total").textContent = money(total);
  document.querySelector("#count").textContent = expenses.length;
  const counts = expenses.reduce((acc, item) => (acc[item.category] = (acc[item.category] || 0) + item.amount, acc), {});
  document.querySelector("#topCategory").textContent = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || "—";
  document.querySelector("#monthLabel").textContent = new Intl.DateTimeFormat("en", {month:"long",year:"numeric"}).format(new Date());
  const list = document.querySelector("#expenseList"); list.replaceChildren();
  document.querySelector("#empty").hidden = expenses.length > 0;
  expenses.slice().reverse().forEach(item => {
    const li = document.createElement("li"), left = document.createElement("div"), name = document.createElement("div"), meta = document.createElement("div"), amount = document.createElement("span");
    name.className="expense-name"; name.textContent=item.description;
    meta.className="expense-meta"; meta.textContent=item.category+" · "+new Date(item.createdAt).toLocaleDateString();
    amount.className="amount"; amount.textContent=money(item.amount);
    left.append(name,meta); li.append(left,amount); list.append(li);
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const description = document.querySelector("#description").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  if (!description || !Number.isFinite(amount) || amount <= 0) return;
  expenses.push({id:crypto.randomUUID(),description,amount,category:document.querySelector("#category").value,createdAt:new Date().toISOString()});
  save(); form.reset(); render();
});
document.querySelector("#clearAll").addEventListener("click", () => {
  if (expenses.length && confirm("Delete all expenses stored in this browser?")) { expenses=[]; save(); render(); }
});
render();
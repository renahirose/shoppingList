// ----------------------------
// 編集モード & 削除・購入済ボタン
// ----------------------------
let editingIndex = null;

calendar.setOption('eventClick', function(info) {
  const event = info.event;

  editingIndex = items.findIndex(i =>
    i.name === event.title.split(" ¥")[0] &&
    i.date === event.startStr
  );

  if (editingIndex === -1) return;

  const item = items[editingIndex];

  selectedDate = item.date;
  document.getElementById("selectedDate").innerText = selectedDate;
  document.getElementById("itemName").value = item.name;
  document.getElementById("price").value = item.price;
  document.getElementById("status").value = item.status;
  document.getElementById("memo").value = item.memo;

  document.getElementById("editButtons").classList.remove("hidden");
  document.getElementById("modal").classList.remove("hidden");
});

// ----------------------------
// 保存・購入済・削除・リセット処理
// ----------------------------
function saveItem() {
  const name = document.getElementById("itemName").value;
  const price = Number(document.getElementById("price").value);
  const status = document.getElementById("status").value;
  const memo = document.getElementById("memo").value;

  if (editingIndex !== null) {
    items[editingIndex] = { date: selectedDate, name, price, status, memo };
  } else {
    items.push({ date: selectedDate, name, price, status, memo });
  }

  resetForm();
}

function markBought() {
  if (editingIndex !== null) {
    items[editingIndex].status = "購入済";
    resetForm();
  }
}

function deleteItem() {
  if (editingIndex !== null) {
    items.splice(editingIndex, 1);
    resetForm();
  }
}

function resetForm() {
  localStorage.setItem("items", JSON.stringify(items));

  editingIndex = null;

  document.getElementById("itemName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("memo").value = "";
  document.getElementById("status").value = "未購入";

  document.getElementById("editButtons").classList.add("hidden");

  closeModal();
  render();
}

// ----------------------------
// PWAサービスワーカー登録
// ----------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// ----------------------------
// テーマ切り替え
// ----------------------------
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

// 起動時にテーマ復元
const savedTheme = localStorage.getItem("theme") || "pink";
setTheme(savedTheme);

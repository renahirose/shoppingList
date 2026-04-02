// ----------------------------
// DOM読み込み後に実行
// ----------------------------
document.addEventListener("DOMContentLoaded", function() {

  // ----------------------------
  // 変数宣言・初期化
  // ----------------------------
  let items = JSON.parse(localStorage.getItem("items")) || [];
  let selectedDate = "";
  let editingIndex = null;

  // ----------------------------
  // FullCalendar 初期化
  // ----------------------------
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',

    // 過去日付は無効化
    validRange: function(nowDate) {
      return { start: nowDate };
    },

    // 日付クリックでモーダルを開く
    dateClick: function(info) {
      selectedDate = info.dateStr;
      document.getElementById("selectedDate").innerText = selectedDate;

      // フォームリセット（編集モード解除）
      editingIndex = null;
      clearForm();
      document.getElementById("editButtons").classList.add("hidden");

      document.getElementById("modal").classList.remove("hidden");
    },
  });
  calendar.render();

  // ----------------------------
  // カレンダーのイベントクリック（編集モード）
  // ----------------------------
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
  // 保存処理
  // ----------------------------
  function saveItem() {
    const name = document.getElementById("itemName").value.trim();
    const price = Number(document.getElementById("price").value);
    const status = document.getElementById("status").value;
    const memo = document.getElementById("memo").value.trim();

    if (!name) { alert("何を買うか入力してください！"); return; }
    if (isNaN(price) || price < 0) { alert("正しい価格を入力してください！"); return; }

    if (editingIndex !== null) {
      items[editingIndex] = { date: selectedDate, name, price, status, memo };
    } else {
      items.push({ date: selectedDate, name, price, status, memo });
    }

    resetForm();
  }

  // ----------------------------
  // 購入済ボタン
  // ----------------------------
  function markBought() {
    if (editingIndex !== null) {
      items[editingIndex].status = "購入済";
      resetForm();
    }
  }

  // ----------------------------
  // 削除ボタン
  // ----------------------------
  function deleteItem() {
    if (editingIndex !== null) {
      items.splice(editingIndex, 1);
      resetForm();
    }
  }

  // ----------------------------
  // フォーム初期化
  // ----------------------------
  function clearForm() {
    document.getElementById("itemName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("memo").value = "";
    document.getElementById("status").value = "未購入";
  }

  // ----------------------------
  // リセット処理
  // ----------------------------
  function resetForm() {
    localStorage.setItem("items", JSON.stringify(items));

    editingIndex = null;
    clearForm();

    document.getElementById("editButtons").classList.add("hidden");
    closeModal();
    render();
  }

  // ----------------------------
  // モーダルを閉じる
  // ----------------------------
  function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }

  // ----------------------------
  // 画面再描画処理（カレンダー＆合計表示更新）
  // ----------------------------
  function render() {
    calendar.removeAllEvents();

    let total = 0;

    items.forEach(item => {
      // カレンダーにイベント追加
      const titleSuffix = ` ¥${item.price} - ${item.status}`;
      calendar.addEvent({
        title: item.name + titleSuffix,
        start: item.date,
        color: item.status === "購入済" ? "#a8d5a2" : "#f9c6c9"
      });

      if (item.status === "購入済") total += item.price;
    });

    document.getElementById("total").innerText = total.toLocaleString();
    document.getElementById("totalTax").innerText = Math.floor(total * 1.1).toLocaleString();

    // 今月分の合計
    const now = new Date();
    const monthStr = now.toISOString().slice(0,7);
    let monthTotal = 0;
    items.forEach(item => {
      if (item.status === "購入済" && item.date.startsWith(monthStr)) {
        monthTotal += item.price;
      }
    });
    document.getElementById("monthTotal").innerText = monthTotal.toLocaleString();
  }

  // ----------------------------
  // ボタン用関数をグローバルに公開
  // ----------------------------
  window.saveItem = saveItem;
  window.markBought = markBought;
  window.deleteItem = deleteItem;
  window.closeModal = closeModal;
  window.setTheme = function(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  };

  // PWAサービスワーカー登録
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

  // 起動時にテーマ復元
  const savedTheme = localStorage.getItem("theme") || "pink";
  setTheme(savedTheme);

  // 初回描画
  render();
});

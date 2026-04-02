let selectedDate = "";
let items = JSON.parse(localStorage.getItem("items")) || [];

const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
  initialView: 'dayGridMonth',

  dateClick(info) {
    const today = new Date();
    const clicked = new Date(info.dateStr);

    if (clicked < new Date(today.toDateString())) return;

    selectedDate = info.dateStr;
    document.getElementById("selectedDate").innerText = selectedDate;
    document.getElementById("modal").classList.remove("hidden");
  },

  eventClick(info) {
    if (confirm("購入済にする？")) {
      const event = info.event;
      const item = items.find(i =>
        i.name === event.title.split(" ¥")[0] &&
        i.date === event.startStr
      );

      if (item) {
        item.status = "購入済";
        localStorage.setItem("items", JSON.stringify(items));
        render();
      }
    }
  }
});

calendar.render();

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function saveItem() {
  const name = document.getElementById("itemName").value;
  const price = Number(document.getElementById("price").value);
  const status = document.getElementById("status").value;
  const memo = document.getElementById("memo").value;

  items.push({ date: selectedDate, name, price, status, memo });

  localStorage.setItem("items", JSON.stringify(items));

  // 入力リセット
  document.getElementById("itemName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("memo").value = "";
  document.getElementById("status").value = "未購入";

  closeModal();
  render();
}

function render() {
  calendar.removeAllEvents();

  let total = 0;
  let monthTotal = 0;
  let unboughtList = "";

  const currentMonth = new Date().getMonth();

  items.forEach(item => {
    const itemDate = new Date(item.date);

    if (item.status === "購入済") {
      total += item.price;

      if (itemDate.getMonth() === currentMonth) {
        monthTotal += item.price;
      }
    }

    if (item.status === "未購入") {
      unboughtList += `🛒 ${item.name}<br>`;
    }

    calendar.addEvent({
      title: `${item.name} ¥${item.price}`,
      start: item.date,
      color: item.status === "購入済" ? "#D4F8D4" : "#FFDAB9"
    });
  });

  document.getElementById("total").innerText = total;
  document.getElementById("monthTotal").innerText = monthTotal;
  document.getElementById("totalTax").innerText = Math.floor(total * 1.1);

  document.getElementById("unbought").innerHTML =
    "<b>まだ買ってないもの</b><br>" + (unboughtList || "なし");
}

render();

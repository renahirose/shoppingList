let selectedDate = "";
let items = JSON.parse(localStorage.getItem("items")) || [];

const calendarEl = document.getElementById('calendar');

const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',

  dateClick(info) {
    const today = new Date();
    const clicked = new Date(info.dateStr);

    if (clicked < new Date(today.toDateString())) {
      return;
    }

    selectedDate = info.dateStr;
    document.getElementById("selectedDate").innerText = selectedDate;
    document.getElementById("modal").classList.remove("hidden");
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

  closeModal();
  render();
}

function render() {
  calendar.removeAllEvents();

  let total = 0;
  let unboughtList = "";

  items.forEach(item => {
    if (item.status === "購入済") total += item.price;
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
  document.getElementById("totalTax").innerText = Math.floor(total * 1.1);

  document.getElementById("unbought").innerHTML =
    "<b>まだ買ってないもの</b><br>" + (unboughtList || "なし");
}

render();

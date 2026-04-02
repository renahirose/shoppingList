eventClick(info) {
  const action = prompt("削除→ d / 購入済→ b");

  const event = info.event;
  const itemIndex = items.findIndex(i =>
    i.name === event.title.split(" ¥")[0] &&
    i.date === event.startStr
  );

  if (itemIndex === -1) return;

  if (action === "d") {
    items.splice(itemIndex, 1);
  } else if (action === "b") {
    items[itemIndex].status = "購入済";
  }

  localStorage.setItem("items", JSON.stringify(items));
  render();
}

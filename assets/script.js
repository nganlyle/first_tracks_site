(function () {
  const calendarGrid = document.getElementById("calendarGrid");
  const calendarLabel = document.getElementById("calendarLabel");
  const lastUpdated = document.getElementById("lastUpdated");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  let busyRanges = [];
  let viewDate = new Date();
  viewDate.setDate(1);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function toISODate(d) {
    return d.toISOString().slice(0, 10);
  }

  function isBusy(dateStr) {
    return busyRanges.some(function (range) {
      // Airbnb iCal export end dates are exclusive (checkout day) — treat
      // [start, end) as booked nights.
      return dateStr >= range.start && dateStr < range.end;
    });
  }

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    calendarLabel.textContent = monthNames[month] + " " + year;

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = toISODate(new Date());

    calendarGrid.innerHTML = "";

    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement("div");
      empty.className = "day day--empty";
      calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const iso = toISODate(cellDate);
      const cell = document.createElement("div");
      cell.className = "day";
      cell.textContent = String(day);

      if (isBusy(iso)) {
        cell.classList.add("day--busy");
      }
      if (iso < today) {
        cell.classList.add("day--past");
      }
      calendarGrid.appendChild(cell);
    }
  }

  prevBtn.addEventListener("click", function () {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", function () {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
  });

  fetch("data/busy-dates.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("No calendar data yet");
      return res.json();
    })
    .then(function (data) {
      busyRanges = data.busy || [];
      if (data.updated) {
        lastUpdated.textContent = "Last synced " + new Date(data.updated).toLocaleString();
      } else {
        lastUpdated.textContent = "Calendar will sync automatically once the GitHub Action runs.";
      }
      renderCalendar();
    })
    .catch(function () {
      lastUpdated.textContent = "Calendar not synced yet — see the README to connect your Airbnb feed.";
      renderCalendar();
    });
})();

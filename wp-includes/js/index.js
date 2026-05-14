// /assets/js/index.js

import { comentarService } from "./comment.js";
import { data } from "./data.js";
import {
    formattedDate,
    formattedName,
    generateRandomColor,
    generateRandomId,
    getCurrentDateTime,
    renderElement
} from "./helper.js";

let currentPage = 1;
let allData = [];

async function init() {
  await loadData();
}

async function loadData() {

  allData = await comentarService.getComentar();

  allData.reverse();

  currentPage = 1;

  render();
}

function render() {

  const container = document.getElementById("wish-list");

  const start = (currentPage - 1) * data.perPage;
  const end = start + data.perPage;

  const sliced = allData.slice(start, end);

  container.innerHTML = "";

  sliced.forEach(item => {

    const avatar = item.name
      ? item.name.charAt(0).toUpperCase()
      : "?";

    const statusClass =
      item.status === "Hadir"
        ? "hadir"
        : "tidak";

    container.innerHTML += `
      <div class="wish-card">

        <div class="avatar">
          ${avatar}
        </div>

        <div class="wish-content">

          <div class="wish-header">

            <div>
              <div class="name">
                ${escapeHtml(item.name)}
              </div>

              <div class="date">
                ${formatDate(item.date)}
              </div>
            </div>

            <div class="status ${statusClass}">
              ${item.status || "-"}
            </div>

          </div>

          <div class="message">
            ${escapeHtml(item.message)}
          </div>

        </div>

      </div>
    `;
  });

  renderPagination();

  updateAttendance();
}

function renderPagination() {

  const totalPages = Math.ceil(
    allData.length / data.perPage
  );

  const pagination =
    document.getElementById("pagination");

  if (!pagination) return;

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {

    pagination.innerHTML += `
      <button
        class="page-btn ${
          currentPage === i ? "active" : ""
        }"
        onclick="goPage(${i})">
        ${i}
      </button>
    `;
  }
}

function goPage(page) {

  currentPage = page;

  const list =
    document.getElementById("wish-list");

  list.style.opacity = "0";

  setTimeout(() => {

    render();

    list.style.opacity = "1";

  }, 150);
}

async function submitForm() {

  const name = document
    .getElementById("name")
    .value.trim();

  const message = document
    .getElementById("message")
    .value.trim();

  const status = document
    .getElementById("status")
    .value;

  if (!name || !message || !status) {
    alert("Lengkapi form");
    return;
  }

  if (message.length > data.maxChar) {
    alert(`Max ${data.maxChar} karakter`);
    return;
  }

  await comentarService.addComentar({
    id: generateRandomId(),
    name,
    message,
    status,
    date: getCurrentDateTime(),
    color: generateRandomColor(),

  });

  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
  document.getElementById("status").selectedIndex = 0;

  await loadData();
}

function updateAttendance() {

  const hadir = allData.filter(
    x => x.status === "Hadir"
  ).length;

  const tidak = allData.filter(
    x => x.status === "Tidak Hadir"
  ).length;

  const hadirEl =
    document.getElementById("count-hadir");

  const tidakEl =
    document.getElementById("count-tidak");

  if (hadirEl) hadirEl.innerText = hadir;

  if (tidakEl) tidakEl.innerText = tidak;
}

function formatDate(date) {

  return new Date(date).toLocaleString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function escapeHtml(text) {

  const div = document.createElement("div");

  div.innerText = text;

  return div.innerHTML;
}

// expose
window.submitForm = submitForm;
window.goPage = goPage;

init();
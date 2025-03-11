// script.js
document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  if (window.location.pathname.includes("lista.html")) {
    let currentPage = 1;
    const itemsPerPage = 5;
    let allData = [];
    let currentSortOrder = localStorage.getItem("sortOrder") || "asc";
    let sortBy = localStorage.getItem("sortBy") || "title";

    const fetchData = () => {
      fetch("http://localhost:3000/api/dane")
        .then(response => response.json())
        .then(data => {
          allData = data;
          renderList();
        });
    };

    const renderList = () => {
      let filteredData = filterData(allData);
      let sortedData = sortData(filteredData);
      let paginatedData = paginateData(sortedData, currentPage, itemsPerPage);

      let content = `<h2>Lista Danych</h2>
                           <div class="filters">
                               <input type="text" id="search" placeholder="Szukaj..." value="${localStorage.getItem("searchValue") || ""}">
                               <div class="sort-controls-mobile">
                                   <label for="sort-select">Sortuj:</label>
                                   <select id="sort-select">
                                       <option value="id" ${sortBy === "id" ? "selected" : ""}>ID</option>
                                       <option value="title" ${sortBy === "title" ? "selected" : ""}>Tytuł</option>
                                   </select>
                                   <button id="sort-toggle">${currentSortOrder === "asc" ? "⬆" : "⬇"}</button>
                               </div>
                           </div>`;

      if (window.innerWidth >= 1024) {
        content += `<table class="list-table">
                                <tr>
                                    <th>ID <button id="sort-id">${sortBy === "id" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button></th>
                                    <th>Tytuł <button id="sort-title">${sortBy === "title" && currentSortOrder === "asc" ? "⬆" : "⬇"}</button></th>
                                    <th>Akcja</th>
                                </tr>`;
        paginatedData.forEach(item => {
          content += `<tr>
                                    <td>${item.id}</td>
                                    <td>${item.title}</td>
                                    <td><a href="szczegoly.html?id=${item.id}">Szczegóły</a></td>
                                </tr>`;
        });
        content += `</table>`;
      } else {
        content += `<div class="list-items">`;
        paginatedData.forEach(item => {
          content += `<div class="list-item">
                                    <h3>${item.title}</h3>
                                    <p>ID: ${item.id}</p>
                                    <a href="szczegoly.html?id=${item.id}">Szczegóły</a>
                                </div>`;
        });
        content += `</div>`;
      }

      content += paginationControls(filteredData.length);
      main.innerHTML = content;
      addEventListeners();
    };

    const filterData = (data) => {
      let searchValue = localStorage.getItem("searchValue") || "";
      return data.filter(item => item.title.toLowerCase().includes(searchValue));
    };

    const sortData = (data) => {
      return [...data].sort((a, b) => {
        if (sortBy === "title") {
          return currentSortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else {
          return currentSortOrder === "asc" ? a.id - b.id : b.id - a.id;
        }
      });
    };

    const paginateData = (data, page, perPage) => {
      let start = (page - 1) * perPage;
      return data.slice(start, start + perPage);
    };

    const paginationControls = (totalItems) => {
      let totalPages = Math.ceil(totalItems / itemsPerPage);
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      let controls = `<div class="pagination">`;

      if (startPage > 1) {
        controls += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
          controls += `<span>...</span>`;
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        controls += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          controls += `<span>...</span>`;
        }
        controls += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
      }

      controls += `</div>`;
      return controls;
    };

    const addEventListeners = () => {
      document.getElementById("search")?.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          localStorage.setItem("searchValue", event.target.value.toLowerCase());
          renderList();
        }
      });

      document.getElementById("sort-id")?.addEventListener("click", () => {
        sortBy = "id";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        localStorage.setItem("sortBy", sortBy);
        localStorage.setItem("sortOrder", currentSortOrder);
        renderList();
      });

      document.getElementById("sort-title")?.addEventListener("click", () => {
        sortBy = "title";
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
        localStorage.setItem("sortBy", sortBy);
        localStorage.setItem("sortOrder", currentSortOrder);
        renderList();
      });

      document.querySelectorAll(".page-btn").forEach(button => {
        button.addEventListener("click", (event) => {
          currentPage = parseInt(event.target.dataset.page);
          renderList();
        });
      });
    };

    window.addEventListener("resize", renderList);
    fetchData();
  }
});

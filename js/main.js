const contactsTableBody = document.getElementById("contactsTableBody");
const contactsCount = document.getElementById("contactsCount");
const mainSearch = document.getElementById("mainSearch");

const contactModal = document.getElementById("contactModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const contactForm = document.getElementById("contactForm");

const filterAll = document.getElementById("filterAll");
const filterFav = document.getElementById("filterFav");
const filterEmerg = document.getElementById("filterEmerg");

let currentFilter = "all";

let contacts = JSON.parse(localStorage.getItem("hub_contacts")) || [
  {
    name: "دكتور أحمد رأفت",
    email: "ahmed@pharmacy.com",
    phone: "01023456789",
    job: "طبيب طوارئ",
    isFavorite: true,
    isEmergency: true,
  },
  {
    name: "سارة محمد",
    email: "sara@example.com",
    phone: "01198765432",
    job: "إدارة المخزون",
    isFavorite: false,
    isEmergency: false,
  },
];

function applyFilterAndRender() {
  let filteredData = contacts;

  if (currentFilter === "fav") {
    filteredData = filteredData.filter(c => c.isFavorite);
  } else if (currentFilter === "emergency") {
    filteredData = filteredData.filter(c => c.isEmergency);
  }

  const term = mainSearch.value.toLowerCase();
  if (term) {
    filteredData = filteredData.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.toLowerCase().includes(term),
    );
  }

  renderContacts(filteredData);
}

function renderContacts(dataToRender) {
  contactsTableBody.innerHTML = "";
  contactsCount.textContent = dataToRender.length;

  if (dataToRender.length === 0) {
    contactsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding: 20px;">لا توجد سجلات مطابقة في هذا القسم</td></tr>`;
    return;
  }

  dataToRender.forEach(contact => {
    const actualIndex = contacts.indexOf(contact);

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>
                <button class="btn-fav ${contact.isFavorite ? "is-fav" : ""}" onclick="toggleFavorite(${actualIndex})">
                    <i class="${contact.isFavorite ? "fas" : "far"} fa-star"></i>
                </button>
                <strong>${contact.name}</strong>
                   ${contact.isEmergency ? '<span class="badge-emergency"><i class="fas fa-bolt"></i> طارئة</span>' : ""}
            </td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td><span class="badge">${contact.job || "—"}</span></td>
            <td>
                <button class="btn-action-delete" onclick="deleteContact(${actualIndex})">
                    <i class="fas fa-trash-can"></i> حذف
                </button>
            </td>
        `;
    contactsTableBody.appendChild(tr);
  });
}

window.toggleFavorite = function (index) {
  contacts[index].isFavorite = !contacts[index].isFavorite;
  localStorage.setItem("hub_contacts", JSON.stringify(contacts));
  applyFilterAndRender();
};

window.deleteContact = function (index) {
  contacts.splice(index, 1);
  localStorage.setItem("hub_contacts", JSON.stringify(contacts));
  applyFilterAndRender();
};

mainSearch.addEventListener("input", applyFilterAndRender);

function handleMenuFiltering(element, filterName) {
  document
    .querySelectorAll(".menu-item")
    .forEach(item => item.classList.remove("active"));
  element.classList.add("active");
  currentFilter = filterName;
  applyFilterAndRender();
}

filterAll.addEventListener("click", function (e) {
  e.preventDefault();
  handleMenuFiltering(this, "all");
});
filterFav.addEventListener("click", function (e) {
  e.preventDefault();
  handleMenuFiltering(this, "fav");
});
filterEmerg.addEventListener("click", function (e) {
  e.preventDefault();
  handleMenuFiltering(this, "emergency");
});

function toggleModal(show) {
  if (show) contactModal.classList.add("active");
  else {
    contactModal.classList.remove("active");
    contactForm.reset();
  }
}

openModalBtn.addEventListener("click", () => toggleModal(true));
closeModalBtn.addEventListener("click", () => toggleModal(false));
cancelModalBtn.addEventListener("click", () => toggleModal(false));

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const newContact = {
    name: document.getElementById("contactName").value,
    email: document.getElementById("contactEmail").value,
    phone: document.getElementById("contactPhone").value,
    job: document.getElementById("contactJob").value,
    isFavorite: false,
    isEmergency: document.getElementById("contactEmergency").checked,
  };

  contacts.push(newContact);
  localStorage.setItem("hub_contacts", JSON.stringify(contacts));

  applyFilterAndRender();
  toggleModal(false);
});

applyFilterAndRender();

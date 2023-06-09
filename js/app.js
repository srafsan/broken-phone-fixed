let phoneName = "apple";

const loadPhones = async (searchText, dataLimit) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhones(data.data, dataLimit);
};

const displayPhones = (phones, dataLimit) => {
    const phonesContainer = document.getElementById("phones-container");
    phonesContainer.innerHTML = "";

    // display 10 phones only
    const showAll = document.getElementById("show-all");

    if (dataLimit && phones.length > 9) {
        phones = phones.slice(0, dataLimit);
        showAll.classList.remove("d-none");
    } else {
        showAll.classList.add("d-none");
    }

    // display no phones found
    const noPhone = document.getElementById("no-found-message");
    if (phones.length === 0) {
        noPhone.classList.remove("d-none");
    } else {
        noPhone.classList.add("d-none");
    }

    // display all phones
    phones.forEach((phone) => {
        const phoneDiv = document.createElement("div");
        phoneDiv.classList.add("col");
        phoneDiv.innerHTML = `
            <div class="card p-4">
                <img src="${phone.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${phone.phone_name}</h5>
                    <p class="card-text">
                        This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                    </p>
                    <button onclick="loadPhoneDetails('${phone.slug}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">
                        Show Details
                    </button>
                    
                </div>
            </div>
        `;
        phonesContainer.appendChild(phoneDiv);
    });

    // stop spinner or loader
    toggleSpinner(false);
};

// Processing Search Results
const processSearch = (dataLimit) => {
    toggleSpinner(true);

    if (dataLimit !== undefined) {
        let searchField = document.getElementById("search-field");
        phoneName = searchField.value;
        searchField.value = "";
    }

    loadPhones(phoneName, dataLimit);
};

// handle search button click
document.getElementById("btn-search").addEventListener("click", function () {
    // start loader
    processSearch(9);
});

// search input field enter key handler
document
    .getElementById("search-field")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            processSearch(9);
        }
    });

const toggleSpinner = (isLoading) => {
    const loaderSection = document.getElementById("loader");
    if (isLoading) {
        loaderSection.classList.remove("d-none");
    } else {
        loaderSection.classList.add("d-none");
    }
};

// not the best way to load show All
document.getElementById("btn-show-all").addEventListener("click", function () {
    processSearch();
});

const loadPhoneDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhoneDetails(data.data);
};

const displayPhoneDetails = (phone) => {
    const modalTitle = document.getElementById("phoneDetailModalLabel");
    modalTitle.textContent = phone.name;

    const phoneDetails = document.getElementById("phone-details");
    const storageInfo = phone.mainFeatures.storage.split(",");

    phoneDetails.innerHTML = "";
    phoneDetails.innerHTML = `
        <p>Release Date: ${phone.releaseDate}</p>
        <p>Storage: ${storageInfo[0]}</p>
        <p>Others: ${
            phone.others ? phone.others.Bluetooth : "No Bluetooth Information"
        }</p>
        <p>Sensor: ${
            phone.mainFeatures.sensors
                ? phone.mainFeatures.sensors[0]
                : "no sensor"
        }</p>
    `;
};

loadPhones(phoneName, 9);

"use strict"; //active strict mode

//lấy ra các DOM element cần sử dụng
const idInput = document.getElementById("input-id"); //trường nhập id
const nameInput = document.getElementById("input-name"); //trường nhập name
const ageInput = document.getElementById("input-age"); //trường nhập age
const typeInput = document.getElementById("input-type"); //trường nhập type
const weightInput = document.getElementById("input-weight"); //trường nhập weight
const lengthInput = document.getElementById("input-length"); //trường nhập length
const colorInput = document.getElementById("input-color-1"); //trường nhập color
const breedInput = document.getElementById("input-breed"); //trường nhập breed
const vaccinatedInput = document.getElementById("input-vaccinated"); //trường nhập vaccinated
const dewormedInput = document.getElementById("input-dewormed"); //trường nhập dewormed
const sterilizedInput = document.getElementById("input-sterilized"); //trường nhập sterilized
const sidebar = document.getElementById("sidebar"); //sidebar
const sidebarTitle = document.getElementById("sidebar-title"); //sidebar title
const findBtn = document.getElementById("find-btn"); //nút find
const tableBodyEl = document.getElementById("tbody"); //bảng dữ liệu

//tạo mảng lưu danh sách thú cưng
let petSearchArray =
  localStorage.getItem("pets") === null
    ? []
    : JSON.parse(localStorage.getItem("pets"));

//tạo mảng lưu giá trị tìm kiếm, mảng hiển thị và mảng tạm
let searchArray = [],
  displayArray = [],
  tempArray = [];

//tạo mảng lưu toàn bộ danh sách breed
let breedInputArray =
  localStorage.getItem("breeds") === null
    ? []
    : JSON.parse(localStorage.getItem("breeds"));

//tạo mảng lưu breed không trùng nhau
let breedInputArrayUnique = breedInputArray.reduce(function (
  accumulator,
  breed
) {
  if (accumulator.indexOf(breed.name) === -1) {
    accumulator.push(breed.name);
  }
  return accumulator;
},
[]);

//search checking variable
let searchCheking = true;

////////////////////////////////////////////////////////////////////////////////////////////////////
//METHODS:

//phương thức hiển thị dữ liệu ra màn hình
const renderSearchTable = function (array) {
  //xóa tất cả hàng trong bảng hiện tại
  tableBodyEl.innerHTML = "";

  //tạo hàng mới và thêm dữ liệu vào hàng
  for (let i = 0; i < array.length; i++) {
    const row = document.createElement("tr");

    row.innerHTML = `<th scope="row">${array[i].id}</th>
      <td>${array[i].name}</td>
      <td>${array[i].age}</td>
      <td>${array[i].type}</td>
      <td>${array[i].weight} kg</td>
      <td>${array[i].length} cm</td>
      <td>${array[i].breed}</td>
      <td>
        <i class="bi bi-square-fill" style="color: ${array[i].color}"></i>
      </td>
      <td><i class="bi bi-${
        array[i].vaccinated ? "check" : "x"
      }-circle-fill"></i></td>
      <td><i class="bi bi-${
        array[i].dewormed ? "check" : "x"
      }-circle-fill"></i></td>
      <td><i class="bi bi-${
        array[i].sterilized ? "check" : "x"
      }-circle-fill"></i></td>
      <td>${array[i].bmi}</td>
      <td>${array[i].date}</td>`;

    tableBodyEl.appendChild(row);
  }
};

//phương thức định dạng ngày tháng dd/mm/yyyy
const formatDate = function (date) {
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  let month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : "0" + month;

  let year = date.getFullYear().toString();

  return day + "/" + month + "/" + year;
};

//phương thức cập nhật breed input
const updateBreedInput = function () {
  //xóa tất cả hàng trong breed input
  breedInput.innerHTML = `<option>Select Breed</option>`;

  //cập nhật breed input
  for (let i = 0; i < breedInputArrayUnique.length; i++) {
    const option = document.createElement("option");
    option.innerHTML = breedInputArrayUnique[i];

    breedInput.appendChild(option);
  }
};

//phương thức kiểm tra dữ liệu nhập hợp lệ
const validateData = function (data) {
  //kiểm tra người dùng nhập đủ tất cả các trường dữ liệu hay không
  let count = 0;
  tempArray = [];

  if (data.id) {
    if (tempArray.indexOf(`id-${data.id}`) === -1)
      tempArray.push(`id-${data.id}`);
    count++;
  }
  if (data.name) {
    if (tempArray.indexOf(`name-${data.name}`) === -1)
      tempArray.push(`name-${data.name}`);
    count++;
  }
  if (data.type !== "Select Type") {
    if (tempArray.indexOf(`type-${data.type}`) === -1)
      tempArray.push(`type-${data.type}`);
    count++;
  }
  if (data.breed !== "Select Breed") {
    if (tempArray.indexOf(`breed-${data.breed}`) === -1)
      tempArray.push(`breed-${data.breed}`);
    count++;
  }
  if (data.vaccinated === true) {
    if (tempArray.indexOf(`vaccinated-${data.vaccinated}`) === -1)
      tempArray.push(`vaccinated-${data.vaccinated}`);
    count++;
  }
  if (data.dewormed === true) {
    if (tempArray.indexOf(`dewormed-${data.dewormed}`) === -1)
      tempArray.push(`dewormed-${data.dewormed}`);
    count++;
  }
  if (data.sterilized === true) {
    if (tempArray.indexOf(`sterilized-${data.sterilized}`) === -1)
      tempArray.push(`sterilized-${data.sterilized}`);
    count++;
  }
  searchArray = tempArray;

  if (count === 0) {
    renderSearchTable(petSearchArray);
    return false;
  }
  return true;
};

//phương thức tìm kiếm
const searchingPet = function () {
  for (let i = 0; i < searchArray.length; i++) {
    updateSearchingPet(searchArray[i]);
  }
};

//phương thức cập nhập kết quả tìm kiếm
const updateSearchingPet = function (criteria) {
  let flag = false;
  if (criteria.startsWith("id")) {
    displayArray = petSearchArray.filter(function (pet) {
      flag = true;
      return `id-${pet.id}`.startsWith(criteria);
    });
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("name")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `name-${pet.name}`.startsWith(criteria);
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `name-${pet.name}`.startsWith(criteria);
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("type")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `type-${pet.type}` === criteria;
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `type-${pet.type}` === criteria;
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("breed")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `breed-${pet.breed}` === criteria;
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `breed-${pet.breed}` === criteria;
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("vaccinated")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `vaccinated-${pet.vaccinated}` === criteria;
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `vaccinated-${pet.vaccinated}` === criteria;
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("dewormed")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `dewormed-${pet.dewormed}` === criteria;
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `dewormed-${pet.dewormed}` === criteria;
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
  flag = false;

  if (criteria.startsWith("sterilized")) {
    if (displayArray.length > 0) {
      displayArray = displayArray.filter(function (pet) {
        flag = true;
        return `sterilized-${pet.sterilized}` === criteria;
      });
    } else {
      displayArray = petSearchArray.filter(function (pet) {
        flag = true;
        return `sterilized-${pet.sterilized}` === criteria;
      });
    }
  }

  if (flag === true && displayArray.length === 0) searchCheking = false;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENT HANDLERS:

//tạo event listener cho sidebar
sidebarTitle.addEventListener("click", function () {
  sidebar.classList.toggle("active");
});

//tạo event listener cho nút find
findBtn.addEventListener("click", function () {
  searchCheking = true;
  //tạo đối tượng lưu trữ dữ liệu nhập
  const data = {
    id: idInput.value,
    name: nameInput.value,
    type: typeInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
  };

  //reset display
  displayArray = [];
  renderSearchTable(displayArray);

  //kiểm tra dữ liệu nhập là hợp lệ
  if (validateData(data)) {
    //gọi phương thức tìm kiếm
    searchingPet();

    //cập nhật hiển thị
    if (displayArray.length > 0 && searchCheking)
      renderSearchTable(displayArray);
    else alert("Not found this pet!");
  }
});

//thiết lập khởi tạo khi tải trang
updateBreedInput();

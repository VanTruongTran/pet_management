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
const submitBtn = document.getElementById("submit-btn"); //nút submit
const healthyBtn = document.getElementById("healthy-btn"); //nút show healthy pet
const calcBMIBtn = document.getElementById("bmi-btn"); //nút calculate BMI
const tableBodyEl = document.getElementById("tbody"); //bảng dữ liệu
const sidebar = document.getElementById("sidebar"); //sidebar
const sidebarTitle = document.getElementById("sidebar-title"); //sidebar title

//tạo mảng lưu danh sách thú cưng
let petArray =
  localStorage.getItem("pets") === null
    ? []
    : JSON.parse(localStorage.getItem("pets"));

//tạo mảng lưu danh sách thú cưng healthy
let petHealthyArray = [];

//tạo biến kiểm tra healthy check
let healthyCheck = true;

//tạo mảng lưu giữ breed mặc định ban đầu
let initialBreedArray = [
  { name: "Tabby", type: "Dog" },
  { name: "Domestic Medium Hair", type: "Dog" },
  { name: "Mixed Breed", type: "Dog" },
  { name: "Domestic Short Hair", type: "Dog" },
  { name: "Terrier", type: "Dog" },
  { name: "Greyhound", type: "Dog" },
  { name: "Persian", type: "Dog" },
  { name: "Rottweiler", type: "Dog" },
  { name: "Tabby", type: "Cat" },
  { name: "Domestic Medium Hair", type: "Cat" },
  { name: "Mixed Breed", type: "Cat" },
  { name: "Domestic Short Hair", type: "Cat" },
  { name: "Terrier", type: "Cat" },
  { name: "Greyhound", type: "Cat" },
  { name: "Persian", type: "Cat" },
  { name: "Rottweiler", type: "Cat" },
];

if (localStorage.getItem("breeds") === null) {
  localStorage.setItem("breeds", JSON.stringify(initialBreedArray));
}

//tạo mảng lưu toàn bộ danh sách breed
let breedInputArray =
  localStorage.getItem("breeds") === null
    ? []
    : JSON.parse(localStorage.getItem("breeds"));

//tạo mảng lưu danh sách breed (dog)
let breedInputArrayDog = breedInputArray.filter(function (breed) {
  return breed.type === "Dog";
});

//tạo mảng lưu danh sách breed (cat)
let breedInputArrayCat = breedInputArray.filter(function (breed) {
  return breed.type === "Cat";
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//METHODS:

//phương thức kiểm tra dữ liệu nhập hợp lệ
const validateData = function (data) {
  //kiểm tra người dùng nhập đủ tất cả các trường dữ liệu hay không
  if (!(data.id && data.name && data.age && data.weight && data.length)) {
    let textAlert = "";
    if (!data.id) textAlert += "Please input for id!\n";
    if (!data.name) textAlert += "Please input for name!\n";
    if (!data.age) textAlert += "Please input for age!\n";
    if (!data.weight) textAlert += "Please input for weight!\n";
    if (!data.length) textAlert += "Please input for length!\n";
    alert(textAlert);
    return false;

    //kiểm tra dữ liệu nhập vào là hợp lệ hay không
  } else {
    let flag = true;
    let textAlert = "";

    //kiểm tra id không được trùng với các thú cưng còn lại
    for (let i = 0; i < petArray.length; i++) {
      if (data.id === petArray[i].id) {
        textAlert += "ID must unique!\n";
        flag = false;
        break;
      }
    }

    //kiểm tra age chỉ được nhập giá trị trong khoảng 1 đến 15
    if (data.age < 1 || data.age > 15) {
      textAlert += "Age must be between 1 and 15!\n";
      flag = false;
    }

    //kiểm tra weight chỉ được nhập giá trị trong khoảng 1 đến 15
    if (data.weight < 1 || data.weight > 15) {
      textAlert += "Weight must be between 1 and 15!\n";
      flag = false;
    }

    //kiểm tra length chỉ được nhập giá trị trong khoảng 1 đến 100
    if (data.length < 1 || data.length > 100) {
      textAlert += "Length must be between 1 and 100!\n";
      flag = false;
    }

    //kiểm tra bắt buộc phải chọn dữ liệu cho trường type
    if (data.type === "Select Type") {
      textAlert += "Please select Type!\n";
      flag = false;
    }

    //kiểm tra bắt buộc phải chọn dữ liệu cho trường breed
    if (data.breed === "Select Breed") {
      textAlert += "Please select Breed!\n";
      flag = false;
    }

    if (!flag) {
      alert(textAlert);
    }
    return flag;
  }
};

//phương thức hiển thị dữ liệu ra màn hình
const renderTableData = function (array) {
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
      <td>${array[i].date}</td>
      <td>
        <button type="button" class="btn btn-danger" onclick="deletePet('${
          array[i].id
        }')">Delete</button>
      </td>`;

    tableBodyEl.appendChild(row);
  }
};

//phương thức xóa dữ liệu nhập để nhập dữ liệu mới
const clearDataInput = function () {
  idInput.value = "";
  nameInput.value = "";
  ageInput.value = "";
  typeInput.value = "Select Type";
  weightInput.value = "";
  lengthInput.value = "";
  colorInput.value = "#000000";
  breedInput.value = "Select Breed";
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
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

//phương thức xóa pet khỏi danh sách
const deletePet = function (petId) {
  // Xác nhận trước khi xóa pet
  if (confirm("Are you sure?")) {
    for (let i = 0; i < petArray.length; i++) {
      if (petId === petArray[i].id) {
        //xóa đối tượng khỏi array
        petArray.splice(i, 1);
        break;
      }
    }
    if (!healthyCheck) {
      creatHealtyPetArray();
      renderTableData(petHealthyArray);
    } else {
      renderTableData(petArray);
    }

    //cập nhật vào local storage
    saveToStorage("pets", JSON.stringify(petArray));
  }
};

//phương thức tạo mảng chứa danh sách thú cưng healthy
const creatHealtyPetArray = function () {
  petHealthyArray.length = 0;
  for (let i = 0; i < petArray.length; i++) {
    if (
      petArray[i].vaccinated &&
      petArray[i].dewormed &&
      petArray[i].sterilized
    ) {
      petHealthyArray.push(petArray[i]);
    }
  }
};

//phương thức tính BMI cho toàn bộ danh sách
const calcBMI = function () {
  for (let i = 0; i < petArray.length; i++) {
    if (petArray[i].type === "Dog") {
      petArray[i].bmi = (petArray[i].weight * 703) / petArray[i].length ** 2;
    } else if (petArray[i].type === "Cat") {
      petArray[i].bmi = (petArray[i].weight * 886) / petArray[i].length ** 2;
    }
    petArray[i].bmi = Math.round(petArray[i].bmi * 100) / 100; //làm tròn đến 2 chữ số thập phân
  }
};

//phương thức lưu dữ liệu vào local storage
const saveToStorage = function (key, value) {
  localStorage.setItem(key, value);
};

//phương thức lấy dữ liệu từ local storage
const getFromStorage = function (key) {
  localStorage.getItem(key);
};

//phương thức cập nhật breed input
const updateBreedInput = function () {
  //xóa tất cả hàng trong breed input
  breedInput.innerHTML = `<option>Select Breed</option>`;

  //cập nhật breed input dựa trên type input
  if (typeInput.value === "Dog") {
    for (let i = 0; i < breedInputArrayDog.length; i++) {
      const option = document.createElement("option");
      option.innerHTML = breedInputArrayDog[i].name;

      breedInput.appendChild(option);
    }
  } else if (typeInput.value === "Cat") {
    for (let i = 0; i < breedInputArrayCat.length; i++) {
      const option = document.createElement("option");
      option.innerHTML = breedInputArrayCat[i].name;

      breedInput.appendChild(option);
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENT HANDLERS:

//tạo event listener cho nút submit
submitBtn.addEventListener("click", function () {
  //tạo đối tượng lưu trữ dữ liệu nhập
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: Number(ageInput.value),
    type: typeInput.value,
    weight: Number(weightInput.value),
    length: Number(lengthInput.value),
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    bmi: "?",
    date: formatDate(new Date()),
  };

  //kiểm tra dữ liệu nhập hợp lệ và thêm đối tượng vào array và local storage
  if (validateData(data)) {
    //thêm đối tượng vào mảng
    petArray.push(data);

    //thêm đối tượng vào local storage
    saveToStorage("pets", JSON.stringify(petArray));

    //cập nhật hiển thị
    if (!healthyCheck) {
      creatHealtyPetArray();
      renderTableData(petHealthyArray);
    } else {
      renderTableData(petArray);
    }

    //xóa dữ liệu nhập
    clearDataInput();

    alert("Successful adding!");
  }
});

//tạo event listener cho nút show healthy pet
healthyBtn.addEventListener("click", function () {
  if (healthyCheck) {
    creatHealtyPetArray();
    renderTableData(petHealthyArray);
  } else {
    renderTableData(petArray);
  }

  healthyCheck = healthyCheck ? false : true;

  if (healthyCheck) {
    healthyBtn.textContent = "Show Healthy Pet";
  } else {
    healthyBtn.textContent = "Show All Pet";
  }
});

//tạo event listener cho nút calculate bmi
calcBMIBtn.addEventListener("click", function () {
  calcBMI();

  //thêm đối tượng vào local storage
  saveToStorage("pets", JSON.stringify(petArray));

  if (!healthyCheck) {
    creatHealtyPetArray();
    renderTableData(petHealthyArray);
  } else {
    renderTableData(petArray);
  }
});

//tạo event listener cho sidebar
sidebarTitle.addEventListener("click", function () {
  sidebar.classList.toggle("active");
});

//tạo event listener cho trường nhập type input
typeInput.addEventListener("change", updateBreedInput);

//thiết lập khi tải trang
if (localStorage.getItem("pets") !== null) {
  renderTableData(petArray);
}

//cập nhật breed input
updateBreedInput();

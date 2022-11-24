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
const sidebar = document.getElementById("sidebar"); //sidebar
const sidebarTitle = document.getElementById("sidebar-title"); //sidebar title
const tableBodyEl = document.getElementById("tbody"); //bảng dữ liệu
const containerForm = document.getElementById("container-form"); //vùng nhập dữ liệu

//tạo biến lưu vị trí index id
let index;

//tạo mảng lưu giá trị pet edit
let petEditArray =
  localStorage.getItem("pets") === null
    ? []
    : JSON.parse(localStorage.getItem("pets"));

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

//phương thức xuất dữ liệu ra màn hình
const renderEditTable = function (array) {
  //xóa dữ liệu trước đó
  tableBodyEl.innerHTML = "";

  //thêm dữ liệu mới
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
        <button type="button" class="btn btn-danger" onclick="startEditPet('${
          array[i].id
        }')">Edit</button>
      </td>`;

    tableBodyEl.appendChild(row);
  }
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

//phương thức định dạng ngày tháng dd/mm/yyyy
const formatDate = function (date) {
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  let month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : "0" + month;

  let year = date.getFullYear().toString();

  return day + "/" + month + "/" + year;
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

//phương thức hiển thị thông tin pet lên vùng nhập
const updatePetInput = function (petId) {
  let i;
  for (i = 0; i < petEditArray.length; i++) {
    if (petId === petEditArray[i].id) {
      break;
    }
  }

  //đưa giá trị của đối tượng vào vùng nhập
  idInput.value = petEditArray[i].id;
  nameInput.value = petEditArray[i].name;
  ageInput.value = petEditArray[i].age;
  typeInput.value = petEditArray[i].type;
  weightInput.value = petEditArray[i].weight;
  lengthInput.value = petEditArray[i].length;
  colorInput.value = petEditArray[i].color;
  updateBreedInput();
  breedInput.value = petEditArray[i].breed;
  vaccinatedInput.checked = petEditArray[i].vaccinated;
  dewormedInput.checked = petEditArray[i].dewormed;
  sterilizedInput.checked = petEditArray[i].sterilized;

  index = i;
};

//phương thức kiểm tra dữ liệu nhập hợp lệ
const validateData = function (data) {
  //kiểm tra người dùng nhập đủ tất cả các trường dữ liệu hay không
  if (!(data.name && data.age && data.weight && data.length)) {
    let textAlert = "";
    if (!data.name) textAlert += "Please input for name!\n";
    if (!data.age) textAlert += "Please input for age!\n";
    if (!data.weight) textAlert += "Please input for weight!\n";
    if (!data.length) textAlert += "Please input for length!\n";
    alert(textAlert);
    return false;

    //kiểm tra dữ liệu nhập vào là hợp lệ hay không
  } else {
    let textAlert = "";
    let flag = true;
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

//phương thức tính BMI
const calcBMI = function (petArray, i) {
  if (petArray[i].type === "Dog") {
    petArray[i].bmi = (petArray[i].weight * 703) / petArray[i].length ** 2;
  } else if (petArray[i].type === "Cat") {
    petArray[i].bmi = (petArray[i].weight * 886) / petArray[i].length ** 2;
  }
  petArray[i].bmi = Math.round(petArray[i].bmi * 100) / 100;
};

//phương thức chỉnh sửa thông tin pet
const startEditPet = function (petId) {
  //hiển thị vùng nhập
  containerForm.classList.remove("hide");

  //hiển thị thông tin pet trên vùng nhập
  updatePetInput(petId);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENT HANDLERS:

//tạo event listener cho sidebar
sidebarTitle.addEventListener("click", function () {
  sidebar.classList.toggle("active");
});

//tạo event listener cho trường nhập type input
typeInput.addEventListener("change", updateBreedInput);

//tạo event listener cho nút submit
submitBtn.addEventListener("click", function () {
  //tạo đối tượng lưu trữ dữ liệu nhập
  const data = {
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
    (petEditArray[index].name = nameInput.value),
      (petEditArray[index].age = Number(ageInput.value)),
      (petEditArray[index].type = typeInput.value),
      (petEditArray[index].weight = Number(weightInput.value)),
      (petEditArray[index].length = Number(lengthInput.value)),
      (petEditArray[index].color = colorInput.value),
      (petEditArray[index].breed = breedInput.value),
      (petEditArray[index].vaccinated = vaccinatedInput.checked),
      (petEditArray[index].dewormed = dewormedInput.checked),
      (petEditArray[index].sterilized = sterilizedInput.checked),
      (petEditArray[index].bmi = "?"),
      (petEditArray[index].date = formatDate(new Date())),
      //tính bmi
      calcBMI(petEditArray, index);

    //tải lại bảng
    renderEditTable(petEditArray);

    //thêm đối tượng vào local storage
    localStorage.setItem("pets", JSON.stringify(petEditArray));

    //xóa dữ liệu nhập
    clearDataInput();

    //ẩn vùng nhập
    containerForm.classList.add("hide");

    alert("Successful adding!");
  }
});

//thiết lập mặc định khi tải trang
renderEditTable(petEditArray);

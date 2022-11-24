"use strict"; //active strict mode

//lấy ra các DOM element cần sử dụng
const sidebar = document.getElementById("sidebar"); //sidebar
const sidebarTitle = document.getElementById("sidebar-title"); //sidebar title
const submitBtn = document.getElementById("submit-btn"); // nút submit
const breedInput = document.getElementById("input-breed"); //trường nhập breed
const typeInput = document.getElementById("input-type"); //trường nhập type
const tableBodyEl = document.getElementById("tbody"); //bảng dữ liệu

//tạo mảng lưu trữ breed
let breedArray =
  localStorage.getItem("breeds") === null
    ? []
    : JSON.parse(localStorage.getItem("breeds"));

////////////////////////////////////////////////////////////////////////////////////////////////////
//METHODS:

//phương thức kiểm tra dữ liệu nhập hợp lệ
const validateData = function (breedData) {
  //kiểm tra người dùng nhập đủ tất cả trường dữ liệu hay không
  if (!(breedData.name && breedData.type !== "Select Type")) {
    let textAlert = "";
    if (!breedData.name) textAlert += "Please input for breed name!\n";
    if (breedData.type === "Select Type")
      textAlert += "Please select breed type!\n";
    alert(textAlert);
    return false;
  } else {
    //kiểm tra dữ liệu nhập vào không trùng nhau
    for (let i = 0; i < breedArray.length; i++) {
      if (
        `${breedData.type}-${breedData.name}` ===
        `${breedArray[i].type}-${breedArray[i].name}`
      ) {
        alert("This data are inputted, please input other data!");
        return false;
      }
    }
  }
  return true;
};

//phương thức hiển thị dữ liệu ra màn hình
const renderBreedTable = function (array) {
  //xóa tất cả hàng trong bảng hiện tại
  tableBodyEl.innerHTML = "";

  //tạo hàng mới và thêm dữ liệu vào hàng
  for (let i = 0; i < array.length; i++) {
    const row = document.createElement("tr");

    row.innerHTML = ` <td scope="col">${i + 1}</td>
    <td scope="col">${array[i].name}</td>
    <td scope="col">${array[i].type}</td>
    <td scope="col"><button type="button" class="btn btn-danger" onclick="deleteBreed('${
      array[i].type
    }-${array[i].name}')">Delete</button></td>`;

    tableBodyEl.appendChild(row);
  }
};

//phương thức xóa dữ liệu nhập
const clearDataInput = function () {
  breedInput.value = "";
  typeInput.value = "Select Type";
};

//phương thức xóa breed khỏi danh sách
const deleteBreed = function (breedId) {
  // Xác nhận trước khi xóa pet
  if (confirm("Are you sure?")) {
    for (let i = 0; i < breedArray.length; i++) {
      if (breedId === `${breedArray[i].type}-${breedArray[i].name}`) {
        //xóa đối tượng khỏi array
        breedArray.splice(i, 1);
        break;
      }
    }

    //cập nhật vào local storage
    localStorage.setItem("breeds", JSON.stringify(breedArray));

    //cập nhật hiển thị
    renderBreedTable(breedArray);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENT HANDLERS:

//tạo event listener cho sidebar
sidebarTitle.addEventListener("click", function () {
  sidebar.classList.toggle("active");
});

//tạo event listener cho nút submit
submitBtn.addEventListener("click", function () {
  //tạo đối tượng lưu dữ liệu nhập
  const breedData = {
    name: breedInput.value,
    type: typeInput.value,
  };

  //kiểm tra dữ liệu nhập hợp lệ và thêm đối tượng vào array và local storage
  if (validateData(breedData)) {
    //thêm đối tượng vào mảng
    breedArray.push(breedData);

    //thêm đối tượng vào local storage
    localStorage.setItem("breeds", JSON.stringify(breedArray));

    //cập nhật hiển thị
    renderBreedTable(breedArray);

    //xóa dữ liệu nhập
    clearDataInput();

    alert("Successful adding!");
  }
});

//thiết lập khi tải trang
if (localStorage.getItem("breeds") !== null) {
  renderBreedTable(breedArray);
}

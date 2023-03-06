const BASE_URL = 'https://prof.world/api/test_json_files/?token=6a06cc0050374e32be51125978904bd8';
const mainEl = document.querySelector('#main');

const getData = async () => {
  try {
    const response = await fetch(BASE_URL);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const checkSort = (data) => {
  const sortValue = document.cookie ? JSON.parse(document.cookie)?.sort : null;

  switch (sortValue) {
    case 'name':
      return data.sort((a, b) => a.name.localeCompare(b.name));
    case 'size':
      return data.sort((a, b) => a.size - b.size);
    case 'date':
      return data.sort((a, b) => a.mtime - b.mtime);
    default:
      return data;
  }
};

const dateConversion = (date) => {
  const fullDate = new Date(date);
  return `${fullDate.getDate()}.${String(+fullDate.getMonth() + 1).padStart(2, '0')}.${fullDate.getFullYear()} ${String(
    fullDate.getHours()
  ).padStart(2, '0')}:${String(fullDate.getMinutes()).padStart(2, '0')}`;
};

const clickFolder = (e) => {
  let id;
  if (e.target.className === 'folder') {
    id = e.target.dataset.id;
  } else if (e.target.parentElement.className === 'folder') {
    id = e.target.parentElement.dataset.id;
  }

  getData().then((res) => {
    if (res.data?.files) {
      const list = document.querySelector('.folders_list');
      list.removeEventListener('click', clickFolder);
      list.remove();
      mainEl.append(filesMarkUp(res.data.files[id], id));
    }
  });
};

const folderMarkUp = (folders = {}) => {
  const foldersName = Object.keys(folders);
  const list = document.createElement('ul');
  list.classList.add('folders_list');
  list.addEventListener('click', clickFolder);
  foldersName.map((name) => {
    const item = document.createElement('li');
    const itemText = document.createElement('span');
    item.classList.add('folder');
    item.dataset.id = name;
    itemText.classList.add('folder_text');
    itemText.textContent = name;
    item.append(itemText);
    list.append(item);
  });
  return list;
};

const createTableBody = (files, id) => {
  const body = document.createElement('tbody');
  body.classList.add('files_list');
  body.dataset.id = id;
  checkSort(files).forEach((file) => {
    const bodyRow = document.createElement('tr');
    const bName = document.createElement('td');
    bName.textContent = file.name;
    bName.classList.add('filesName');
    const bSize = document.createElement('td');
    bSize.textContent = file.size;
    bSize.classList.add('filesSize');
    const bTime = document.createElement('td');
    bTime.textContent = dateConversion(file.mtime);
    bTime.classList.add('filesTime');
    bodyRow.append(bName, bSize, bTime);
    body.append(bodyRow);
  });
  return body;
};

const clickSort = (e) => {
  const filesList = document.querySelector('.files_list');
  const id = filesList.dataset.id;
  getData().then((res) => {
    const newMarkUp = createTableBody(res.data?.files[id], id);
    filesList.replaceWith(newMarkUp);
  });
  document.cookie = JSON.stringify({ sort: e.target.dataset.id });
};

const filesMarkUp = (files = [], id = '') => {
  const table = document.createElement('table');
  table.classList.add('files_table');
  const headerRow = document.createElement('tr');
  const nameHeader = document.createElement('th');
  nameHeader.textContent = 'Name';
  nameHeader.dataset.id = 'name';
  nameHeader.classList.add('filesHeader');
  const sizeHeader = document.createElement('th');
  sizeHeader.textContent = 'Size';
  sizeHeader.dataset.id = 'size';
  sizeHeader.classList.add('filesHeader');
  const timeHeader = document.createElement('th');
  timeHeader.textContent = 'Date';
  timeHeader.dataset.id = 'date';
  timeHeader.classList.add('filesHeader');
  headerRow.append(nameHeader, sizeHeader, timeHeader);
  headerRow.addEventListener('click', clickSort);
  table.append(headerRow, createTableBody(files, id));
  return table;
};

getData().then((res) => {
  if (res.data?.files) {
    mainEl.append(folderMarkUp(res.data.files));
  }
});

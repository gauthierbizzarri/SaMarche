

ipcRenderer.on('data', (event, data) => {
  console.log(data);
  if (Array.isArray(data)) {
    // Clear the current content of the list
    document.getElementById('data').innerHTML = '';
    // Loop through the items in the array
    data.forEach(item => {
      // Create a new list item
      let li = document.createElement('li');
      li.innerHTML = item;
      // Append the new list item to the list
      document.getElementById('data').appendChild(li);
    });
  }

});
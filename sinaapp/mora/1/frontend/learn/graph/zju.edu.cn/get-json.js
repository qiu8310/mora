function getData() {
  var data = [], menu, t;
  for ( key in window ) {
    if (key.indexOf('mm_menu') === 0) {
      menu = [];
      t = window[key];
      t.actions.forEach(function(action, i) {
        var label = t.items[i], mat;
        mat = action.match(/'([^']*)'/);
        if (!mat) {
          console.error(action);
        } else {
          menu.push({url: mat[1], label: label});
        }
      });

      data.push(menu);
    }
  }
  return data;
}

function save (data, filename) {
  if(!data) {
    console.error('Console.save: No data')
    return;
  }

  if(!filename) filename = 'console.json'

  if(typeof data === "object"){
    data = JSON.stringify(data, undefined, 4)
  }

  var blob = new Blob([data], {type: 'text/json'}),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

save(getData(), 'data.json');
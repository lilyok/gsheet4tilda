$( document ).ready(function() {
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
});


const createDataTree = (dataset, elId=null) => {
  const hashTable = Object.create(null);
  dataset.forEach(aData => {
    aData.PrevTrade = 0;
    aData.CurTrade = 0;
    hashTable[aData.ID] = {...aData, childNodes: []};
  });
  const dataTree = [];
  dataset.forEach(aData => {
    if(aData.parentID) {
      hashTable[aData.parentID].childNodes.push(hashTable[aData.ID]);
    }
    else dataTree.push(hashTable[aData.ID]);
  });
  if (elId) {
    return [hashTable[elId]];
  } else {
    return dataTree;
  }
};


function CreateUlTreeView(items, parent, start=true){
  var ul = document.createElement("ul");
  if (!start) {
    ul.setAttribute("class", "nested");
  }

  if (parent)
      parent.appendChild(ul);
      var prevTradeVal = 0;
      var curTradeVal = 0;

      items.forEach(function(x) {
        curTradeVal += x.CurSum;
        prevTradeVal += x.PrevSum;

        var li = document.createElement("li");
        var text = document.createElement("span");
        var prevSum = document.createElement("span")
        var curSum = document.createElement("span")
        var prevTrade = document.createElement("span");
        var curTrade = document.createElement("span");
        text.setAttribute("class", "email");

        text.innerHTML = x.ID;
        prevSum.innerHTML = "Потрачено за предыдущий месяц = " + x.PrevSum + "р. ";
        curSum.innerHTML = "Потрачено за текущий месяц = " + x.CurSum+ "р.";


        li.appendChild(text);
        li.append(document.createElement("br"));
        li.append(document.createElement("br"));

        li.appendChild(prevSum);
        li.append(document.createElement("br"));
        li.appendChild(curSum);
        li.append(document.createElement("br"));


        if (x.childNodes && x.childNodes.length>0) {
          li.append("ТО за предыдущий месяц = ");
          li.appendChild(prevTrade);
          li.append("р.");

          li.append(document.createElement("br"));
          li.append("ТО за текущий месяц = ");
          li.appendChild(curTrade);
          li.append("р.");

          text.setAttribute("class", "caret");
          res = CreateUlTreeView(x.childNodes, li, start=false);
          prevTradeVal += res[0];
          curTradeVal += res[1];
          prevTrade.innerHTML = prevTradeVal - x.PrevSum;
          curTrade.innerHTML = curTradeVal - x.CurSum;
        }

        ul.append(li);

      });
      return [prevTradeVal, curTradeVal];
}


// const dataSet = [{
//   "PrevSum": 222,
//   "CurSum": 666,
//   "ID": "Grady@gmail.com"
// }, {
//   "parentID": "Grady@gmail.com",
//   "PrevSum": 0,
//   "CurSum": 0,
//   "ID": "Scarlet@gmail.com"
// }, {
//   "parentID": "Scarlet@gmail.com",
//   "PrevSum": 333,
//   "CurSum": 999,
//   "ID": "Elena@gmail.com"
// }, {
//   "parentID": "Scarlet@gmail.com",
//   "PrevSum": 23,
//   "CurSum": 1000,
//   "ID": "Helena@gmail.com"
// }, {
//   "parentID": "Grady@gmail.com",
//   "PrevSum": 12,
//   "CurSum": 21,
//   "ID": "Ololo@gmail.com"
// }, {
//   "parentID": "Elena@gmail.com",
//   "PrevSum": 333,
//   "CurSum": 43,
//   "ID": "Dada@gmail.com"
// }
// ];


// var tree = createDataTree(dataSet, "Elena@gmail.com");

// console.log(tree);


// CreateUlTreeView(tree, document.getElementById("container"));

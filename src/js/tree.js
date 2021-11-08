const createDataTree = (dataset, elId=null) => {
  const hashTable = Object.create(null);
  dataset.forEach(aData => {
    aData.PrevTrade = 0;
    aData.CurTrade = 0;
    hashTable[aData.ID] = {...aData, childNodes: []};
  });
  const dataTree = [];
  dataset.forEach(aData => {
    if (aData.ParentID) {
      hashTable[aData.ParentID].childNodes.push(hashTable[aData.ID]);
    }
    else dataTree.push(hashTable[aData.ID]);
  });

  if (elId) {
    return [hashTable[elId]];
  } else {
    return dataTree;
  }
};

function createEl(x) {
  var li = document.createElement("li");
  var text = document.createElement("span");
  var prevSum = document.createElement("span")
  var curSum = document.createElement("span")
  var prevTrade = document.createElement("span");
  var curTrade = document.createElement("span");
  if (x.childNodes && x.childNodes.length > 0)
    text.setAttribute("class", "caret");
  text.innerHTML = x.ID + " (" + x.AdditionalText + ")";
  prevSum.innerHTML = "Потрачено за предыдущий месяц = " + x.PrevSum + "р. ";
  curSum.innerHTML = "Потрачено за текущий месяц = " + x.CurSum+ "р.";

  li.appendChild(text);
  li.append(document.createElement("br"));
  li.append(document.createElement("br"));

  li.appendChild(prevSum);
  li.append(document.createElement("br"));
  li.appendChild(curSum);
  li.append(document.createElement("br"));

  return li;
}


function listItem(obj, block) {
  x = obj;

  var ul = document.createElement("ul");
  var li = createEl(x);

  ul.append(li);  
  block.appendChild(ul);


  var curUl = null;
  var curLI = null;
  var stack = [x];

  var stackUl = [ul];
  var stackLI = [li];
   
  var summary = []

  while (true) {
    if (x.childNodes && x.childNodes.length > 0) {
      stack.push(x);
      x = x.childNodes.pop();

      var ul = curUl !== null ? curUl : document.createElement("ul");
      ul.setAttribute("class", "nested");
      stackUl.push(ul);


      stackLI[stackLI.length - 1].appendChild(ul);

      var li = createEl(x);


      stackLI.push(li)
      // ul.append(li);
      curUl = null;
    } else if (stack.length > 0) {
      stackLI[stackLI.length - 1].append(document.createElement("br"));
      stackLI[stackLI.length - 1].append("ТО за предыдущий месяц = " + x.PrevTrade);
      stackLI[stackLI.length - 1].append(document.createElement("br"));
      stackLI[stackLI.length - 1].append("ТО за текущий месяц = " + x.CurTrade);
      summary = [x.PrevSum, x.CurSum, x.PrevTrade, x.CurTrade];

      var childPrevTrade = x.PrevSum + x.PrevTrade;
      var childCurTrade = x.CurSum + x.CurTrade;
      x = stack.pop();

      x.PrevTrade += childPrevTrade;
      x.CurTrade += childCurTrade;

      curUl = stackUl.pop();
      curLI = stackLI.pop();
      curUl.append(curLI);
    } else {
      break;
    }

  }
  return summary;
}


function createTree(dataset, elId, blockId) {
  tree = createDataTree(dataset, elId);
  var block = document.getElementById(blockId)
  summary = listItem(tree[0], block);
  window.PrevSum = summary[0]
  window.CurSum = summary[1]
  window.PrevTrade = summary[2]
  window.CurTrade = summary[3]

  console.log(summary)
  var toggler = document.getElementsByClassName("caret");
  var i;

  for (i = 0; i < toggler.length; i++) {
   toggler[i].addEventListener("click", function() {
     this.parentElement.querySelector(".nested").classList.toggle("active");
     this.classList.toggle("caret-down");
   });
  }
}
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

const createDataTree = (dataset, elId=null) => {
  const hashTable = Object.create(null);
  dataset.forEach(aData => {
    if (!isPureTree) {
      aData.PrevTrade = 0;
      aData.CurTrade = 0;
    }
    hashTable[aData.ID] = {...aData, childNodes: []};
  });
  const dataTree = [];
  dataset.forEach(aData => {
    if (aData.ParentID && aData.ParentID != aData.ID) {
      hashTable[aData.ParentID].childNodes.push(hashTable[aData.ID]);
    }
    else dataTree.push(hashTable[aData.ID]);
  });

  if (isPureTree) {
    return hashTable;
  }

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
  prevSum.innerHTML = "Сумма личных покупок за предыдущий месяц = " + x.PrevSum + "р. ";
  curSum.innerHTML = "Сумма личных покупок за текущий месяц = " + x.CurSum+ "р.";

  li.appendChild(text);
  li.append(document.createElement("br"));
  li.append(document.createElement("br"));

  li.appendChild(prevSum);
  li.append(document.createElement("br"));
  li.appendChild(curSum);
  li.append(document.createElement("br"));

  
    li.setAttribute("class", "person");

  return li;
}


function listItem(obj, block) {
  children = []
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
      children.push(x.ID);

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

function calculateIncome(value, criterions, isPercentData=false) {
  if (criterions[0][1] > value) {
    return isPercentData ? [0, 0]: 0;
  }
  for(var i = 0; i < criterions.length; i++) {
    if (criterions[i][1] <= value && value < criterions[i][2]) {
      if (isPercentData) {
        return [criterions[i][0] * 100, value * criterions[i][0]];
      }
      return value * criterions[i][0];
    }
  }
}


function enrichDataset(dataset, labels, startID, criterions) {
  const primaryKey = labels[0];
  const dateKey = labels[1];
  const key = labels[4];
  const keyFolowers = labels[5];

  // enrich window.tree by spent money
  for(var i = 0; i < dataset.length; i++) {
    const curID = dataset[i][primaryKey];
    if (!(curID in window.tree)) {
      continue;
    };
    const curDate = dataset[i][dateKey];
    if (!("byDates" in window.tree[curID])) {
      window.tree[curID]["byDates"] = {};
    };
    if (!(curDate in window.tree[curID]["byDates"])) {
      window.tree[curID]["byDates"][curDate] = {};
    };
    if (!(key in window.tree[curID]["byDates"][curDate])) {
      window.tree[curID]["byDates"][curDate][key] = dataset[i][key];
    };
    if (!(keyFolowers in window.tree[curID]["byDates"][curDate])) {
      window.tree[curID]["byDates"][curDate][keyFolowers] = 0;
    };
    for (var j=2; j < 4; j++) {  // between dateKey and key
      window.tree[curID][labels[j]] = dataset[i][labels[j]];
    }
  }

  stack = [startID];
  x = startID;

  enrichedDataset = []

  while (true) {
    if (window.tree[x].childNodes && window.tree[x].childNodes.length > 0) {
      stack.push(x);
      x = window.tree[x].childNodes.pop()["ID"];
    } else if (stack.length > 0) {

      var curSumsByDates = "byDates" in window.tree[x] ? window.tree[x]["byDates"] : {};

      $.each(curSumsByDates, function(k, v){
        const incomeData = calculateIncome(v[keyFolowers], criterions, true);
        el = {"email": x, "имя": window.tree[x][labels[2]] || "-", "телефон": window.tree[x][labels[3]] || "-", "дата": k, [key]: v[key], [keyFolowers]: v[keyFolowers], "Процент в %": incomeData[0], "Доход": incomeData[1]}
        enrichedDataset.push(el);
      });

      x = stack.pop();

      $.each(curSumsByDates,function(curDate, curSums){
        const prevSum = curSums[keyFolowers] + curSums[key];
        if (!("byDates" in window.tree[x])) {
          window.tree[x]["byDates"] = {};
        }
        if (!(curDate in window.tree[x]["byDates"])) {
          window.tree[x]["byDates"][curDate]= {[key]: 0, [keyFolowers]: 0};
        }
        // window.tree[x]["byDates"][curDate][key] += curSums[key];
        window.tree[x]["byDates"][curDate][keyFolowers] += prevSum;

      });
    } else {
      break;
    }
  }
  return enrichedDataset;
}

function createTree(dataset, elId, blockId, summaryId, summaryTemplate, criterions, minPurchase) {
  tree = createDataTree(dataset, elId, isPureTree=!blockId);
  if (blockId) {
    tree = createDataTree(dataset, elId);
    var block = document.getElementById(blockId);
    summary = listItem(tree[0], block);  // PrevSum, CurSum, PrevTrade, CurTrade
    delete window.tree;
  }

  delete window.result;


  if (summaryTemplate) {
    var str = "% от ТО выплачивается, если ТО >= {0}руб., а личные покупки >= {1}руб. ".format(criterions[0][1], minPurchase);
    if (summary[0] >= minPurchase && summary[2] >= criterions[0][1]) {
      str += "В прошлом месяце все условия соблюдены. Ваш доход за прошлом месяц составляет: " + calculateIncome(summary[2], criterions) + "руб. ";
    } else {
      str += "В прошлом месяце условия не соблюдены. ";
    }

    if (summary[1] >= minPurchase && summary[3] >= criterions[0][1]) {
      str += "В этом месяце все условия соблюдены. Ваш доход за этом месяц составляет: " + calculateIncome(summary[3], criterions) + "руб. ";
    } else {
      str += "В этом месяце условия не соблюдены. ";
    }
    var summary = document.getElementById(summaryId);
    summary.setAttribute("class", "summary");
    summary.append(str);
  }

  if (blockId) {
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
     toggler[i].addEventListener("click", function() {
       this.parentElement.querySelector(".nested").classList.toggle("active");
       this.classList.toggle("caret-down");
     });
    }
  }
}
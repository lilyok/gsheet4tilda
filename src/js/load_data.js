var params;

//callback for google spreadsheets response
var google = {visualization: {Query: {setResponse: function(){}}}}


function tableData2jsonList(data) {
    result = [];
    if (params.labels) {
        labels = params.labels;
    } else {
        labels = ["ID", "ParentID", "PrevSum", "CurSum", "AdditionalText"];
    }

    for(var i = 0; i < data.table.rows.length; i++)
    {
        el = {};
        var isMatch = true;
        for(var j = 0; j < data.table.rows[i].c.length; j++)
        {
            if ("filterBy" in params && labels[j] in params.filterBy && !params.filterBy[labels[j]].has(data.table.rows[i].c[j].v)) {
                isMatch = false;
                break;
            }
            el[labels[j]] = data.table.rows[i].c[j] !== null ? data.table.rows[i].c[j].v : null;
        }
        if (isMatch) {
            result.push(el);
        }
    }
    return result;
}


// Callback to p jsonp
google.visualization.Query.setResponse = function(data)
{
    var dataset = tableData2jsonList(data)
    if ("isReport" in params && (params.isReport == true ||  params.isReport == "true")) {
        var fileTitle = params.title;
        if (params.isAdvanced == true ||  params.isAdvanced == "true") {
            dataset = enrichDataset(dataset, params.labels, params.nodeID, params.criterions);
        }
        exportCSVFile(params.labels, dataset, fileTitle);

    } else {
        if ("isTree" in params && (params.isTree == true ||  params.isTree == "true")) {
            createTree(dataset, params.nodeID, params.blockID, params.summaryBlockID,
                        params.summaryTemplate, params.criterions, params.minPurchase);
        } else {
            $.each(dataset[0], function(key, value) {
                var curEl = document.getElementById(key + "_value");
                if (curEl.nodeName == 'INPUT') {
                    if (value != '' && !isNaN(value)) {
                        value = value.toFixed(2);
                    }
                    curEl.value = value;
                    $('#' + key + "_value").change();
                } else {
                    curEl.innerHTML = value;
                }
            })
        }
    }
}

function returnURL(params, dataType="json") {
    var googleSheetCode = params["url"].slice( params["url"].indexOf(
    "spreadsheets/d/") + 15, params["url"].indexOf("/edit?"));
    return 'https://docs.google.com/spreadsheets/u/2/d/' + googleSheetCode +
        '/gviz/tq?tqx=out:' + dataType + '&range=' + params.range + '&sheet=' + params.sheet +
        '&tq=' + encodeURIComponent( params.req );
}


//  request to google spreadsheets
function getGSheetData(params)
{
    if ("url" in params && "req" in params)
    {
        $.ajax({
            url: returnURL(params),
            dataType : 'jsonp'
        });
    }
}

function getData(settings)
{
    window.params = settings;
    getGSheetData(params);
}



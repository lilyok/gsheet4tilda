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

const holidays = {  // {month: {day: [text, value]}}
    1: {7: ["Рождество Христово", 15]},
    2: {14: ["День святого Валентина", 15], 23: ['День защитника Отечества', 15], 27: ["Тест", 15]},
    3: {8: ["Международный женский день", 15]},
    5: {1: ["Праздник Весны и Труда", 15], 9: ["День Победы", 15]},
    6: {12: ["День России", 15]},
    11: {4: ["День народного единства", 15]},
    12: {31: ["Новый Год", 15]}
};

function isHoliday() {
    const dt = new Date();
    const day = dt.getDate();
    const month = dt.getMonth() + 1;
    if (month in holidays && day in holidays[month]) {
        return holidays[month][day];
    }
    return '';
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
            if ("saveAs" in params) {
                window[params.saveAs] = dataset;
                return;
            }
            $.each(dataset[0], function(key, value) {
                if (key == "cashback" && document.getElementsByClassName('t-input-group_rd').length > 0) {
                    const cashback_option = (value != '' && !isNaN(value)) ? ` (доступно ${value.toFixed(2)} р.)` : " (недоступно)";
                    // TODO check is holiday
                    const holiday = isHoliday();  // '' or ['8 марта', '15']
                    const discount_option = holiday ? `<label id='yesDiscount' class="t-radio__control t-text t-text_xs" style=""><input type="radio" name="discountOption" value=${holiday[1]} class="t-radio js-tilda-rule" data-tilda-req="1"><div class="t-radio__indicator"></div>-${holiday[1]}% в честь праздника ${holiday[0]}</label>` : '';
                    const summary_oprion = (cashback_option  && discount_option) ? '<label id="yesCashbackDiscount" class="t-radio__control t-text t-text_xs" style=""><input type="radio" name="discountOption" value="кешбэк + акция" class="t-radio js-tilda-rule" data-tilda-req="1"><div class="  t-radio__indicator"></div>кешбэк + праздничная скидка</label>' : '';
                    t = `<div class="t-input-title t-descr t-descr_md" data-redactor-toolbar="no" field="li_title__1645901383097" style="">Применить скидку</div>
                        <div class="t-input-block">
                            <div class="t-radio__wrapper">
                                <label id='noCashback' class="t-radio__control t-text t-text_xs" style=""><input type="radio" name="discountOption" value="нет" checked="checked" class="t-radio js-tilda-rule" data-tilda-req="1"><div class="t-radio__indicator"></div>нет</label>
                                <label id='yesCashback' class="t-radio__control t-text t-text_xs" style=""><input type="radio" name="discountOption" value="кешбэк" class="t-radio js-tilda-rule" data-tilda-req="1"><div class="t-radio__indicator"></div>кешбэк${cashback_option}</label>
                                ${discount_option}
                                ${summary_oprion}
                             </div>
                        <div class="t-input-error"></div>
                        </div>`;

                    $('.t-input-group_rd').html(t);

                    $('#discountOption').change();
                } 

                var curEl = document.getElementById(key + "_value");

                if (curEl.nodeName == 'INPUT') {
                    if (key == "cashback" && value != '' && !isNaN(value)) {
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



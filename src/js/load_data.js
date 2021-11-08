var params;

//callback for google spreadsheets response
var google = {visualization: {Query: {setResponse: function(){}}}}


function tableData2jsonList(data) {
	result = [];
	labels = ["ID", "ParentID", "PrevSum", "CurSum", "AdditionalText"];

	for(var i = 0; i < data.table.rows.length; i++)
	{
		// empty = true;
		el = {};
		for(var j = 0; j < data.table.rows[i].c.length; j++)
		{
			el[labels[j]] = data.table.rows[i].c[j] !== null ? data.table.rows[i].c[j].v : null;
		}
		result.push(el);
	}
	return result;
}

// Callback to p jsonp
google.visualization.Query.setResponse = function(data)
{	
	var dataset = tableData2jsonList(data)
	if ("nodeID" in params && "isTree" in params && (params.isTree == true ||  params.isTree == "true")) {
		createTree(dataset, params.nodeID, params.blockID, params.summaryTemplate)
	} else {
		console.log(dataset);
	}
}

//  request to google spreadsheets
function getGSheetData(params)
{
	if ("url" in params && "req" in params)
	{
		// table code from url
		var googleSheetCode = params["url"].slice( params["url"].indexOf(
			"spreadsheets/d/") + 15, params["url"].indexOf("/edit?"));
		$.ajax({	
			url: 'https://docs.google.com/spreadsheets/u/2/d/' + googleSheetCode +
				'/gviz/tq?tqx=out:json&range=' + params.range +
				'&sheet=' + params.sheet + '&tq=' +
				encodeURIComponent( params.req ),
			dataType : 'jsonp'
		});
	}
}

function getData(settings)
{
	window.params = settings;
	getGSheetData(params);
}



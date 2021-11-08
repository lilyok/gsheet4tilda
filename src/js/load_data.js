var prms;

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
	if ("nodeID" in prms && "isTree" in prms && (prms.isTree == true ||  prms.isTree == "true")) {
		createTree(dataset, prms.nodeID, prms.blockID)
	} else {
		console.log(dataset);
	}
}

//  request to google spreadsheets
function getGSheetData(prms)
{
	if ("url" in prms && "req" in prms)
	{
		// table code from url
		var googleSheetCode = prms["url"].slice( prms["url"].indexOf(
			"spreadsheets/d/") + 15, prms["url"].indexOf("/edit?"));
		$.ajax({	
			url: 'https://docs.google.com/spreadsheets/u/2/d/' + googleSheetCode +
				'/gviz/tq?tqx=out:json&range=' + prms.range +
				'&sheet=' + prms.sheet + '&tq=' +
				encodeURIComponent( prms.req ),
			dataType : 'jsonp'
		});
	}
}

function getData(settings)
{
	window.prms = settings;
	getGSheetData(prms);
}



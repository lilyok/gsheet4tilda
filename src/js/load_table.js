var curBlock = 0;
//callback for google spreadsheets response
var google = {visualization: {Query: {setResponse: function(){}}}}
// save current function
var oldF = t431_createTable;
var styles = {};

t431_createTable = function (
	id,
	t431__tablehead,
	t431__tablebody,
	per,
	w,
	t431__btnstyles,
	t431__tdstyles,
	t431__thstyles,
	t431__oddrowstyles,
	t431__evenrowstyles
){
	styles['rec'+id] = {
		t431__tablehead: t431__tablehead,
		t431__tablebody: t431__tablebody,
	};

	oldF(
		id,
		t431__tablehead,
		t431__tablebody,
	);
}

function gsheet4tilda_createT431 (blockID, data)
{
	// fill the headers
	var part1="";
	var start_i = parseInt(prms[curBlock].start_i);
	if (!prms[curBlock].labels) {  // headers shouldn't be overrided
		if (start_i == 0) {  // headers are just 1st row without labels
			for(var i=0; i<data.table.cols.length; i++)
			{
				part1 += htmlentities(data.table.cols[i].label) + ';';
			}
			part1 = part1.slice(0,-1);
		} else {  // regular headers with labels
			for(var j=0; j<data.table.rows[0].c.length; j++) {
				part1 += htmlentities(data.table.rows[0].c[j].v) + ';';
			}
			part1 = part1.slice(0,-1);
		}
	} else {  // headers should be overrided
		for(var i=0; i<prms[curBlock].labels.length; i++)
		{
			part1 += htmlentities(prms[curBlock].labels[i]) + ';';
		}
		part1 = part1.slice(0,-1);
	}

	// fill the rows
	var part2="";
	var empty = true;
	for(var i=start_i; i<data.table.rows.length; i++)
	{
		empty = true;
		for(var j=0; j<data.table.rows[i].c.length; j++)
		{			
			if(data.table.rows[i].c[j] !== null && 
				typeof data.table.rows[i].c[j] === 'object' && 
				data.table.rows[i].c[j].v !== null && 
				data.table.rows[i].c[j].v !== '')
			{
				part2 += htmlentities(data.table.rows[i].c[j].v) + ';'
				empty = false;
			}
			else
			{
				part2 += ';'
			};
			
		}
		
		part2 = !empty ? part2.slice(0,-1) + "\n" : part2.slice(0,- data.table.rows[i].c.length);
	}
	part2 = part2.slice(0,-1);

	//  clear block form the old data
	$('#rec' + blockID + " table").html('<thead class="t431__thead"><tr><th></th></tr></thead>');
	
	t431_createTable(blockID, part1, part2);

	//  change column's width
	if('' && $('#rec'+ blockID +' .t431 .t-container .t431__data-part2').html().length>0) {
		setTimeout(function(){ t431_setHeadWidth(prms[curBlock].id); }, 200);
	}	
}

function gsheet4tilda_createT273 (blockID, data)
{
	var faqContainer = $("#rec"+blockID + " .t-col:first");
	// find first el
	var faqElement = $("#rec"+blockID + " .t273__wrapper:first");
	
	// fill questions-answers
	for(var i=0; i<data.table.rows.length; i++)
	{
		
		if ( data.table.rows[i].c[0] !== null && typeof data.table.rows[i].c[0] === 'object'
			&& data.table.rows[i].c[0].v !== null && data.table.rows[i].c[0].v !== ''
			&& data.table.rows[i].c[1] !== null && typeof data.table.rows[i].c[1] === 'object'
			&& data.table.rows[i].c[1].v !== null && data.table.rows[i].c[1].v !== ''
			&& data.table.rows[i].c[2] !== null && typeof data.table.rows[i].c[2] === 'object'
			&& data.table.rows[i].c[2].v !== null && data.table.rows[i].c[2].v !== ''
			&& data.table.rows[i].c[3] !== null && typeof data.table.rows[i].c[3] === 'object'
			&& data.table.rows[i].c[3].v !== null && data.table.rows[i].c[3].v !== ''
		)
		{
			faqCurElement = i==0 ? faqElement : $(faqElement).clone().appendTo(faqContainer);

			$(faqCurElement).find(".t273__question-name:first").html(htmlentities(data.table.rows[i].c[0].v) + ":" );
			$(faqCurElement).find(".t273__question-text:first").html( htmlentities(data.table.rows[i].c[1].v) );

			$(faqCurElement).find(".t273__answer-name:first").html( htmlentities(data.table.rows[i].c[2].v) + ":" );
			$(faqCurElement).find(".t273__answer-text:first").html( htmlentities(data.table.rows[i].c[3].v) );
		}
	}
}

// Callback to p jsonp
google.visualization.Query.setResponse = function(data)
{
	var blockID = prms[curBlock].id;
	var blockType = $("#rec"+blockID + " div:first").attr("class");

	switch (blockType) {
		case 't431' :
			// table
			gsheet4tilda_createT431(blockID, data);
			break;
		case 't273' :
			// faq
			gsheet4tilda_createT273(blockID, data);
			break;
	}

	
	//  next block
	if (curBlock < prms.length-1)
	{
		curBlock++;
		getGSheetData();
	}
	else
	{
		curBlock = 0;
	}
}

//  request to google spreadsheets
function getGSheetData()
{
	if ("id" in prms[curBlock] && "url" in prms[curBlock] && "req" in prms[curBlock])
	{
		// table code from url
		var googleSheetCode = prms[curBlock]["url"].slice( prms[curBlock]["url"].indexOf(
			"spreadsheets/d/") + 15, prms[curBlock]["url"].indexOf("/edit?"));
		$.ajax({	
			url: 'https://docs.google.com/spreadsheets/u/2/d/' + googleSheetCode +
				'/gviz/tq?tqx=out:json&range=' + prms[curBlock].range +
				'&sheet=' + prms[curBlock].sheet + '&tq=' +
				encodeURIComponent( prms[curBlock].req ),
			dataType : 'jsonp'
		});
	}
}

function htmlentities(s){
	//  text to div
	var div = document.createElement('div');
	var text = document.createTextNode(s);
	div.appendChild(text);
	return div.innerHTML;
}

$().ready(function(){
	curBlock = 0;
	getGSheetData();
})

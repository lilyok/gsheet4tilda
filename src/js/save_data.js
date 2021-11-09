function setData1()  // 
{
	// TEST access to private
    fileName = "https://github.com/lilyok/google_sheet_manager/blob/main/README.md"
    fetch(fileName).then((r)=>{r.text().then((d)=>{
    	console.log(d)

	    var $readme = $(d).find('#readme');
	    console.log($readme);

    })});
}



function setData2()  // 
{
	// TEST access to private
    fileName = "https://github.com/lilyok/google_sheet_manager/blob/main/README.md"
    $.get(fileName).then(function (html) {
    // Success response
    console.log(html);

    var $readme = $(html).find('#readme');
    console.log($readme);
    // document.write($mainbar.html());
}, function () {
    // Error response
    document.write('Access denied');
});
}


// https://github.com/lilyok/google_sheet_manager/blob/main/README.md
// arr = $("#readme").textContent.split('\n')
// robot_email = arr[1].trim()
// pk = arr.slice(2,-1).join('\n')


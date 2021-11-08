$().ready(function(){
	var email = 'lil.lilyok@gmail.com';
	// var email = 'lilyoknabieva@gmail.com';


	getData(
        {
            nodeID  : email, 
            blockID: "container",
            isTree: true,
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req : "select B, C, G, F, A",  // ID, parentID, PrevSum, CurSum, additionalText
            range: 'A1:H',
            sheet: 'web'
        },
	);
})
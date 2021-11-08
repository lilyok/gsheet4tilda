$().ready(function(){
	// var email = 'lil.lilyok@gmail.com';
	var email = 'lilyoknabieva@gmail.com';

	getData(
        {
            nodeID  : email, 
            blockID: "container",
            summaryBlockID: "summary",
            summaryTemplate: " Траты за прошлый месяц: {0}, за текущий: {1}. ТО за прошлый месяц: {2}, за текущий: {3}.",
            criterions: [[0.06, 15000, 30000], [0.09, 30000, 60000], [0.12, 60000, 100000],
            			[0.15, 100000, 170000], [0.18, 170000, 250000], [0.22, 250000, 1000000000]],
            minPurchase: 5000,
            isTree: true,
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req : "select B, C, G, F, A",  // ID, parentID, PrevSum, CurSum, AdditionalText
            range: 'A1:H',
            sheet: 'web'
        },
	);
})

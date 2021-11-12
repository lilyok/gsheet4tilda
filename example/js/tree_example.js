$().ready(function(){
    var email = 'lil.lilyok@gmail.com';
    // var email = 'lilyoknabieva@gmail.com';

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
});

$('#report').on('click', function() {
    if (window.children.length > 0) {
        var startDate = '2021-11-01';
        var stopDate = '2021-11-12';
        params = {
            filterBy: {"email": new Set(window.children)},
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req: "SELECT D, C, B where '" + startDate + "' <= A and A <= '" + stopDate + "'",
            range: 'A2:D',
            sheet: 'for_reports',
            isReport: true,
            labels: ["дата", "email", "сумма в руб."],
            title: "Отчет о покупках сети"
        }
        getData(params);
    } else {
        alert("Пока никто не присоединился к вашей сети, либо сеть еще не загружена");
    }
});

$('#personal_report').on('click', function() {
        var email = 'lilyoknabieva@gmail.com';

        // var email = 'lil.lilyok@gmail.com';
        var startDate = '2021-11-01';
        var stopDate = '2021-11-12';
        var personalParams = {
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req: "SELECT B, D where '" + startDate + "' <= A and A <= '" + stopDate + "' and C='" + email + "'",
            range: 'A2:D',
            sheet: 'for_reports',
            isReport: true,
            labels: ["дата", "сумма в руб."],
            title: "Отчет о личных покупках"
        };

        getData(personalParams);
});

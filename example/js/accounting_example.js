$().ready(function(){
    var email = 'lilyoknabieva@gmail.com';

    getData(
        {
            nodeID  : email, 
            isTree: true,
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req : "select B, C",  // ID, parentID, PrevSum, CurSum, AdditionalText
            range: 'A1:H',
            sheet: 'web'
        },
    );
});

$('#report').on('click', function() {
    var email = 'lilyoknabieva@gmail.com';
    if ("tree" in window && Object.keys(window.tree).length !== 0) {
        var startDate = '2021-09-01';
        var stopDate = '2021-11-22';
        params = {
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req: "SELECT B, E, sum(D) where '" + startDate + "' <= A and A <= '" + stopDate + "' group by B, E order by B, E ",
            range: 'A2:E',
            sheet: 'for_reports',
            isReport: true,
            isAdvanced: true,
            labels: ["email", "дата", "сумма в руб.", "сумма в руб. по сети", "Процент в %", "Доход"],
            criterions: [[0.06, 15000, 30000], [0.09, 30000, 60000], [0.12, 60000, 100000],
                [0.15, 100000, 170000], [0.18, 170000, 250000], [0.22, 250000, 1000000000]],
            title: "Расширенный отчет",
            nodeID  : email
        }
        getData(params);
    } else {
        alert("Пока никто не присоединился к вашей сети, либо сеть еще не загружена");
    }
});

// window["tree"]
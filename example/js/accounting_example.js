$().ready(function(){
    window.onstorage = function(e) {
  console.log('The ' + e.key +
    ' key has been changed from ' + e.oldValue +
    ' to ' + e.newValue + '.');
};

    window.addEventListener('storage', () => {
       alert(window.localStorage) ;
    });
    var email = 'yes@sansmots.com';

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
    var email = 'yes@sansmots.com';
    if ("tree" in window && Object.keys(window.tree).length !== 0) {
        var startDate = '2021-12-30';
        var stopDate = '2022-01-30';
        params = {
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req: "SELECT B, G, max(E), max(F), sum(D) where '" + startDate + "' <= A and A <= '" + stopDate + "' group by B, G order by B, G",
            range: 'A2:G',
            sheet: 'for_reports',
            isReport: true,
            isAdvanced: true,
            labels: ["email", "дата", "имя", "телефон", "сумма в руб.", "сумма в руб. по сети", "Процент в %", "Доход"],
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


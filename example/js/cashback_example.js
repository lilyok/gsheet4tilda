$().ready(function(){
    var email = 'lil.lilyok@gmail.com';
    getData(
        {
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req : "select I where B='" + email + "'",  // ID, parentID, PrevSum, CurSum, AdditionalText
            range: 'B1:I',
            sheet: 'cashback1',
            labels: ['cashback']
        },
    );
})

function useCashback() {
    let availableCashback = parseFloat($("#cashback_value").text());
    if (isNaN(availableCashback)) {
        return;
    }
    console.log(availableCashback + 1);
    // setData();
}


function useCashback1() {
    setData1();
}

function useCashback() {
    setData2();
}
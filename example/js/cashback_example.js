$().ready(function(){
    var email = 'lil.lilyok@gmail.com';
    getData(
        {
            url : "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
            req : "select A, I where B='" + email + "'",  // ID, parentID, PrevSum, CurSum, AdditionalText
            range: 'A1:I',
            sheet: 'cashback1',
            labels: ['rowId', 'cashback']
        },
    );
})

function useCashback() {
    var availableCashback = parseFloat($("#cashback_value").text());
    var rowId = parseInt($("#rowId_value").text());
    if (isNaN(rowId) || isNaN(availableCashback)) {
        return;
    }

    //TODO calculate max max(70% from purchase, availableCashback)
    let cashBack = availableCashback;
    availableCashback = availableCashback - cashBack;


    var params = {
        "url": "https://docs.google.com/spreadsheets/d/1EL6Kr649Rf1T-qtJYWkihLZ6gPZZMKYlF5y9_W9UKFI/edit?usp=sharing",
        "robot": "sansmots@sansmots.iam.gserviceaccount.com",
        "id": "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCiJUsQFD9REPI8\ns5r3lzGPjHp1XHaYPXYtmkZiuhP7VGT9VHkVAhCRY4MOE/4m3EB1wuLKV/QcIW34\nRVjHDuD0yO6J2Q/+Ly0ClW+WuPMZsk5mkro9+A+xw5WMK8wCFpGlwfaqmV9JH82V\nDrs8c6Kfek4ABdH8UJJJGq0BzqVvw2ksvCLwOlpSWHHmooGYdkzQhBpyEZCRV6bN\n7EsSIbTxJ4rf57AUoEXNzg9b3YV/ZG5FG9KtkqvBCQGII5PvXvdg3kjW4g6KNjlu\nOdJ5LS64RJM46Y4Q1g2fOK18dcBs9O9LKlsB1p3zwIqV0tiOI5OTB78XDC6bC/5H\nFtnp9QrZAgMBAAECggEAEG6KFFeQ8RSwD8G9zyCF17/LOzCDHjuASe/L+T5VPw+W\n6mtQl/XtGubERb118Jc6exSkahAOv3kNzW6tqAKUfooMTnDuY3qBa7UcKWCV1kFR\nG6j78cK9SG0DL0DS/FUwLmWhKzm+w8jSyyvCgsZPMS0yUWNFm/XIVVs8NCYucsxn\n9/0gPxnG3TM5Julz2Ga9gfgrH1sPDmkxf5dYzwAX7mcFM/vvP3lmQpgw8PZjAn3a\ne49hCYs1d/8jY0PMqWQXexQizgzGvZOYBK3NCUwugKCVtIC5urRslSgDoENCkHBA\nnb2Cl1jfdsBJlUN0mJN4R+luR2Hd/MbFr7UtbK0PlwKBgQDWP/raXxNbvrOY1ciE\nTN9p+TDqVN5UZnKr8xA9rWMJ7grJJ4S6RFirfgLQ1P6gST8NhY1rsZsLEjAvF2+J\nhHBTuzM7nLL7d6XicoxH4rAaTgLQFLMsjmpTMTf8eiCogQdAWA5jfdEDLruA2hQn\nOW+r+6TIPeHnrlj3ZhhMYn40YwKBgQDBvg2w3McYNdv+Mv+yQLddO/rRnmq+c9n6\niRxK0lpMU0UDcK/FwDhFm7Eg10OTye9MsEwtZnWETjqANQcSD8gUVBAVfPX6N2GU\nlm0CBG5m0D60UTx7PcPtth4cLJoYuTC7MCkULgc7E1qOwID3rNqSQZN8Vq7XD1xq\noqvn+1oSkwKBgEf6DItKP5Wl1m40+/0+WhwfBEjlJCAUnteXe9BMrKYMW4FCjnuJ\nNITAe6+urrAoi08+m8kfTKgGfzuC0wzO+nGWxVp0hUin5InT077esCzWImnHWn5Q\nhfXW5iki2k/hsQ7zxjm0bgB0tbdPDFA1IogTrUM8TuVnlCnhGa6ntCBjAoGAYhNr\nqtSYlNDvBMecWQgZysDKP8MKFk9fUUyHXfkObQTaMtugn2KnGdWu3Qkb1Hys/w1g\nAruTUd6oDq7JXYNPrbrASaBwhLH0W9uqYxMLMFDK7U0SaPDjdjpzE6AggdN9r8S5\nhtWmI2mwtgMNRlPicZdwqcjXyValWfXvQAglmLECgYEAtK8ygF9UcQSSYKPr+KUr\nx2PYecyjc9QU75T8O9XzqLeNpJGyN+KZaunhcOOBWo2KPVXAfLcTiqf7MhiOsyA0\nKmhJcmY2TMQmwP0dKgbksVrAEEJ3jQED7oRNsScfYuI9fa3Vlmd4GlJQr6z2DcZK\nJgQ+MhvgOSCBMYnghs4wIZQ=",
        "sheet": "count_cashback!",
        "range": `K${rowId}:K${rowId}`,
        "values": [[cashBack]],
        "htmlField2update": {"cashback_value": availableCashback},
    }
    setData(params);
}
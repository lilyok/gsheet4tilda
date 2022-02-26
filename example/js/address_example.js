function loadLastAddress() {
    setTimeout(function() {
        if ("lastAddress" in window) {
            if (window.lastAddress.length == 0) {
                console.log(window.lastAddress[0]['targetDeliveryType']);
                const targetAddress = window.lastAddress[0]['targetAddress']
            }


        } else {
            loadLastAddress()
        }
    }, 500);
}

$().ready(function(){
    var email = 'lilyoknabieva@gmail.com';
    params = {
        url : "https://docs.google.com/spreadsheets/d/1mXdDhfO5FiZVEePXiWn8hiBMhCHV_ccUBoDIscaXRBw/edit?usp=sharing",
        req: "SELECT A,B where C='" + email + "' order by D desc limit 1",
        range: 'A2:D',
        sheet: 'addresses',
        labels: ["targetDeliveryType", "targetAddress"],
        saveAs: "lastAddress",
    }
    getData(params);

    loadHistory();
});

function loadHistory(email) {
    setTimeout(function() {
        if ("orderHistory" in window) {
            $("#container").append("<div id='orders'></div>");

            for (var i = 0; i < window.orderHistory.length; i++) {
                $("#orders").append("<div id='order" + i +
                    "'>Заявка #" + window.orderHistory[i]["requestid"] +
                    ", заказ №" + window.orderHistory[i]["paymentid"] +
                    " <br>[" + window.orderHistory[i]["date"] + "]" +
                    " - " + window.orderHistory[i]["status"] +
                "</div>")


                const discount = window.orderHistory[i]["discount"] > 0 ?  parseFloat(window.orderHistory[i]["discount"]) : 0;
                const deliverySum = window.orderHistory[i]["deliverySum"] > 0 ?  parseFloat(window.orderHistory[i]["deliverySum"]) : 0;
                const cashback = window.orderHistory[i]["cashback"] > 0 ?  parseFloat(window.orderHistory[i]["cashback"]) : 0;

                var fullProductPrice =  parseFloat(window.orderHistory[i]["sum"]) + discount - deliverySum;
                if (window.orderHistory[i]["isCashback"] == "yes") {
                    fullProductPrice += cashback;
                }
                var priceStr = "Сумма товаров:" + fullProductPrice;
                if (deliverySum > 0) {
                    priceStr += "<br>" + "Сумма доставки: +" + deliverySum;
                }
                if (discount > 0) {
                    priceStr += "<br>" + "Скидка по купону: -" + discount;
                }
                if (window.orderHistory[i]["isCashback"] == "yes") {
                    priceStr += "<br>" + "Кешбэк: -" + cashback;
                }
                priceStr += "<br>" + "Итоговая сумма: " + window.orderHistory[i]["sum"];

                $("#order" + i).append(
                    "<div class='products'>" +
                    window.orderHistory[i]["products"].replaceAll("; ", "<br>") +
                    "<br><div class='prices'>" + priceStr + "</div>" + "</div>"
                )
                $("#orders").append("<br><br>");


            }
            // $("#container");
        } else {
            loadHistory(email)
        }
    }, 500);
}

$().ready(function(){
    var email = 'lilyoknabieva@gmail.com';
    params = {
        url : "https://docs.google.com/spreadsheets/d/1rApuVH1bTdZPak1l5mmvI3-cYzcVj_vnF-hrh0YDp_k/edit?usp=sharing",
        req: "SELECT B,C,D,E,F,G,H,I,J,K where A='" + email + "' order by B desc limit 3",
        range: 'A2:K',
        sheet: 'history',
        labels: ["requestid", "paymentid", "date", "products", "status", "sum", "deliverySum", "discount", "cashback", "isCashback"],
        saveAs: "orderHistory",
    }
    getData(params);

    loadHistory(email);
});

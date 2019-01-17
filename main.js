var json = { title: [], body: [] };
var searchData;

function search() {
    $("#text").text("");
    $("#favtext").text("");
    $("#favtitle").text("");

    let keyword = $("#search").val();
    searchData = [];

    $.get("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000", function (data, status) {

        let count = 0;
        data.forEach((obj) => {
            if (obj.keywords.includes(keyword)) {
                let title = $('<textarea />').html(obj.title).text();
                let body = $('<textarea />').html(obj.body).text();
                let bodyStr = encodeURI(obj.body).replace(/&#x27/g, "&#x5c;&#x27");
                let titleWithoutSpace = title.split(/[^A-Za-z]/).join("");

                $("#text").append('<div class="row"><div class="col s5">' +
                    '<a href="#"><i id="star' + titleWithoutSpace + '" onclick="toggleFavourite(\'' + title + '\', \'' + bodyStr + '\')" class="col s1 material-icons grey-text">star</i></a>' +
                    '<span class="col s10" style="font-size:20px">' + title + '</span></div>' +
                    '<div class="col s7"><span style="font-size:15px">' + body + '</span></div></div>'
                );

                searchData.push(title);

                if (json.title.indexOf(title) != -1) {
                    $("#star" + titleWithoutSpace).addClass("green-text");
                    $("#star" + titleWithoutSpace).removeClass("grey-text");

                    $("#favtext").append('<div class="row"><div class="col s5">' +
                        '<a href="#"><i id="star' + titleWithoutSpace + '" onclick="toggleFavourite(\'' + title + '\', \'' + bodyStr + '\')" class="col s1 material-icons green-text">star</i></a>' +
                        '<span class="col s10" style="font-size:20px">' + title + '</span></div>' +
                        '<div class="col s7"><span style="font-size:15px">' + body + '</span></div></div>'
                    );

                    count = 1;
                }

                $("ul").addClass("browser-default");
                $("ul").attr("type", "disc");
            }
        });

        if (count == 1) {
            $("#favtitle").append('<h4 class="green-text"><b>Favourites</b></h4>');
        }
    });
}

function toggleFavourite(title, objBody) {
    let titleWithoutSpace = title.split(/[^A-Za-z]/).join("");

    if (json.title.indexOf(title) != -1) {
        let index = json.title.indexOf(title);
        json.title.splice(index, 1);
        json.body.splice(index, 1);
        $("#star" + titleWithoutSpace).addClass("grey-text");
        $("#star" + titleWithoutSpace).removeClass("green-text");
    }
    else {
        json.title.push(title);
        json.body.push(objBody);
        $("#star" + titleWithoutSpace).addClass("green-text");
        $("#star" + titleWithoutSpace).removeClass("grey-text");
    }

    $("#favtext").text("");
    $("#favtitle").text("");

    let count = 0;

    json.title.forEach((t, i) => {
        if (searchData.indexOf(t) != -1) {
            let body = decodeURI($('<textarea />').html(json.body[i]).text());
            let tWithoutSpace = t.split(/[^A-Za-z]/).join("");

            $("#favtext").append('<div class="row"><div class="col s5">' +
                '<a href="#"><i id="star' + tWithoutSpace + '" onclick="toggleFavourite(\'' + t + '\', \'' + encodeURI(json.body[i]).replace(/'/g, "\\'") + '\')" class="col s1 material-icons green-text">star</i></a>' +
                '<span class="col s10" style="font-size:20px">' + t + '</span></div>' +
                '<div class="col s7"><span style="font-size:15px">' + body + '</span></div></div>'
            );
            count = 1;
        }
    })

    if (count == 1) {
        $("#favtitle").append('<h4 class="green-text"><b>Favourites</b></h4>');
    }

    $("ul").addClass("browser-default");
    $("ul").attr("type", "disc");
}
/**
 *  @author Jan-Patrick Bollow 349891
 */

// Interaction function
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('class', 'buttonnav');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function (e) {
    control.show();
    var container = L.DomUtil.create('div'),
        startBtn = createButton('Start from this location', container),
        destBtn = createButton('Go to this location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

    L.DomEvent.on(startBtn, 'click', function () {
        control.spliceWaypoints(0, 1, e.latlng);
        map.closePopup();
    });

    L.DomEvent.on(destBtn, 'click', function () {
        control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
        map.closePopup();
    });
});

// Post the route to DB as route
document.getElementById('post2db').onclick = function (e) {

    // JSNLog
    logger.info(control.getWaypoints());

    var JSONtoPOST = {
        "costing": $('#transport').val(),
        "language": $('#language').val(),
        "routeName": $("#jsonname").val(),
        "navigationPoints": control.getWaypoints(),
    };
    
    // JSNLog
    logger.info(JSONtoPOST);

    // Post to local mongodb via nodejs using our own POST
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/postroute",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(JSONtoPOST),
        traditional: true,
        cache: false,
        processData: false,
        success: function () {
            alert($("#jsonname").val() + " added to DB");
            // JSNLog
            logger.info("Post successful!");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed!");
            // JSNLog
            logger.error("Posting failed!");
        }
    });
};
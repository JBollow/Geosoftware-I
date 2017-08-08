/**
 *  @author Jan-Patrick Bollow 349891
 */

'use strict';

// Interaction function
function createButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('class', 'buttonnav');
    btn.innerHTML = label;
    return btn;
}

map.on('click', function (e) {
    // Doesn't allow popup if start and end are set, makes it easier to add navpoints to the line, start and end are draggable anyways
    if (control.getWaypoints()[1].latLng == null) {
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
    }
});

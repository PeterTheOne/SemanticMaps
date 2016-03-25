/**
 * JavaScript for Google Maps v3 maps in the Maps extension.
 * @see https://www.mediawiki.org/wiki/Extension:Maps
 *
 * @licence GNU GPL v2+
 * @author Peter Grassberger <petertheone@gmail.com>
 */

function ajaxUpdateMarker(googlemaps) {
    var bounds = googlemaps.map.getBounds();

    var query = '[[Category:Locations]]' + ' ';
    query += '[[Has coordinates::+]] ';
    query += '[[Has coordinates::>' + bounds.getSouthWest().lat() + '°, ' + bounds.getSouthWest().lng() + '°]] ';
    query += '[[Has coordinates::<' + bounds.getNorthEast().lat() + '°, ' + bounds.getNorthEast().lng() + '°]]';
    query += '|?Has coordinates';

    $.ajax({
        method: 'GET',
        url: '/w/api.php?',
        data: {
            'action': 'ask',
            'query': query,
            'format': 'json'
        },
        dataType: 'json'
    }).done(function(data) {
        googlemaps.removeMarkers();
        for (var property in data.query.results) {
            if (data.query.results.hasOwnProperty(property)) {
                var location = data.query.results[property];
                var coordinates = location.printouts['Has coordinates'][0];
                googlemaps.addMarker(coordinates);
            }
        }
    });
}

(function( $, mw ) {
    $( document ).ready( function() {
        if ( typeof google !== 'undefined' ) {
            $( '.maps-googlemaps3' ).each( function() {
                var $this = $( this );

                // todo: remove timeout
                setTimeout(function() {
                    ajaxUpdateMarker($this.googlemaps);
                }, 100);

                google.maps.event.addListener($this.googlemaps.map, 'dragend', function () {
                    ajaxUpdateMarker($this.googlemaps);
                });
                google.maps.event.addListener($this.googlemaps.map, 'zoom_changed', function () {
                    ajaxUpdateMarker($this.googlemaps);
                });

            });
        }
    } );
})( window.jQuery, mediaWiki );

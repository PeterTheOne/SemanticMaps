/**
 * JavaScript for Google Maps v3 maps in the Semantic Maps extension.
 * @see https://www.mediawiki.org/wiki/Extension:Semantic_Maps
 *
 * @licence GNU GPL v2+
 * @author Peter Grassberger < petertheone@gmail.com >
 */
(function( $, sm ) {
    'use strict';


    var ajaxRequest = null;
    var mapEvents = ['dragend', 'zoom_changed'];

    $( document ).ready( function() {
        // todo: find a way to remove setTimeout.
        setTimeout(function() {
            if ( typeof google === 'undefined' ) {
                return;
            }
            $( window.maps.googlemapsList ).each( function( index, map ) {
                if (!map.options.ajaxquery && !map.options.ajaxcoordproperty) {
                    return;
                }
                $( mapEvents ).each( function( index, event ) {
                    google.maps.event.addListener( map.map, event, function () {
                        var bounds = map.map.getBounds();
                        var query = sm.buildQueryString(
                            map.options.ajaxquery.join( ' ' ) + ' ',
                            map.options.ajaxcoordproperty,
                            bounds.getNorthEast().lat(),
                            bounds.getNorthEast().lng(),
                            bounds.getSouthWest().lat(),
                            bounds.getSouthWest().lng()
                        );

                        if ( ajaxRequest !== null ) {
                            ajaxRequest.abort();
                        }
                        sm.ajaxUpdateMarker( map, query).done( function () {
                            ajaxRequest = null;
                        } );
                    } );
                } );
            } );
        }, 500 );
    } );
})( window.jQuery, window.sm );

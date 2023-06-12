<?php
/*
Plugin Name: Extend Preview Link Lifespan
Plugin URI: digital.gov.bc.ca
Description: This plugin extends the lifespan of a preview link to 60 days.
Version: 1.0
Author: Kaegan Mandryk
*/

function extend_preview_link_expiration( $expiration ) {
    return 60 * 60 * 24 * 60; // 60 days
}

add_filter( 'ppp_nonce_life', 'extend_preview_link_expiration' );

?>

<?php
/**
 * The container HTML for live search.
 *
 * @package Bcgov\DigitalGov
 */
?>
<div class="live-search-container"></div>

<div class="live-search-extra">
	<?php
	// Load this content from a page created to hold the live search content.

	$post_to_load = get_page_by_path( 'live-search-content' );
	if ( $post_to_load ) {
		$content = get_the_content( null, false, $post_to_load->ID );

		echo wp_kses_post( $content );
	}
	?>
</div>

<?php

/**
 * Search results are contained within a div.searchwp-live-search-results
 * which you can style accordingly as you would any other element on your site
 *
 * Some base styles are output in wp_footer that do nothing but position the
 * results container and apply a default transition, you can disable that by
 * adding the following to your theme's functions.php:
 *
 * add_filter( 'searchwp_live_search_base_styles', '__return_false' );
 *
 * There is a separate stylesheet that is also enqueued that applies the default
 * results theme (the visual styles) but you can disable that too by adding
 * the following to your theme's functions.php:
 *
 * wp_dequeue_style( 'searchwp-live-search' );
 *
 * You can use ~/searchwp-live-search/assets/styles/style.css as a guide to customize
 */

// exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// IMPORTANT. This template is only for Live Search results.


//error_reporting( E_ALL );
//ini_set( 'display_errors', '1' );

$highlighter = new \SearchWP\Highlighter();

$search_query = isset( $_REQUEST['s'] ) ? sanitize_text_field( $_REQUEST['s'] ) : null;

$search_results = [];
if ( ! empty( $search_query ) && class_exists( '\\SearchWP\\Query' ) ) {
	$searchwp_query = new \SearchWP\Query(
        $search_query,
        [
			'engine'   => 'default',  // The Engine name.
			'fields'   => 'all',      // Load proper native objects of each result.
			'per_page' => 4,        // How many results to show in live search
		]
    );

	$search_results = $searchwp_query->get_results();
}


// From SearchFormsVIew.php in SearchWP. Modified.
if ( class_exists( '\SearchWP_Metrics\QueryPopularQueriesOverTime' ) ) {
	$query = new \SearchWP_Metrics\QueryPopularQueriesOverTime(
		[
			'engine' => 'default',
			'after'  => '30 days ago',
		]
	);

	$popular_searches = $query->get_results();

} else {
	$popular_searches = \SearchWP\Statistics::get_popular_searches(
		[
			'days'    => 30,
			'engine'  => 'default',
			'exclude' => [], // Settings::get( 'ignored_queries', 'array' ),
		]
	);
}

$popular_searches = wp_list_pluck( $popular_searches, 'query' );


?>
<style>
	.live-search-container { color: black;}
	.searchwp-form-quick-search a { display: inline-block; }
</style><?php // NATE please adjust this/move it to the proper place. Needed so the results show otherwise its white text. ?>


<?php if ( ! empty( $search_query ) && ! empty( $search_results ) ) { ?>
	<?php if ( $popular_searches ) { ?>
		<div class="searchwp-form-quick-search">
			<span><?php esc_html_e( 'Popular searches', 'searchwp' ); ?>: </span>
			<?php foreach ( $popular_searches as $item ) : ?>
				<?php
				$quick_search_link = add_query_arg(
					[
						's' => esc_attr( $item ),
					],
					home_url( '/' )
				);
				?>
				<a href="<?php echo esc_url( $quick_search_link ); ?>" class=""><?php echo esc_html( $item ); ?></a>
			<?php endforeach; ?>
		</div>
	<?php } ?>


	<?php echo '' . $searchwp_query->found_results . ' results found in ' . $searchwp_query->query_time . ' seconds.'; ?>

	<?php foreach ( $search_results as $search_result ) { ?>
		<?php
		$post_is_restricted = custom_redirect_to_login_check_if_url_in_list( get_permalink( $search_result->ID ) ) || post_password_required( $search_result->ID );

		$result_content = get_the_excerpt( $search_result );
		if ( $post_is_restricted ) {
			if ( is_user_logged_in() ) {
			} else {
				$result_content = __( 'There is no excerpt because this is a protected post. ' );
			}
		} else {
		}


		switch ( get_class( $search_result ) ) {
			case 'WP_Post':
				?>
				<div class="searchwp-live-search-result" role="option" id="" aria-selected="false">
					<a href="<?php echo esc_url( get_permalink( $search_result->ID ) ); ?>" title="<?php if ( $post_is_restricted ) {echo 'private';} ?>">
						<?php
						// highlight the title
						$title = get_the_title( $search_result->ID );
						if ( $highlighter ) {
							// $title = $highlighter->apply_highlight( $title, $query );
							$title = $highlighter->apply( $title, $search_query );
						}
						echo $title;
						?>
						<p class="live-search-excerpt"><?php echo '' . $result_content . ''; ?></p>
					</a>
					
				</div>
				<?php
			    break;

			case 'WP_User':
				?>
				<div class="searchwp-live-search-result" role="option" id="" aria-selected="false">
					<p><a href="<?php echo get_author_posts_url( $search_result->data->ID ); ?>">
						<?php echo esc_html( $search_result->data->display_name ); ?> &raquo;
					</a></p>
				</div>
				<?php
			    break;
		}
	}

	$result_count = count( $search_results );
	if ( $result_count ) {
		// Output the "See all results" link if there are more than 4 suggestions.
		$search_query = isset( $_POST['s'] ) ? sanitize_text_field( $_POST['s'] ) : '';
		?>
		<p class="results-info">
			<?php printf( __( 'Showing %1$d suggestions for <strong>%2$s</strong>, submit your search to see all results.', 'searchwp-live-ajax-search' ), $result_count, $search_query ); ?>
		</p>
	<?php } ?>

<?php } else { ?>
	<p class="searchwp-live-search-no-results" role="option">
		<?php esc_html_e( 'No suggestions found, use the search button to do a full search.', 'searchwp-live-ajax-search' ); ?>
	</p>
<?php } ?>
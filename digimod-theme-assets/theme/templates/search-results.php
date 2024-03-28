<?php
/**
 * Live Search search regults template.
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 *
 *
 * ***** IMPORTANT!!! This template is only for Live Search results.
 */


// exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable
// error_reporting( E_ALL );
// ini_set( 'display_errors', '1' );
// phpcs:enable

$highlighter = new \SearchWP\Highlighter();

$search_query = isset( $_REQUEST['s'] ) ? sanitize_text_field( $_REQUEST['s'] ) : null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

$search_results = [];
if ( ! empty( $search_query ) && class_exists( '\\SearchWP\\Query' ) ) {
	$searchwp_query = new \SearchWP\Query(
        $search_query,
        [
			'engine'   => 'default',  // The Engine name.
			'fields'   => 'all',      // Load proper native objects of each result.
			'per_page' => 4,          // How many results to show in live search.
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
			'exclude' => [],
		]
	);
}

$popular_searches = wp_list_pluck( $popular_searches, 'query' );

// in ' . wp_kses( round( $searchwp_query->query_time, 3 ), 0 ) . ' seconds.
?>


<?php if ( ! empty( $search_query ) && ! empty( $search_results ) ) { ?>

	<div id="results-found">Showing <?php echo count( $search_results ); ?> of <?php echo wp_kses( $searchwp_query->found_results, 0 ); ?> results.</div>

	<?php
	// Initiate Metrics link tracking.
	do_action( 'searchwp_metrics_click_tracking_start' );

	foreach ( $search_results as $search_result ) {
		?>
		<?php

		$post_is_restricted_idir = custom_redirect_to_login_check_if_url_in_list( get_permalink( $search_result->ID ) );
		$post_is_restricted      = $post_is_restricted_idir || post_password_required( $search_result->ID );

		$result_content = get_the_excerpt( $search_result );
		if ( $post_is_restricted ) {
			if ( ! is_user_logged_in() ) {
				if ( $post_is_restricted_idir ) {
					$result_content = __( 'This content requires an IDIR login to view.' );

				} else {
					$result_content = __( 'There is no excerpt because this is a protected post. ' );
				}
			}
		}


		switch ( get_class( $search_result ) ) {
			case 'WP_Post':
				?>
				<div class="searchwp-live-search-result" role="option" id="" aria-selected="false">
					<a href="<?php echo esc_url( get_permalink( $search_result->ID ) ); ?>" title="<?php if ( $post_is_restricted ) {echo 'private';} ?>">
						<p class="live-search-title">
                        <?php
						$post_title = Bcgov\DigitalGov\Search::get_final_title( $search_result, true, $search_query );
						echo wp_kses( $post_title, [ 'mark' => [] ] );
						?>
						
						<p class="live-search-excerpt">							
							<?php echo wp_kses_post( $result_content ); ?>
						</p>
					</a>
					
				</div>
				<?php
			    break;

			case 'WP_User':
				?>
				<div class="searchwp-live-search-result" role="option" id="" aria-selected="false">
					<p><a href="<?php echo wp_kses( get_author_posts_url( $search_result->data->ID ), 0 ); ?>">
						<?php echo esc_html( $search_result->data->display_name ); ?> &raquo;
					</a></p>
				</div>
				<?php
			    break;
		}
	}
	// Stop Metrics link tracking.
	do_action( 'searchwp_metrics_click_tracking_stop' );


	$result_count = count( $search_results );
	if ( $result_count ) {
		// Output the "Show all results" link if there are more than 4 suggestions.
		?>
		<p class="results-info">
			<?php
			echo '<a href="/?s=' . wp_kses( $search_query, [] ) . '">' . wp_kses(
				sprintf(
					/* translators: %1$d: results count, %2$s: search keywords */
                    __( 'Show all %1$d results.' ),
					$searchwp_query->found_results
				),
				[
					'strong' => [],
					'br'     => [],
				]
			) . '</a>';
			?>
		</p>
	<?php } ?>

	
	<?php } else { ?>
		<div class="searchwp-live-search-no-results" role="option">
			<p>Sorry, we couldn't find any results for '<strong style="padding-inline: 0.05rem;"><?php echo wp_kses_post( $search_query ); ?></strong>'</p>
		</div>


		<?php
		//phpcs:disable
        /*
		if ( $popular_searches ) { ?>
			<div class="searchwp-form-quick-search">
				<h2 class="popular-searches-header"><?php esc_html_e( 'Popular searches', 'searchwp' ); ?>: </h2>
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
		<?php } 
		*/
		//phpcs:enable
		?>
<?php } ?>
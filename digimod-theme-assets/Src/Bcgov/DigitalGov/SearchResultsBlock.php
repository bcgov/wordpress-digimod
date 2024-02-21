<?php
/**
 * Search Results Block for DigitalGov.
 *
 * @package Bcgov\DigitalGov
 * @since 1.3.0
 */

namespace Bcgov\DigitalGov;

/**
 * SearchResultsBlock class.
 */
class SearchResultsBlock {


	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Sets up hooks.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'excerpt_length', [ $this, 'excerpt_length' ], 9223372036854775807 );  // Some other plugin is setting the excerpt length to 100 and using this big int as priority, lets replace it.
	}

	/**
	 * Filter the excerpt length if its the live search.
	 *
	 * @param int $length Excerpt length.
	 * @return int (Maybe) modified excerpt length.
	 */
	public function excerpt_length( $length ) {
		if ( doing_action( 'wp_ajax_searchwp_live_search' ) || doing_action( 'wp_ajax_nopriv_searchwp_live_search' ) ) {
			return 10;
		}
		return $length;
	}


	/**
	 * Perform the actual search and return the results
	 */
	public function render_search_results() {
		$is_gb_editor = Blocks::check_is_gb_editor();

		$output = '';

		if ( $is_gb_editor ) {
			$_GET['s'] = 'digital'; // Provide a search keyword for the blockeditor so you can see it visually.
		}

		if ( ! isset( $_GET['s'] ) ) {  // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $template;
		}

		$engine = 'default';

		$settings = [   // From SearchWP\Results\Settings.
			'swp-layout-theme'        => 'alpha',
			'swp-layout-style'        => 'list',
			'swp-results-per-row'     => 3,
			'swp-image-size'          => '',
			'swp-title-color'         => '',
			'swp-title-font-size'     => '',
			'swp-price-color'         => '',
			'swp-price-font-size'     => '',
			'swp-description-enabled' => true,
			'swp-button-enabled'      => false,
			'swp-button-label'        => '',
			'swp-button-bg-color'     => '',
			'swp-button-font-color'   => '',
			'swp-button-font-size'    => '',
			'swp-results-per-page'    => 10,
			'swp-pagination-style'    => '',
		];

		// Retrieve applicable query parameters.
		$search_query = isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : null; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$search_page  = isset( $_GET['swppg'] ) ? absint( $_GET['swppg'] ) : 1;         // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// Perform the search.
		$search_results    = [];
		$search_pagination = '';
		$per_page          = absint( $settings['swp-results-per-page'] );

		if ( class_exists( '\\SearchWP\\Query' ) ) {
			$search_args = [
				'engine' => $engine, // The Engine name.
				'fields' => 'all',          // Load proper native objects of each result.
				'page'   => $search_page,
			];

			if ( ! empty( $per_page ) ) {
				$search_args['per_page'] = $per_page;
			}
			$searchwp_query = new \SearchWP\Query( $search_query, $search_args );

			$search_results = $searchwp_query->get_results();

			$search_pagination = paginate_links(
				array(
					'format'    => '?swppg=%#%',
					'current'   => $search_page,
					'total'     => $searchwp_query->max_num_pages,
					'prev_text' => '&larr;',
					'next_text' => '&rarr;',
				)
			);
		}

		ob_start();
		?>
		<div class="<?php echo esc_attr( $this->get_container_classes( $settings ) ); ?>">
			<?php if ( ! empty( $search_results ) ) : ?>
				<?php foreach ( $search_results as $search_result ) : ?>
					<?php
					$post_is_restricted_idir = custom_redirect_to_login_check_if_url_in_list( get_permalink( $search_result->ID ) );
					$post_is_restricted      = $post_is_restricted_idir || post_password_required( $search_result->ID );

					$display_data = $this->get_display_data( $search_result, $search_query );
					?>
					<a class="swp-result-item-link" href="<?php echo esc_url( $display_data['permalink'] ); ?>" title="<?php if ( $post_is_restricted ) { echo 'private'; } ?>">
						<article id="post-<?php echo esc_attr( $search_result->ID ); ?>" class="swp-result-item post-<?php echo esc_attr( $search_result->ID ); ?> post type-post status-publish format-standard hentry category-uncategorized entry">
							<?php if ( ! empty( $display_data['image_html'] ) && ! empty( $settings['swp-image-size'] ) && 'none' !== $settings['swp-image-size'] ) : ?>
								<div class="swp-result-item--img-container">
									<div class="swp-result-item--img">
										<?php echo wp_kses_post( $display_data['image_html'] ); ?>
									</div>
								</div>
							<?php endif; ?>

							<div class="swp-result-item--info-container">
								<h2 class="entry-title">
									<?php echo wp_kses_post( $display_data['title'] ); ?>
								</h2>
								<?php if ( ! empty( $settings['swp-description-enabled'] ) ) : ?>
									<p class="swp-result-item--desc">
										<?php if ( $post_is_restricted ) { ?>
											There is no excerpt because this is a protected post.
										<?php } else { ?>
											<?php echo wp_kses_post( $display_data['content'] ); ?>
										<?php } ?>
									</p>
								<?php endif; ?>

								<?php if ( ! empty( $settings['swp-button-enabled'] ) ) : ?>
									<a href="<?php echo esc_url( $display_data['permalink'] ); ?>" class="swp-result-item--button">
										<?php echo ! empty( $settings['swp-button-label'] ) ? esc_html( $settings['swp-button-label'] ) : esc_html__( 'Read More', 'searchwp' ); ?>
									</a>
								<?php endif; ?>
							</div>
						</article>
					</a>
				<?php endforeach; ?>
		</div><!-- End of .swp-search-results -->

				<?php if ( $searchwp_query->max_num_pages > 1 ) : ?>
			<div class="navigation pagination" role="navigation">
				<h2 class="screen-reader-text"><?php esc_html_e( 'Results navigation', 'searchwp' ); ?></h2>
				<div class="<?php echo esc_attr( $this->get_pagination_classes( $settings ) ); ?>"><?php echo wp_kses_post( $search_pagination ); ?></div>
			</div>
		<?php endif; ?>
	<?php else : ?>
		<p><?php esc_html_e( 'No results found, please refine your search and try again.', 'searchwp' ); ?></p>
	<?php endif; ?>


		<?php

		$output .= ob_get_clean();

		return $output;
	}




	/**
	 * Helper function to get the various pieces needed to render the search results items
	 *
	 * @param object $result The search results individual result item.
	 * @param string $search_query The search query used.
	 */
	private function get_display_data( $result, $search_query ) {

		if ( $result instanceof \WP_Post ) {
			$post_title = Search::get_final_title( $result, true, $search_query );

			$data = [
				'id'         => absint( $result->ID ),
				'type'       => get_post_type( $result ),
				'title'      => $post_title,
				'permalink'  => get_the_permalink( $result ),
				'image_html' => get_the_post_thumbnail( $result ),
				'content'    => get_the_excerpt( $result ),
			];

		}

		if ( $result instanceof \WP_User ) {
			$data = [
				'id'         => absint( $result->ID ),
				'type'       => 'user',
				'title'      => $result->data->display_name,
				'permalink'  => get_author_posts_url( $result->data->ID ),
				'image_html' => get_avatar( $result->data->ID ),
				'content'    => get_the_author_meta( 'description', $result->data->ID ),
			];
		}

		if ( $result instanceof \WP_Term ) {
			$data = [
				'id'         => absint( $result->term_id ),
				'type'       => 'taxonomy-term',
				'title'      => $result->name,
				'permalink'  => get_term_link( $result->term_id, $result->taxonomy ),
				'image_html' => '',
				'content'    => $result->description,
			];
		}

		$defaults = [
			'id'         => 0,
			'type'       => 'unknown',
			'title'      => '',
			'permalink'  => '',
			'image_html' => '',
			'content'    => '',
		];

		$data = apply_filters( 'searchwp\results\entry\data', $data, $result );

		// Make sure that default array structure is preserved.
		return is_array( $data ) ? array_merge( $defaults, $data ) : $defaults;
	}

	/**
	 * Get search results page container classes.
	 *
	 * @param array $settings Search Results Page settings.
	 * @return string
	 */
	private function get_container_classes( $settings ) {

		$classes = [
			'swp-search-results',
		];

		if ( 'grid' === $settings['swp-layout-style'] ) {
			$classes[] = 'swp-grid';
			$per_row   = absint( $settings['swp-results-per-row'] );
			if ( ! empty( $per_row ) ) {
				$classes[] = 'swp-grid--cols-' . $per_row;
			}
		}

		if ( 'list' === $settings['swp-layout-style'] ) {
			$classes[] = 'swp-flex';
		}

		$image_size = $settings['swp-image-size'];
		if ( empty( $image_size ) || 'none' === $image_size ) {
			$classes[] = 'swp-rp--img-none';
		}
		if ( 'small' === $image_size ) {
			$classes[] = 'swp-rp--img-sm';
		}
		if ( 'medium' === $image_size ) {
			$classes[] = 'swp-rp--img-m';
		}
		if ( 'large' === $image_size ) {
			$classes[] = 'swp-rp--img-l';
		}

		return implode( ' ', $classes );
	}

	/**
	 * Get search results page pagination classes.
	 *
	 * @param array $settings Search Results Page settings.
	 * @return string
	 */
	private function get_pagination_classes( $settings ) {
		$classes = [
			'nav-links',
		];

		if ( 'circular' === $settings['swp-pagination-style'] ) {
			$classes[] = 'swp-results-pagination';
			$classes[] = 'swp-results-pagination--circular';
		}

		if ( 'boxed' === $settings['swp-pagination-style'] ) {
			$classes[] = 'swp-results-pagination';
			$classes[] = 'swp-results-pagination--boxed';
		}

		return implode( ' ', $classes );
	}
}

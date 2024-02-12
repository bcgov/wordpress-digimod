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
if (!defined('ABSPATH')) {
	exit;
}

// IMPORTANT. This template is only for Live Search results.

?>

<?php
$result_count = 0; // Initialize result count
if (have_posts()) :
?>
	<?php while (have_posts() && $result_count < 4) : the_post(); ?>
		<div class="searchwp-live-search-result" role="option" id="" aria-selected="false">
			<?php
			$post_type = get_post_type_object(get_post_type());
			$post_is_restricted = custom_redirect_to_login_check_if_url_in_list(get_permalink(get_the_id()));
			?>
			<a href="<?php echo esc_url(get_permalink()); ?>" title="<?php if ($post_is_restricted) {
																			echo 'private';
																		} ?>">
				<p>
					<?php the_title(); ?>

					<?php
					$post_excerpt = $post->post_excerpt ?
						$excerpt :
						wp_trim_excerpt('', $post);

					$result_content = '';

					if ($post_is_restricted) {
						if (is_user_logged_in()) {
							$result_content .= $post_excerpt;
						} else {
							$result_content .=  __('There is no excerpt because this is a protected post. ');
						}
					} else {
						$result_content .= $post_excerpt;
					}

					// Ensure $result_content is trimmed to 80 characters, at the end of a sentence or word boundary
					if (mb_strlen($result_content) > 80) {
						$result_content = trim(mb_strimwidth($result_content, 0, 80, ''));
						$last_period_position = mb_strrpos($result_content, '.');
						if ($last_period_position !== false && $last_period_position > 0) {
							$result_content = mb_substr($result_content, 0, $last_period_position + 1);
						} else {
							// If no period is found, truncate at the nearest word boundary
							$result_content = preg_replace('/\W+$/u', '', mb_substr($result_content, 0, 80)) . '...';
						}
					}

					echo '<p class="live-search-excerpt">' . $result_content . '</p>';
					?>

				</p>
			</a>
			<?php $result_count++; ?>
		</div>
		<?php endwhile; ?>

		<?php if ($result_count > 0) :
			// Output the "See all results" link if there are more than 4 suggestions.
			$search_query = isset($_POST['s']) ? sanitize_text_field($_POST['s']) : '';
		?>
			<p class="results-info">
				<?php echo sprintf(__("Showing %d suggestions for <strong>%s</strong>, submit your search to see all results.", 'searchwp-live-ajax-search'), $result_count, $search_query); ?>
			</p>
		<?php endif; ?>
		

	<?php else : ?>
		<p class="searchwp-live-search-no-results" role="option">
			<?php esc_html_e('No suggestions found, use the search button to do a full search.', 'searchwp-live-ajax-search'); ?>
		</p>
	<?php endif; ?>
<?php
/**
 * Server-side rendering of the block.
 *
 * @package WordPress
 */

/**
 * Renders the block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the custom field
 */
function render_block_template_custom_field( $attributes, $content, $block ) {
	// echo('php running');

	// if ( ! isset( $block->context['postId'] ) ) {
	// 	echo('no id');
	// 	return '';
	// }

	// $post_ID = $block->context['postId'];
    // $test = get_post_meta( 52, 'test', true );
    // if( empty( $test ) ) {
	// 	return $content;
	// }
	// echo ('attrs: ');
	// echo(implode(array_keys($attributes)));
	// print_r('attrs:');
	// print_r($attributes);

    $test = get_field($attributes["content"]);

    return sprintf(
		'%1$s',
		$test
	);

	// $title   = get_the_title();

	// if ( ! $title ) {
	// 	return '';
	// }

	// $tag_name         = 'h2';
	// $align_class_name = empty( $attributes['textAlign'] ) ? '' : "has-text-align-{$attributes['textAlign']}";

	// if ( isset( $attributes['level'] ) ) {
	// 	$tag_name = 0 === $attributes['level'] ? 'p' : 'h' . $attributes['level'];
	// }

	// if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
	// 	$title = sprintf( '<a href="%1$s" target="%2$s" rel="%3$s">%4$s</a>', get_the_permalink( $post_ID ), esc_attr( $attributes['linkTarget'] ), esc_attr( $attributes['rel'] ), $title );
	// }
	// $wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $align_class_name ) );

	// return sprintf(
	// 	'<%1$s %2$s>%3$s</%1$s>',
	// 	$tag_name,
	// 	$wrapper_attributes,
	// 	$title
	// );
}

/**
 * Registers the `core/post-title` block on the server.
 */
function register_template_custom_field() {
    // echo('registering..');
	// register_block_type_from_metadata(
	// 	__DIR__ . '/template-custom-field',
	// 	array(
	// 		'render_callback' => 'render_block_custom_field',
	// 	)
	// );
    // automatically load dependencies and version
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    // wp_register_script(
    //     'template-custom-field',
    //     plugins_url( 'build/index.js', __FILE__ ),
    //     $asset_file['dependencies'],
    //     $asset_file['version']
    // );
	
    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        // 'editor_script' => 'template-custom-field',
        'render_callback' => 'render_block_template_custom_field'
    ) );

}
add_action( 'init', 'register_template_custom_field' );

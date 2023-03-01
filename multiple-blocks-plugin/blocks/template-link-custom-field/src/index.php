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
function render_block_template_link_custom_field( $attributes, $content, $block ) {
    $url = get_field($attributes["url"]);
    $text = "";
    if (array_key_exists("content", $attributes) && get_field($attributes["content"])!=''){ // use custom field as source for link if provided
        $text = get_field($attributes["content"]);
    }else{
        $text = $attributes["linkText"];
    }
    if (get_field("link_type") != null){
        $linkType = get_field("link_type");
     }
     else if (array_key_exists("linkType", $attributes)){
        $linkType = $attributes["linkType"];
    } else {
        $linkType = 'internal';
    }
    
    if($linkType == 'external'){
        return sprintf(
            '<a href="%1$s">%2$s 
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;     height: 1em;">
                    <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
                    </path>
                </svg>
            </a>',
            $url, $text);
    } else {
    return sprintf(
		'<a href="%1$s">%2$s</a>',
		$url, $text
	);
    }
}

function register_block_template_link_custom_field() {
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_link_custom_field'
    ) );

}
add_action( 'init', 'register_block_template_link_custom_field' );
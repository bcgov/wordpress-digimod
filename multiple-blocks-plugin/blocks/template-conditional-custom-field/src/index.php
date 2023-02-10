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
function render_block_template_conditional_custom_field( $attributes, $content, $block ) {

    $test = '';
    $els_or = explode("OR",str_replace(' ', '', $attributes["content"]));
    
    if (count($els_or)==0){ // if it's a single string, just get custom field
        $test = get_field($attributes["content"]);
    }else{
        // it's an "OR" expression - parse out
        $one_set = false;
        foreach ($els_or as $value) {
            // print_r(' checking: '. $value);
            $v = get_field($value);
            // print_r(' value: '. $v);
            if ($v){
                // print_r(' defined');
                return $content;
            }
        }
        // print_r(' not defined');
        return;
    }
    // render if custom field exists
    if ($test){
	    return $content;
    }else{
        return;
    }
    

   // todo: implement some tokenizer to process arbitrary expressions:
   // something like this:

   // $tokens = token_get_all("<?php {$input}");
    // $expr = '';

    // foreach($tokens as $token){

    //   if(is_string($token)){

    //     if(in_array($token, array('(', ')', '+', '-', '/', '*'), true))
    //       $expr .= $token;

    //    continue;   
    //   }

    //   list($id, $text) = $token;

    //   if(in_array($id, array(T_DNUMBER, T_LNUMBER)))
    //     $expr .= $text;
    // }

    // $result = eval("<?php {$expr}");

}

/**
 * Registers the `core/post-title` block on the server.
 */
function register_template_conditional_custom_field() {
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
        'render_callback' => 'render_block_template_conditional_custom_field'
    ) );

}
add_action( 'init', 'register_template_conditional_custom_field' );

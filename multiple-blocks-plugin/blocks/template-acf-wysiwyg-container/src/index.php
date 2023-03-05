<?php

/**
 * Register template_acf_wysiwyg_container block
 */
add_action('init', function () {
    // echo('init');
    if( file_exists( plugin_dir_path( __FILE__ ) . '../build/index.asset.php') ) {
        // echo('file exists: '.__DIR__);
        register_block_type_from_metadata(__DIR__.'/../build/'
        ,
        [
            'render_callback' => function ($attributes, $content) {
                $field_name = isset($attributes['field_name']) ? $attributes['field_name'] : null;
                if( ! $field_name ) {
                    return '';
                }
                // $value = get_post_meta(get_post()->ID, $field_name, true);
                $value = get_field($field_name);
                $value = 'test';
                if( ! $value ) {
                    return '';
                }elseif (is_array($value)) {
                    $value = implode(', ', $value);
                }
                return sprintf('%s', esc_html($value));
            },

        ]
    );
    }
});



/**
 * Finds all instnace of our block and calls $callback on each
 *
 *
 */
function template_acf_wysiwyg_container_handler($post,$callback){
    //No blocks? Return early
    if(is_null($post) || ! has_blocks($post->post_content) ){
        return;
    }
    
    $sbt = 'multiple-blocks-plugin/template-acf-wysiwyg-container';
    $blocks = parse_blocks($post->post_content);
    
    // //Find out block
    // foreach ($blocks as $block) {

    //     if( $block['blockName'] == 'multiple-blocks-plugin/dm-col-sm-12-md-6' ){
    //         //Get field name and value
    //         $field_name = isset( $block['attrs']['field_name'])? $block['attrs']['field_name'] : null;
    //         $value = isset($block['attrs']['field_value']) ? $block['attrs']['field_value'] : null;
    //         //no value? don't update
    //         if( ! $field_name || ! $value ){
    //             continue;
    //         }else{
    //             $callback($post,$field_name,$value);
    //         }

    //     }
    // }

    function retrieve_specific_blocks2($blockss, $specific_block_type) {
        $specific_blocks = array();
        foreach ($blockss as $block) {
            if ($block['blockName'] === $specific_block_type) {
                $specific_blocks[] = $block;
            }
            if (array_key_exists('innerBlocks', $block) && count($block['innerBlocks'])>0) {
                $inner_blocks = retrieve_specific_blocks2($block['innerBlocks'], $specific_block_type);
                $specific_blocks = array_merge($specific_blocks, $inner_blocks);
            }
        }
        return $specific_blocks;
    }
    
    $specific_blocks = retrieve_specific_blocks2($blocks, $sbt);


    foreach($specific_blocks as $block){
        $field_name = isset( $block['attrs']['field_name'])? $block['attrs']['field_name'] : null;
        // $value = isset($block['attrs']['field_value']) ? $block['attrs']['field_value'] : null;
        $value = '';

        foreach ( $block['innerBlocks'] as $innerBlock ) {
            $value .= render_block( $innerBlock );
        }

        //no value? don't update
        if( ! $field_name || ! $value ){
            continue;
        }else{
            $callback($post,$field_name,$value);
        }
    }

}

/**
 * Before the block editor pre-loads its data, register meta fields
 *
 * @see https://developer.wordpress.org/reference/hooks/block_editor_rest_api_preload_paths/
 */
add_filter('block_editor_rest_api_preload_paths',function( $preload_paths, $block_editor_context){
    //Use handler to find all metablock blocks
    template_acf_wysiwyg_container_handler($block_editor_context->post,function($post,$field_name,$value){
        //Register the field for the found block
        register_meta($post->post_type, $field_name, [
            'type' => 'string',//change to integer if is_int($value) ?
            'single' => true,
            'show_in_rest' => true,
        ] );
    });
    //Return the preload paths unchanged
    return $preload_paths;
}, 10, 2 );


/**
 * When saving a post, save the metablock field
 *
 * @see: https://developer.wordpress.org/reference/hooks/rest_insert_this-post_type/
 */
// add_action('rest_insert_page', function($post){
//     //Find blocks using handler
//     template_acf_wysiwyg_container_handler($post,function($post,$field_name,$value){
//         update_field($field_name,$value,$post->ID);
//     });
// });

add_action('save_post','save_post_callback2',10,3);
function save_post_callback2($post_id,$post, $update){
    template_acf_wysiwyg_container_handler($post,function($post,$field_name,$value){
        update_field($field_name,$value,$post->ID);
    });
}
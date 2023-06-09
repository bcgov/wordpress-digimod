<?php
/**
* Plugin Name: DIGIMOD - miscellaneous
* Description: Defines WCAG Tag taxonomy
* Version: 1.0.0
* Author: Digimod
* License: GPL-2.0+
* License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// WCAG stuff
function register_wcag_tags(){
    // unregister_taxonomy('wcag_tag_TODO_RENAME');
    // unregister_taxonomy('wcag_tag');

    register_taxonomy(
        'wcag_tag',
        'wcag-card',
        array(
            'label' =>  __('WCAG Tag'),
            'show_in_rest' => true,
            'public' => true,
            'capabilities' => array(
                'manage_terms' => 'manage_wcag_tags',
                'edit_terms'   => 'edit_wcag_tags',
                'delete_terms' => 'delete_wcag_tags',
                'assign_terms' => 'assign_wcag_tags',
            )
        )
    );

    // todo: delete this
    // register_taxonomy(
    //     'wcag_tag_TODO_RENAME',
    //     'wcag',
    //     array(
    //         'label' =>  __('WCAG Tag'),
    //         'show_in_rest' => true,
    //         'public' => true,
    //         'capabilities' => array(
    //             'manage_terms' => 'manage_wcag_tags_del',
    //             'edit_terms'   => 'edit_wcag_tags_del',
    //             'delete_terms' => 'delete_wcag_tags_del',
    //             'assign_terms' => 'assign_wcag_tags_del',
    //         )
    //     )
    // );
}


add_action( 'init', 'register_wcag_tags', 0 );
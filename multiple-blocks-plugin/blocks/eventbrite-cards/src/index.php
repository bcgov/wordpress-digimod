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
function render_block_template_eventbrite_cards( $attributes, $content, $block ) {
    if ( is_admin() && ! wp_doing_ajax()  ) {
        // the block is being rendered in the editor, so return null to prevent the render_callback from firing
        return null;
    } else {
        // the block is being rendered outside the editor, so return your custom render function
    if($attributes['eventType'] == "Courses") {
        $isCourses = true;
    } else {
        $isCourses = false;
    }
    global $post;
    //$bearerToken = $attributes['api_key'];
    $bearerToken = get_post_meta( $post->ID, '_multiple_blocks_api_key', true );


    $events = getEvents($isCourses, $bearerToken);
    $eventHTML='<div class="row"><div class="col-sm-12"><h2 class="heading">'.$attributes['eventType'].'</h2></div></div>
    <div class="row" style="margin-bottom: 4px">';
    //return print_r($events['events']);
    foreach($events as $event)
    {

            $image = $event['logo']['url'];
            $title = $event['name']['text'];
            $description = $event['description']['text'];
            $link = $event['logo']['url'];
            $format = $attributes['eventType'];
            $eventHTML .= sprintf(
            '<div class="col-sm-12 col-md-6 col-lg-4" style="margin-bottom: 20px;">
                <div class="cardRound"><img alt="" src="%1$s" data-testid="thumbnail" >
                    <div >
                        <h2 data-testid="title" class="cardTitle" style="font-size: 25.92px; clear: both;">%5$s %2$s</h2>
                        <p data-testid="description">%3$s</p>
                        <a href="%4$s" target="_blank" rel="noopener noreferrer" class="externalLink" style="margin-top: auto;">
                            View Details &amp; Register
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" class="svg-inline--fa fa-external-link-alt fa-xs" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="margin-left: 0.3em;     height: 1em;">
                                <path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z">
                                </path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>'
            ,$image,$title,$description,$link,$format);
    }
    return $eventHTML.'</div>';

}
}

function getEvents($isCourses, $bearerToken) {
    //echo 'GETTING!';
    $events = array();
    $hasMoreItems = false;
    $continuationToken = null;
  
    do {
      $baseURL = 'https://www.eventbriteapi.com/v3/organizations/228490647317/events?status=live';
      if ($hasMoreItems && $continuationToken) {
        $baseURL .= '&continuation=' . $continuationToken;
      }
      $response = file_get_contents(
        $baseURL,
        false,
        stream_context_create(array(
          'http' => array(
            'header' => 'Authorization: Bearer '.$bearerToken, //${process.env.EVENTBRITE_BEARER_TOKEN}
          ),
        ))
      );
      $data = json_decode($response, true);
      //return $data;
      if (!$data) {
        return [];
        throw new Exception('Error decoding JSON response');
      }
      if (isset($data['error'])) {
        throw new Exception('Eventbrite API error: ' . $data['error_description']);
      }
      $hasMoreItems = false;

      $events = array_merge($events, $data['events']);
      if (isset($data['pagination'])) {
        $hasMoreItems = $data['pagination']['has_more_items'];
        if (isset($data['continuation'])) {
            $continuationToken = $data['pagination']['continuation'];
        }
      }
    } while ($hasMoreItems);
    $filteredEvents = array();
    foreach ($events as $event) {
        //echo 'formatid '.$event['format_id'] ;
        if($isCourses) {
            if ($event['format_id'] == '9') {
                array_push($filteredEvents,$event);
            }
        } else {
            if ($event['format_id'] != '9') {
                array_push($filteredEvents,$event);
            }
        }

      }
      //echo json_encode($filteredEvents);
    return $filteredEvents;
  }
  
  
function register_block_template_eventbrite_cards() {
    // automatically load dependencies and version
	// echo('register');
    $asset_file = include( plugin_dir_path( __FILE__ ) . '../build/index.asset.php');

    register_block_type( plugin_dir_path( __FILE__ ) .'../build', array(
        'api_version' => 2,
        'render_callback' => 'render_block_template_eventbrite_cards'
        ,
    ) );

}
add_action( 'init', 'register_block_template_eventbrite_cards' );
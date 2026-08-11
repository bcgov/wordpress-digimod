<?php
/**
 * PHPUnit bootstrap for digimod-theme-assets.
 *
 * @package Bcgov\DigitalGov
 */

require dirname( __DIR__, 2 ) . '/vendor/autoload.php';

if ( ! function_exists( 'absint' ) ) {
	/**
	 * Lightweight WordPress absint replacement for unit tests.
	 *
	 * @param mixed $maybeint Value to normalize.
	 *
	 * @return int
	 */
	function absint( $maybeint ): int {
		return abs( (int) $maybeint );
	}
}

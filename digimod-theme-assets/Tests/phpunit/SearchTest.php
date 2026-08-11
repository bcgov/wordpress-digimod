<?php
/**
 * Tests for Search helpers.
 *
 * @package Bcgov\DigitalGov
 */

use Bcgov\DigitalGov\Search;
use PHPUnit\Framework\TestCase;

/**
 * Search tests.
 */
class SearchTest extends TestCase {

	/**
	 * SearchWP minimum length is forced to two characters.
	 */
	public function test_searchwp_adjust_minimum_length_returns_two(): void {
		$this->assertSame( 2, Search::searchwp_adjust_minimum_length( 3 ) );
	}
}

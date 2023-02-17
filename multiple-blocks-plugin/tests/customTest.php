<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

// echo('dir: '.getcwd());
// require('multiple-blocks-plugin/custom.php');

final class Tests extends TestCase
{
    // public function testCanBeCreatedFromValidEmailAddress(): void
    // {
    //     $content = null;
    //     $block = null;
    //     $block_attributes= array("url" => "bar");

    //     $ret = override_core_embed($block_attributes, $content, $block);
    //     $this->assertEquals(
    //         $ret,
    //         '<div react-component="ReactPlayer" url="bar"></div>'
    //     );
    // }

    // public function testCannotBeCreatedFromInvalidEmailAddress(): void
    // {
    //     // $this->expectException(InvalidArgumentException::class);

    //     // Email::fromString('invalid');
    // }

    public function testCanBeUsedAsString(): void
    {
        $this->assertEquals(
            'user@example.com',
           'user@example.com'
        );
    }
}
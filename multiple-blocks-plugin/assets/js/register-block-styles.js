/* Add custom classes to core blocks, so that blocks such as headers are styled correctly */

export const registerBlockStyles = () => {
wp.domReady( () => {
    wp.blocks.registerBlockStyle( 'core/post-title', {
      name: '_ h1-heading',
      label: 'Digimod Page Title',
    //   isDefault: true
    } );
  } );
}
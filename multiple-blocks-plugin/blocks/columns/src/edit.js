import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks,InspectorControls, useInnerBlocksProps} from '@wordpress/block-editor';
  import { TextControl, Path, SVG,ToolbarDropdownMenu,PanelBody,PanelRow,RadioControl  } from "@wordpress/components";
  import { useEffect } from "@wordpress/element";
  import { useState, useRef } from 'react';

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    const blockProps = useBlockProps({
      className:"row"
    });

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };
    
    const onChange_bannerTitle = ( newContent ) => {
      setAttributes( { bannerTitle: newContent } );
    };

    let MY_TEMPLATE=null;
    // console.log('columns layout, switching..: ', attributes.layout);

    switch(attributes.layout_apply) {
      case 'two-equal':
        // console.log('two-equal');
        MY_TEMPLATE = [
          ['multiple-blocks-plugin/dm-column', {"classes":"col-sm-12 col-md-6"}],
          ['multiple-blocks-plugin/dm-column', {"classes":"col-sm-12 col-md-6"}]
        ];
        break;
      case 'side-menu-and-content':
        // console.log('side-menu-and-content');
        MY_TEMPLATE = [
          ['multiple-blocks-plugin/dm-column', {"classes":"col-sm-12 col-md-3"}],
          ['multiple-blocks-plugin/dm-column', {"classes":"col-sm-12 col-md-9"}]
        ];
        break;
      default:
        MY_TEMPLATE = [
          ['multiple-blocks-plugin/dm-col-sm-12-md-6', {}],
          ['multiple-blocks-plugin/dm-col-sm-12-md-6', {}]
        ];
    }



    // const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps,
    //   {
    //       template: MY_TEMPLATE,
    //       templateLock:"all"
    //   }
  // );

  // layout changed - render one version, then after a timeout, render another
  const setLayout = ( newContent ) => {
    // console.log('setLayout: ', newContent);
    setAttributes( { layout: newContent } );
    setAttributes( { layout_apply: 't_'+newContent } );
  };
  
  // todo: this is hacky - wordpress doesn't want you to switch between templates dynamically
  // but if we render a version of template with different blocks and then switch back, then it erases
  // all content and overwrites with desired version.
  // todo: when column type is switched, the content gets erased. Devise a way to preserve the content - check how core/row does it.

  useEffect(() => {
    // console.log('columns useEffect 1')
    if (attributes.layout_apply.startsWith('t_')){
      // console.log('columns useEffect')
      const timeoutId = setTimeout(() => {
        // console.log('TIMEOUT')
        setAttributes( { layout_apply: attributes.layout } );
        // setIsFirstVersion(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [attributes]);


      return (
        <div {...blockProps}>
          <InnerBlocks template={ MY_TEMPLATE } templateLock="all"></InnerBlocks>
           {/* <div {...innerBlocksProps}>
            {children}
          </div> */}
       
        <InspectorControls>
        <PanelBody  title="Settings" initialOpen={ true }>
                <PanelRow >
                <RadioControl
                    label="Columns Layout"
                    // help="The type of the current user"
                    selected={ attributes.layout }
                    options={ [
                        { label: 'Two equal columns', value: 'two-equal' },
                        { label: 'Side menu and content', value: 'side-menu-and-content' },
                        // { label: 'Blank', value: 'blank' },
                    ] }
                    onChange={ ( value ) => setLayout( value ) }
                />
                </PanelRow >
              </PanelBody>
        </InspectorControls>
        </div>
          );
        
  }
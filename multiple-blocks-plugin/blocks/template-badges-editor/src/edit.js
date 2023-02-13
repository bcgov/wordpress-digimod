import { __ } from '@wordpress/i18n';

  import { useBlockProps, RichText, InnerBlocks,InspectorControls } from '@wordpress/block-editor';
  import { CheckboxControl } from '@wordpress/components';
  import { useState, useEffect } from '@wordpress/element';

  import './editor.scss';

  export default function Edit(props) {
    const {
      attributes,
      setAttributes,
    } = props;

    // const blockProps = useBlockProps();

    const onChange_content = ( newContent ) => {
      setAttributes( { content: newContent } );
    };

    const blockProps = useBlockProps();
    
    // const [ isChecked, setChecked ] = useState( true );
    const { field_name, field_value, all_values } = attributes;


    const [selected, setSelected] = useState(field_value);

    const handleCheckboxChange = (value) => {
      let newVal = null;
      if (selected.includes(value)) {
        newVal = selected.filter((item) => item !== value)
      } else {
        newVal = [...selected, value]
        
      }
      setSelected(newVal);
      setAttributes( { field_value: newVal } );
      // acf.getFields({name:field_name})[0].val(selected);
    };

    useEffect(() => {
      // console.log('USEEFFECT TRIGGERED, attributes: ',JSON.stringify(attributes))
      let val = null;
      if (acf.getFields({name:field_name})[0] !== undefined) {
        val = acf.getFields({name:field_name})[0].val();
        let k = acf.getFields({name:field_name})[0];
        let allValues = k.$control().find(':checkbox').map(function(){return jQuery(this).val()}).get();
        console.log('saving allValues: ', allValues);
        acf.set(field_name+"allValues",allValues);
        // todo: remove all fields to prevent overwriting when save function gets hit
          // (prevents saving of ACF fields in a "normal" way - we are handling the saving through the meta blocks and PHP)
        // console.log('ACF REMOVE: ', field_name, acf.getFields({name:field_name})[0]);
        acf.set(field_name,val); // render function may get called repeatedly, we need to have the value saved somehwere in case it needs to be retreived later
        acf.getFields({name:field_name})[0].remove();
      }else if (acf.get(field_name)){
        val = acf.get(field_name);
      }
  
      if (val) {
        setAttributes({ ...attributes, field_value: val });
      }
    }, [acf.getFields({name:field_name})[0]]);

    return (
      <div  { ...blockProps }>
        <InspectorControls>
        {[...all_values].map((x, i) =>
              <CheckboxControl
              label={x}
              help={x}
              onChange={() => handleCheckboxChange(x)}
              checked={selected.includes(x)}
          />
        )}
			
			</InspectorControls>

      <div class="badgeWrapper" role="list" aria-label="tags">
      {[...selected].sort().map((x, i) =>
        <div class="customBadge" role="listitem">{x}</div>
      )}
      </div>

    </div>
  	);
  }
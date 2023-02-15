import { TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { InspectorControls, RichText } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

import "./editor.scss";

export default function Edit({ attributes, setAttributes, isSelected }) {
  // var postID = acf.get('post_id');
  // console.log('ACF post id: ', postID);

	// //Get meta value
	// const { meta } = acf.getFields('uid')[0].val();

  //useSelect((select) => ({meta: select("core/editor").getEditedPostAttribute("meta"),}));
	//Updates meta value
	// const { editPost } = useDispatch("core/editor");
	// const setMeta = (keyAndValue) => {
	// 	editPost({ meta: keyAndValue });
	// };

	//Get attribute values
	const { field_name, field_value, tag_type, class_name } = attributes;

	//Update field_name
	const setFieldName = (value) => {
		setAttributes({ ...attributes, field_name: value });
	};

	//Update field_value
	const setFieldValue = (newValue) => {
		// setMeta({ [field_name]: newValue });
		console.log('set field value: ', newValue);
		setAttributes({ ...attributes, field_value: newValue });
	};

	//Re-set attribute to meta value
	//Meta value may have change since last load
	useEffect(() => {
		// console.log('USEEFFECT TRIGGERED, attributes: ',JSON.stringify(attributes))
		let val = null;
		if (acf.getFields({name:field_name})[0] !== undefined) {
			val = acf.getFields({name:field_name})[0].val();
			// todo: remove all fields to prevent overwriting when save function gets hit
  			// (prevents saving of ACF fields in a "normal" way - we are handling the saving through the meta blocks and PHP)
			console.log('ACF REMOVE: ', field_name, acf.getFields({name:field_name})[0]);
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
		<div {...useBlockProps()}>
			<InspectorControls>
				<TextControl
					label={__("Field Name")}
					onChange={setFieldName}
					value={field_name}
				/>
				{field_name.length > 0 ? (
					<TextControl
						label={__("Field Value")}
						onChange={setFieldValue}
						value={field_value}
					/>
				) : null}
			</InspectorControls>
			{/* {field_value ? <p>{field_value}</p> : <p>No value</p>} */}
			<RichText className={class_name}
				tagName={tag_type}
				value={ attributes.field_value }
				allowedFormats={ [  ] }
				onChange={ setFieldValue }
				placeholder={ 'Field value..' }
				></RichText>
		</div>
	);
}
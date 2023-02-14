import { TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { InspectorControls } from "@wordpress/block-editor";
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
	const { field_name, field_value } = attributes;

	//Update field_name
	const setFieldName = (value) => {
		setAttributes({ ...attributes, field_name: value });
	};

	//Update field_value
	const setFieldValue = (newValue) => {
		// setMeta({ [field_name]: newValue });
		setAttributes({ ...attributes, field_value: newValue });
	};

	//Re-set attribute to meta value
	//Meta value may have change since last load
	useEffect(() => {
		if (acf.getFields({name:'uid'})[0] !== undefined) {
			setAttributes({ ...attributes, field_value: acf.getFields({name:'uid'})[0].val() });
		}
	}, [acf.getFields({name:'uid'})[0]]);

  // todo: remove all fields to prevent overwriting when save function gets hit
  // (prevents saving of ACF fields in a "normal" way - we are handling the saving through the meta blocks and PHP)
  // acf.getFields({name:'uid'})[0].remove()

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
			{field_value ? <p>{field_value}</p> : <p>No value</p>}
		</div>
	);
}
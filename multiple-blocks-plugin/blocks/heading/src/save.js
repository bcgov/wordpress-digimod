import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	console.log('heading save attrs: ', attributes);
	let tagName =  'h' + attributes.level;
	return   <RichText.Content 
	  tagName={tagName}
	  value={ attributes.content }
	></RichText.Content>;
}
import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	let tagName =  'h' + attributes.level;
	let id = attributes.id;
	const className = attributes.className || '';
	
	console.log('heading attributes: ', attributes);
	
	return   <RichText.Content 
	  id = {id}
	  tagName={tagName}
	  value={ attributes.content }
	  className={className}
	></RichText.Content>;
}
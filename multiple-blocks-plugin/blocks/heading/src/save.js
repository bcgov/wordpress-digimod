import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	let tagName =  'h' + attributes.level;
	let id = attributes.id;
	return   <RichText.Content 
	  id = {id}
	  tagName={tagName}
	  value={ attributes.content }
	></RichText.Content>;
}
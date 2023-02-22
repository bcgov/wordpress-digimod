import { TextControl, Path, SVG,ToolbarDropdownMenu } from "@wordpress/components";
import { __ , sprintf } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, BlockControls, RichText } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
// import ScrollspyNav from "react-scrollspy-nav";
import ScrollspyNav from "./ScrollspyNav";


import "./editor.scss";

export default function Edit({ attributes, setAttributes, isSelected }) {


	//Get attribute values
	const { level, content } = attributes;
	const tagName = 'h' + level;

	//Update field_name
	const setFieldName = (value) => {
		setAttributes({ ...attributes, field_name: value });
	};

	//Update field_value
	const setFieldValue = (newValue) => {
		// setMeta({ [field_name]: newValue });
		setAttributes({ ...attributes, content: newValue });
	};


	return (
		<div {...useBlockProps()}>
			<div className='scrollspyContainer'>
			 <div className='scrollspy'>
				<ScrollspyNav
					
					scrollTargetIds={["mission1", "mission2", "mission3", "mission4"]}
					offset={100}
					activeNavClass="active-scrollspy"
					scrollDuration="1000"
					scrollElementSelector = '[aria-label="Editor content"]'
				>
					<ul>
						<li><a href="#mission1">Connected services</a></li>
						<li><a href="#mission2">Digital Trust</a></li>
						<li><a href="#mission3">Reliable &amp; sustainable technology</a></li>
						<li><a href="#mission4">Digitally equipped BC Public Service</a></li>
						<li><a href="#">Download the plan (PDF, 101.7KB)</a></li>
					</ul>
				</ScrollspyNav>
			</div>
			</div>
		</div>
	);
}


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
			 <div className='scrollspy' role="navigation" aria-label="on this page">
				<h2 className="scrollspyOnThisPage h3-heading" aria-hidden="true">On this page:</h2>
				<ScrollspyNav
					
					scrollTargetIds={["mission1", "mission2", "mission3", "mission4"]}
					offset={100}
					activeNavClass="active-scrollspy"
					scrollDuration="1000"
					scrollElementSelector = '[aria-label="Editor content"]'
				>
					<div className="scrollspy_highlight"></div>
					<ul>
						<li><a href="#mission1" id="mission1_link"><span class="scrollSpyLinkContent">Connected services</span></a></li>
						<li><a href="#mission2" id="mission2_link"><span class="scrollSpyLinkContent">Digital Trust</span></a></li>
						<li><a href="#mission3" id="mission3_link"><span class="scrollSpyLinkContent">Reliable and sustainable technology</span></a></li>
						<li><a href="#mission4" id="mission4_link"><span class="scrollSpyLinkContent">Digitally equipped BC Public Service</span></a></li>
						<li class="scrollSpyButtonWrapper"><a class="scrollSpyButton" href="#"><span class="scrollSpyLinkContent">Download the plan (PDF, 101.7KB)</span></a></li>
					</ul>
				</ScrollspyNav>
			</div>
			</div>
		</div>
	);
}


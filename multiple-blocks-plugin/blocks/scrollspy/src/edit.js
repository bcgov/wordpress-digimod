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
						<li><a href="#" id="mission1_link" onClick={()=>{return false;}}>
							<span>
								<RichText
									tagName="span"
									className = "scrollSpyLinkContent"
									value={ attributes.link1Text }
									allowedFormats={ [ ] } 
									onChange={ ( link1Text ) => setAttributes( { link1Text } ) } 
									placeholder={ "Link 1 text..." } 
								/>
							</span></a></li>
						<li><a href="#" id="mission2_link" onClick={()=>{return false;}}>
						<span>
								<RichText
									tagName="span"
									className = "scrollSpyLinkContent"
									value={ attributes.link2Text }
									allowedFormats={ [ ] } 
									onChange={ ( link2Text ) => setAttributes( { link2Text } ) } 
									placeholder={ "Link 2 text..." } 
								/>
							</span>
							</a></li>
						<li><a href="#" id="mission3_link" onClick={()=>{return false;}}>
						<span>
								<RichText
									tagName="span"
									className = "scrollSpyLinkContent"
									value={ attributes.link3Text }
									allowedFormats={ [ ] } 
									onChange={ ( link3Text ) => setAttributes( { link3Text } ) }
									placeholder={ "Link 3 text..." } 
								/>
							</span>
							</a></li>
						<li><a href="#" id="mission4_link" onClick={()=>{return false;}}>
						<span>
								<RichText
									tagName="span"
									className = "scrollSpyLinkContent"
									value={ attributes.link4Text }
									allowedFormats={ [ ] } 
									onChange={ ( link4Text ) => setAttributes( { link4Text } ) } 
									placeholder={ "Link 4 text..." } 
								/>
							</span>
							</a></li>
						<li class="scrollSpyButtonWrapper"><a class="scrollSpyButton" href="#" onClick={()=>{return false;}}>
						<span>
								<RichText
									tagName="span"
									className = "scrollSpyLinkContent"
									value={ attributes.link4Text }
									allowedFormats={ [ ] }
									onChange={ ( link4Text ) => setAttributes( { link4Text } ) } 
									placeholder={ "Link 4 text..." }
								/>
							</span>
							</a></li>
					</ul>
				</ScrollspyNav>
			</div>
			</div>
		</div>
	);
}


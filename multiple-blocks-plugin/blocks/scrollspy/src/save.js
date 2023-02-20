import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import ScrollspyNav from "./ScrollspyNav";

export default function save({ attributes }) {
	return (
	<div className='scrollspy'>
		<ScrollspyNav
			
			scrollTargetIds={["mission1", "mission2", "mission3"]}
			offset={100}
			activeNavClass="active-scrollspy"
			scrollDuration="1000"
			scrollElementSelector = 'aria-label="Editor content"'
		>
			<ul>
				<li><a href="#mission1">Section 1</a></li>
				<li><a href="#mission2">Section 2</a></li>
				<li><a href="#mission3">Section 3</a></li>
			</ul>
		</ScrollspyNav>
	</div>
	)
}
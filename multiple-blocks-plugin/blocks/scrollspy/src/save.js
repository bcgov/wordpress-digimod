import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import ScrollspyNav from "./ScrollspyNav";

export default function save({ attributes }) {
	return (
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
	)
}
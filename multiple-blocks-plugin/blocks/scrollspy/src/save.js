import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import ScrollspyNav from "./ScrollspyNav";

export default function save({ attributes }) {
	return (
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
					<ul>
						<li><a href="#mission1"><span class="scrollSpyLinkContent">Connected services</span></a></li>
						<li><a href="#mission2"><span class="scrollSpyLinkContent">Digital Trust</span></a></li>
						<li><a href="#mission3"><span class="scrollSpyLinkContent">Reliable and sustainable technology</span></a></li>
						<li><a href="#mission4"><span class="scrollSpyLinkContent">Digitally equipped BC Public Service</span></a></li>
						<li class="scrollSpyButtonWrapper"><a class="scrollSpyButton" href="#"><span class="scrollSpyLinkContent">Download the plan (PDF, 101.7KB)</span></a></li>
					</ul>
				</ScrollspyNav>
		</div>
	</div>
	)
}
import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import ScrollspyNav from "./ScrollspyNav";

export default function save({ attributes }) {
	return (
	<div className='scrollspyContainer'>
			<div className='scrollspy' role="navigation" aria-label="on this page" style={{"top":"116px"}}>
			<h2 className="scrollspyOnThisPage h3-heading" aria-hidden="true">On this page:</h2>
			<div react-component="ScrollspyNav" 
					
					scrollTargetIds='["mission1", "mission2", "mission3", "mission4"]'
					offset="100"
					activeNavClass="active-scrollspy"
					scrollDuration="1000"
				>
					<div className="scrollspy_highlight"></div>
					<ul>
						<li><a className="active-scrollspy" href="#mission1" id="mission1_link"><span class="scrollSpyLinkContent">Connected services</span></a></li>
						<li><a href="#mission2" id="mission2_link"><span class="scrollSpyLinkContent">Digital Trust</span></a></li>
						<li><a href="#mission3" id="mission3_link"><span class="scrollSpyLinkContent">Reliable and sustainable technology</span></a></li>
						<li><a href="#mission4" id="mission4_link"><span class="scrollSpyLinkContent">Digitally equipped BC Public Service</span></a></li>
						<li class="scrollSpyButtonWrapper"><a class="scrollSpyButton" href="#"><span class="scrollSpyLinkContent">Download the plan (PDF, 101.7KB)</span></a></li>
					</ul>
				</div>
		</div>
	</div>
	)
}
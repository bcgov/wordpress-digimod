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
						<li><a className="active-scrollspy" href="#mission1" id="mission1_link">
							<RichText.Content className="scrollSpyLinkContent" tagName="span" value={attributes.link1Text} />
							</a></li>
						<li><a href="#mission2" id="mission2_link"><span class="scrollSpyLinkContent">
						<RichText.Content className="scrollSpyLinkContent" tagName="span" value={attributes.link2Text} />
							</span></a></li>
						<li><a href="#mission3" id="mission3_link"><span class="scrollSpyLinkContent">
						<RichText.Content className="scrollSpyLinkContent" tagName="span" value={attributes.link3Text} />
							</span></a></li>
						<li><a href="#mission4" id="mission4_link"><span class="scrollSpyLinkContent">
						<RichText.Content className="scrollSpyLinkContent" tagName="span" value={attributes.link4Text} />
							</span></a></li>
						<li class="scrollSpyButtonWrapper"><a class="scrollSpyButton" href="#">
						<RichText.Content className="scrollSpyLinkContent" tagName="span" value={attributes.link5Text} />
							</a></li>
					</ul>
				</div>
		</div>
	</div>
	)
}
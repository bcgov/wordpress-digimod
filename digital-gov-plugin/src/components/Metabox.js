import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { select, withSelect, withDispatch, useDispatch } from '@wordpress/data';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { PanelRow, SelectControl } from '@wordpress/components';

const MetaBox = ({setMetaFields }) => {
	const postStatus = select('core/editor').getEditedPostAttribute('status');
	return (
		<PluginPostStatusInfo>
			<PanelRow>
				<SelectControl
					label="Status"
					value={postStatus}
					options={[
						{ label: 'Draft', value: 'draft' },
						{ label: 'Publish', value: 'publish' },
						{ label: 'Updating', value: 'updating' },
						{ label: 'Content Review', value: 'pending' },
						{ label: 'Technical Review', value: 'technicalreview' },
					]}
					onChange={(value) => { setMetaFields(value) }}
					__nextHasNoMarginBottom
				/>
			</PanelRow>
		</PluginPostStatusInfo>
	);
}

const applyWithSelect = withSelect((select) => {
	return {
		status: select('core/editor').getEditedPostAttribute('status'),
		postType: select('core/editor').getCurrentPostType()
	};
});


const applyWithDispatch = withDispatch((dispatch) => {
	return {
		setMetaFields(newValue) {

			let userRoles;
			wp.apiFetch({ path: '/wp/v2/users/me?context=edit' })
				.then(response => {
					const userCapabilities = response.capabilities;
					userRoles = Object.keys(userCapabilities).filter(capability => userCapabilities[capability] === true);
					// Do something with the user's roles

					console.log(userRoles);

					const oldStatus = select('core/editor').getEditedPostAttribute('status');
					if (newValue === 'publish') {
						if (!userRoles.includes("administrator")) {
							dispatch('core/notices').createErrorNotice(
								'Pages must be reviewed by an admin before they are published.', {
								explicitDismiss: true
							})
							return;
						}
					}
					else if (['publish','updating'].includes(oldStatus)) {
						if (!userRoles.includes("administrator")) {
							dispatch('core/notices').createErrorNotice(
								'Only production managers can unpublish.', {
								explicitDismiss: true
							})
							return;
						}
					}
					else if (newValue === 'updating') {
						if (!userRoles.includes("administrator")) {
							dispatch('core/notices').createErrorNotice(
								'Only production managers can unpublish.', {
								explicitDismiss: true
							})
							return;
						}
						else if (oldStatus != 'publish') {
							dispatch('core/notices').createErrorNotice(
								'Only pages that have been published should use the updating status.', {
								explicitDismiss: true
							})
							return;
						}
					} 
					else if (newValue === 'technicalreview') {
						if (!(userRoles.includes("approve_content_review"))) {
							dispatch('core/notices').createErrorNotice(
								'Pages must be approved by a subject matter expert before they are sent for a technical review.', {
								explicitDismiss: true
							})
							return;
						}
					}

					console.log("Applying status: " + newValue)
					dispatch('core/editor').editPost({ status: newValue });
					dispatch('core/editor').savePost();
					console.log("saved!")
				});
		}
	}
});


export default compose([
	applyWithSelect,
	applyWithDispatch
])(MetaBox);
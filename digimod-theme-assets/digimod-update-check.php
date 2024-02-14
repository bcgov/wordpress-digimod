<?php

if ( ! class_exists( 'digimod_plugin_update_check' ) ) {
	class digimod_plugin_update_check {
		private $current_version;
		private $plugin_slug;
		private $slug;
		private $plugin_data;

		function __construct( $plugin_file, $plugin_slug ) {
			$this->plugin_data = get_plugin_data( $plugin_file );

			$this->current_version = $this->plugin_data['Version'];

			$this->plugin_slug = $plugin_slug;
			list ($t1, $t2)    = explode( '/', $plugin_slug );
			$this->slug        = $t1;

			// define the alternative API for updating checking
			add_filter( 'pre_set_site_transient_update_plugins', array( &$this, 'check_update' ) );
		}

		public function check_update( $transient ) {
			if ( empty( $transient->checked ) ) {
				return $transient;
			}

			// Remote meta data
			$remote_data = $this->check_remote();

			if ( $remote_data ) {
				// Get the remote version
				$remote_version = $remote_data['Version'];

				// If a newer version is available, add the update
				if ( $remote_version && version_compare( $this->current_version, $remote_version, '<' ) ) {
					$obj                                       = new stdClass();
					$obj->slug                                 = $this->slug;
					$obj->plugin                               = $this->plugin_slug;
					$obj->new_version                          = $remote_version;
					$transient->response[ $this->plugin_slug ] = $obj;
				}
			}

			return $transient;
		}


		private function check_remote() {
			if ( $this->plugin_data['UpdateURI'] ) {
				return get_plugin_data( $this->plugin_data['UpdateURI'] );
			}

			return false;
		}
	}
}

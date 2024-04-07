import {
	__,
} from '@wordpress/i18n';

import {
	Component,
	Fragment,
} from '@wordpress/element';

import {
	PluginSidebarMoreMenuItem,
	PluginSidebar,
} from '@wordpress/edit-post';

import {
	PanelBody,
	Button,
	RadioControl,
} from '@wordpress/components';

import {
	compose,
} from '@wordpress/compose';

import {
	withSelect,
	withDispatch,
} from '@wordpress/data';

import {
	registerPlugin,
} from '@wordpress/plugins';

import apiFetch from '@wordpress/api-fetch';

import './style.scss';

const NOT_TODAY = 99999;

const INTERVAL_OPTIONS = [
	{
		label: __('10 seconds', 'disable-gutenberg-autosave'),
		value: 10,
	},
	{
		label: __('30 seconds', 'disable-gutenberg-autosave'),
		value: 30,
	},
	{
		label: __('1 minute', 'disable-gutenberg-autosave') + ' (' + __('default', 'disable-gutenberg-autosave') + ')',
		value: 60,
	},
	{
		label: __('5 minutes', 'disable-gutenberg-autosave'),
		value: 60 * 5,
	},
	{
		label: __('10 minutes', 'disable-gutenberg-autosave'),
		value: 60 * 10,
	},
	{
		label: __('30 minutes', 'disable-gutenberg-autosave'),
		value: 60 * 30,
	},
	{
		label: __('Disabled', 'disable-gutenberg-autosave'),
		value: NOT_TODAY,
	},
];

class DisableGutenbergAutosave extends Component {

	constructor(props) {
		super(props);

		this.state = {
			interval: 0,
			error: false,
		};

		this.apiGetInterval = this.apiGetInterval.bind(this);
		this.apiSetInterval = this.apiSetInterval.bind(this);
		this.editorUpdateInterval = this.editorUpdateInterval.bind(this);
	}

	apiGetInterval() {
		apiFetch({path: '/disable-gutenberg-autosave/v1/interval'})
		.then(
			interval => {
				this.setState({
					interval,
					error: false,
				});
			},
			error => {
				this.setState({
					interval: NOT_TODAY,
					error: error.message,
				});
			}
		)
	}

	apiSetInterval() {
		if(this.state.error) {
			return;
		}

		apiFetch({
			path: '/disable-gutenberg-autosave/v1/interval',
			method: 'POST',
			data: {
				interval: parseInt(this.state.interval),
			},
		});
	}

	editorUpdateInterval() {
		this.props.updateEditorSettings({
			...this.props.editorSettings,
			autosaveInterval: parseInt(this.state.interval),
		});
	}

	componentDidMount() {
		this.apiGetInterval();
	}

	componentDidUpdate(prevProps, prevState) {
		if(!this.state.interval) {
			return;
		}

		if(prevState.interval && prevState.interval !== 0 && prevState.interval !== this.state.interval) {
			this.apiSetInterval();
		}

		if(this.props.editorSettings.autosaveInterval && this.props.editorSettings.autosaveInterval !== this.state.interval) {
			this.editorUpdateInterval();
		}
	}

	render() {
		return (
			<Fragment>
				<PluginSidebarMoreMenuItem target='disable-gutenberg-autosave-sidebar'>
					{__('Disable Gutenberg Autosave', 'disable-gutenberg-autosave')}
				</PluginSidebarMoreMenuItem>
				<PluginSidebar name='disable-gutenberg-autosave-sidebar' title={__('Autosave settings', 'disable-gutenberg-autosave')}>
					<PanelBody className='disable-gutenberg-autosave-settings'>
						{!this.state.interval && <p>{__('Loading...', 'disable-gutenberg-autosave')}</p>}
						{(!!this.state.interval && this.state.error) && (
							<Fragment>
								<h2 className='disable-gutenberg-autosave-header'>{__('API error:', 'disable-gutenberg-autosave')}</h2>
								<p className='disable-gutenberg-autosave-error'>{this.state.error}</p>
								<p>{__('Autosave is disabled anyway, but you cannot set custom intervals.', 'disable-gutenberg-autosave')}</p>
								<Button
									className='button button-primary'
									onClick={() => {
										this.setState({
											interval: 0,
											error: false,
										});
										this.apiGetInterval();
									}}
								>
									{__('Try again', 'disable-gutenberg-autosave')}
								</Button>
							</Fragment>
						)}
						{(!!this.state.interval && !this.state.error) && (
							<RadioControl
								label={__('Autosave interval', 'disable-gutenberg-autosave')}
								options={INTERVAL_OPTIONS}
								selected={parseInt(this.state.interval)}
								onChange={value => this.setState({interval: parseInt(value)})}
							/>
						)}
						<br />
						<strong>{__('Editor status', 'disable-gutenberg-autosave')}</strong>
						<ul style={{marginTop: 4}}>
							<li>{`${__('Is edited post dirty', 'disable-gutenberg-autosave')}: ${this.props.isDirty}`}</li>
							<li>{`${__('Is edited post autosaveable', 'disable-gutenberg-autosave')}: ${this.props.isAutosaveable}`}</li>
							<li>{`${__('Is autosaving', 'disable-gutenberg-autosave')}: ${this.props.isAutosaving}`}</li>
							<li>{`${__('Autosave interval', 'disable-gutenberg-autosave')}: ${this.props.interval}`}</li>
							<li>{`${__('Local autosave interval', 'disable-gutenberg-autosave')}: ${this.props.localInterval}`}</li>
						</ul>
						<Button
							isPrimary
							text={__('Autosave now', 'disable-gutenberg-autosave')}
							disabled={this.props.isAutosaving}
							isBusy={this.props.isAutosaving}
							onClick={() => {
								this.props.autosave();
							}}
						/>
					</PanelBody>
				</PluginSidebar>
			</Fragment>
		);
	}
}

const DisableGutenbergAutosavePlugin = compose([
	withSelect(select => {
		const {
			isEditedPostDirty,
			isEditedPostAutosaveable,
			isAutosavingPost,
			getEditorSettings,
		} = select('core/editor');

		const editorSettings = getEditorSettings();

		return {
			editorSettings,
			isDirty: isEditedPostDirty(),
			isAutosaveable: isEditedPostAutosaveable(),
			isAutosaving: isAutosavingPost(),
			interval: editorSettings.autosaveInterval,
			localInterval: editorSettings.__experimentalLocalAutosaveInterval || editorSettings.localAutosaveInterval,
		};
	}),
	withDispatch(dispatch => ({
		updateEditorSettings: dispatch('core/editor').updateEditorSettings,
		autosave: dispatch('core/editor').autosave,
	})),
])(DisableGutenbergAutosave);

registerPlugin('wsd-disable-gutenberg-autosave', {
	icon: 'backup',
	render: DisableGutenbergAutosavePlugin,
});

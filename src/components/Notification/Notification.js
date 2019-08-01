/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import Close16 from '@carbon/icons-react/lib/close/16';
import ErrorFilled20 from '@carbon/icons-react/lib/error--filled/20';
import CheckmarkFilled20 from '@carbon/icons-react/lib/checkmark--filled/20';
import WarningFilled20 from '@carbon/icons-react/lib/warning--filled/20';

const { prefix } = settings;

export class NotificationButton extends Component {
  static propTypes = {
    /**
     * Specify an optional className to be applied to the notification button
     */
    className: PropTypes.string,

    /**
     * Specify a label to be read by screen readers on the notification button
     */
    ariaLabel: PropTypes.string,

    /**
     * Optional prop to specify the type of the Button
     */
    type: PropTypes.string,

    /**
     * Provide a description for "close" icon that can be read by screen readers
     */
    iconDescription: PropTypes.string,

    /**
     * Optional prop to allow overriding the icon rendering.
     * Can be a React component class
     */
    renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    /**
     * Specify an optional icon for the Button through a string,
     * if something but regular "close" icon is desirable
     */
    name: PropTypes.string,

    /**
     * Specify the notification type
     */
    notificationType: PropTypes.oneOf(['toast', 'inline']),
  };

  static defaultProps = {
    ariaLabel: 'close notification', // TODO: deprecate this prop
    notificationType: 'toast',
    type: 'button',
    iconDescription: 'close icon',
    renderIcon: Close16,
  };

  render() {
    const {
      ariaLabel,
      className,
      iconDescription,
      type,
      renderIcon: IconTag,
      name,
      notificationType,
      ...other
    } = this.props;

    const buttonClasses = classNames(
      {
        [`${prefix}--toast-notification__close-button`]:
          notificationType === 'toast',
        [`${prefix}--inline-notification__close-button`]:
          notificationType === 'inline',
      },
      className
    );

    const iconClasses = classNames({
      [`${prefix}--toast-notification__close-icon`]:
        notificationType === 'toast',
      [`${prefix}--inline-notification__close-icon`]:
        notificationType === 'inline',
    });

    const NotificationButtonIcon = (() => {
      if (Object(IconTag) === IconTag) {
        return (
          <IconTag aria-label={ariaLabel} className={iconClasses} name={name} />
        );
      }
      return null;
    })();

    return (
      <button
        {...other}
        type={type}
        aria-label={iconDescription}
        title={iconDescription}
        className={buttonClasses}>
        {NotificationButtonIcon}
      </button>
    );
  }
}

export class NotificationTextDetails extends Component {
  static propTypes = {
    /**
     * Pass in the children that will be rendered in NotificationTextDetails
     */
    children: PropTypes.node,
    /**
     * Specify the title
     */
    title: PropTypes.string,
    /**
     * Specify the sub-title
     */
    subtitle: PropTypes.node,
    /**
     * Specify the caption
     */
    caption: PropTypes.node,
    /**
     * Specify the notification type
     */
    notificationType: PropTypes.oneOf(['toast', 'inline']),
  };

  static defaultProps = {
    title: 'title',
    subtitle: 'subtitle',
    caption: 'caption',
    notificationType: 'toast',
  };

  render() {
    const { title, subtitle, caption, notificationType, ...other } = this.props;
    if (notificationType === 'toast') {
      return (
        <div {...other} className={`${prefix}--toast-notification__details`}>
          <h3 className={`${prefix}--toast-notification__title`}>{title}</h3>
          <div className={`${prefix}--toast-notification__subtitle`}>
            {subtitle}
          </div>
          <div className={`${prefix}--toast-notification__caption`}>
            {caption}
          </div>
          {this.props.children}
        </div>
      );
    }

    if (notificationType === 'inline') {
      return (
        <div
          {...other}
          className={`${prefix}--inline-notification__text-wrapper`}>
          <p className={`${prefix}--inline-notification__title`}>{title}</p>
          <div className={`${prefix}--inline-notification__subtitle`}>
            {subtitle}
          </div>
          {this.props.children}
        </div>
      );
    }
  }
}

const useIcon = kindProp =>
  ({
    error: ErrorFilled20,
    success: CheckmarkFilled20,
    warning: WarningFilled20,
  }[kindProp]);

const NotificationIcon = ({
  icon,
  notificationType,
  kind,
  iconDescription,
}) => {
  const NotificationIconX = icon || useIcon(kind);
  return !NotificationIconX ? null : (
    <NotificationIconX
      className={`${prefix}--${notificationType}-notification__icon`}>
      <title>{iconDescription}</title>
    </NotificationIconX>
  );
};

export class ToastNotification extends Component {
  static propTypes = {
    /**
     * Pass in the children that will be rendered within the ToastNotification
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the notification box
     */
    className: PropTypes.string,

    /**
     * Specify what state the notification represents
     */
    kind: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,

    /**
     * Specify the title
     */
    title: PropTypes.string.isRequired,

    /**
     * Specify the sub-title
     */
    subtitle: PropTypes.node.isRequired,

    /**
     * By default, this value is "alert". You can also provide an alternate
     * role if it makes sense from the accessibility-side
     */
    role: PropTypes.string.isRequired,

    /**
     * Specify the caption
     */
    caption: PropTypes.node,

    /**
     * Provide a function that is called when menu is closed
     */
    onCloseButtonClick: PropTypes.func,

    /**
     * Provide a description for "close" icon that can be read by screen readers
     */
    closeIconDescription: PropTypes.string.isRequired,

    /**
     * Provide a description for the notification's left side icon that can be read by screen readers
     */
    iconDescription: PropTypes.string,

    /**
     * By default, this value is "toast". You can also provide an alternate type
     * if it makes sense for the underlying `<NotificationTextDetails>` and `<NotificationButton>`
     */
    notificationType: PropTypes.string,

    /**
     * Specify the close button should be disabled, or not
     */
    hideCloseButton: PropTypes.bool,

    /**
     * Specify an icon that should be displayed on the left side of the notification
     */
    icon: PropTypes.elementType,

    /**
     * Specify an optional duration the notification should be closed in
     */
    timeout: PropTypes.number,
  };

  static defaultProps = {
    kind: 'error',
    title: 'provide a title',
    subtitle: 'provide a subtitle',
    caption: 'provide a caption',
    role: 'alert',
    notificationType: 'toast',
    closeIconDescription: 'closes notification',
    iconDescription: 'decorative icon',
    onCloseButtonClick: () => {},
    hideCloseButton: false,
    timeout: 0,
    icon: null,
  };

  state = {
    open: true,
  };

  componentDidMount() {
    if (this.props.timeout) {
      setTimeout(() => {
        this.handleCloseButtonClick();
      }, this.props.timeout);
    }
  }

  handleCloseButtonClick = evt => {
    this.setState({ open: false });
    this.props.onCloseButtonClick(evt);
  };

  render() {
    if (!this.state.open) {
      return null;
    }

    const {
      role,
      notificationType,
      onCloseButtonClick, // eslint-disable-line
      closeIconDescription,
      iconDescription,
      className,
      caption,
      subtitle,
      title,
      kind,
      hideCloseButton,
      icon,
      ...other
    } = this.props;

    const classes = classNames(
      `${prefix}--toast-notification`,
      {
        [`${prefix}--toast-notification--${this.props.kind}`]: this.props.kind,
      },
      className
    );

    return (
      <div {...other} role={role} kind={kind} className={classes}>
        <NotificationIcon
          notificationType={notificationType}
          kind={kind}
          iconDescription={iconDescription}
          icon={icon}
        />
        <NotificationTextDetails
          title={title}
          subtitle={subtitle}
          caption={caption}
          notificationType={notificationType}>
          {this.props.children}
        </NotificationTextDetails>
        {!hideCloseButton && (
          <NotificationButton
            iconDescription={closeIconDescription}
            notificationType={notificationType}
            onClick={this.handleCloseButtonClick}
          />
        )}
      </div>
    );
  }
}

export class InlineNotification extends Component {
  static propTypes = {
    /**
     * Pass in the children that will be rendered within the InlineNotification
     */
    children: PropTypes.node,

    /**
     * Specify an optional className to be applied to the notification box
     */
    className: PropTypes.string,

    /**
     * Specify what state the notification represents
     */
    kind: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,

    /**
     * Specify the title
     */
    title: PropTypes.string.isRequired,

    /**
     * Specify the sub-title
     */
    subtitle: PropTypes.node.isRequired,

    /**
     * By default, this value is "alert". You can also provide an alternate
     * role if it makes sense from the accessibility-side
     */
    role: PropTypes.string.isRequired,

    /**
     * Provide a function that is called when menu is closed
     */
    onCloseButtonClick: PropTypes.func,

    /**
     * Provide a description for "close" icon that can be read by screen readers
     */
    closeIconDescription: PropTypes.string.isRequired,

    /**
     * Provide a description for the notification's left side icon that can be read by screen readers
     */
    iconDescription: PropTypes.string,

    /**
     * By default, this value is "inline". You can also provide an alternate type
     * if it makes sense for the underlying `<NotificationTextDetails>` and `<NotificationButton>`
     */
    notificationType: PropTypes.string,

    /**
     * Specify the close button should be disabled, or not
     */
    hideCloseButton: PropTypes.bool,

    /**
     * Specify an icon that should be displayed on the left side of the notification
     */
    icon: PropTypes.elementType,
  };

  static defaultProps = {
    role: 'alert',
    notificationType: 'inline',
    closeIconDescription: 'closes notification',
    iconDescription: 'decorative icon',
    onCloseButtonClick: () => {},
    hideCloseButton: false,
    icon: null,
  };

  state = {
    open: true,
  };

  handleCloseButtonClick = evt => {
    this.setState({ open: false });
    this.props.onCloseButtonClick(evt);
  };

  render() {
    if (!this.state.open) {
      return null;
    }

    const {
      role,
      notificationType,
      onCloseButtonClick, // eslint-disable-line
      closeIconDescription,
      iconDescription,
      className,
      subtitle,
      title,
      kind,
      hideCloseButton,
      icon,
      ...other
    } = this.props;

    const classes = classNames(
      `${prefix}--inline-notification`,
      {
        [`${prefix}--inline-notification--${this.props.kind}`]: this.props.kind,
      },
      className
    );

    return (
      <div {...other} role={role} kind={kind} className={classes}>
        <div className={`${prefix}--inline-notification__details`}>
          <NotificationIcon
            notificationType={notificationType}
            kind={kind}
            iconDescription={iconDescription}
            icon={icon}
          />
          <NotificationTextDetails
            title={title}
            subtitle={subtitle}
            notificationType={notificationType}>
            {this.props.children}
          </NotificationTextDetails>
        </div>
        {!hideCloseButton && (
          <NotificationButton
            iconDescription={closeIconDescription}
            notificationType={notificationType}
            onClick={this.handleCloseButtonClick}
          />
        )}
      </div>
    );
  }
}

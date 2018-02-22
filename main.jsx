import React from 'react';
import PropTypes from 'prop-types';
import {Accounts, STATES} from 'meteor/std:accounts-ui';

Form.propTypes = {
    fields: PropTypes.object.isRequired,
    buttons: PropTypes.object.isRequired,
    error: PropTypes.string,
    ready: PropTypes.bool
};

class Form extends Accounts.ui.Form {
    render() {
        const {
            hasPasswordService,
            oauthServices,
            fields,
            buttons,
            error,
            message,
            ready = true,
            className,
            formState
        } = this.props;

        return (
            <form ref={(ref) => this.form = ref} className={['accounts', className].join(' ')}>
                {Object.keys(fields).length > 0 ? (
                    <Accounts.ui.Fields fields={fields}/>
                ) : null}
                {buttons['switchToPasswordReset'] ? (
                    <fieldset className="form-group">
                        <Accounts.ui.Button className="btn-sm" {...buttons['switchToPasswordReset']} />
                    </fieldset>
                ) : null}
                <fieldset className="form-group">
                    {_.values(_.omit(buttons, 'switchToPasswordReset', 'switchToSignIn',
                        'switchToSignUp', 'switchToChangePassword', 'switchToSignOut', 'signOut')).map((button, i) =>
                        <Accounts.ui.Button {...button} key={i}/>
                    )}
                    {buttons['signOut'] ? (
                        <Accounts.ui.Button {...buttons['signOut']} type="submit"/>
                    ) : null}
                    {buttons['switchToSignIn'] ? (
                        <Accounts.ui.Button {...buttons['switchToSignIn']} type="button" className="ui button"/>
                    ) : null}
                    {buttons['switchToSignUp'] ? (
                        <Accounts.ui.Button {...buttons['switchToSignUp']} type="button" className="ui button"/>
                    ) : null}
                    {buttons['switchToChangePassword'] ? (
                        <Accounts.ui.Button {...buttons['switchToChangePassword']} type="button" className="ui button"/>
                    ) : null}
                    {buttons['switchToSignOut'] ? (
                        <Accounts.ui.Button {...buttons['switchToSignOut']} type="button" className="ui button"/>
                    ) : null}
                </fieldset>
                <fieldset>
                    {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
                        <Accounts.ui.PasswordOrService oauthServices={oauthServices}/>
                    ) : null}
                    {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
                        <Accounts.ui.SocialButtons oauthServices={oauthServices}/>
                    ) : null}
                </fieldset>
                <fieldset>
                    <Accounts.ui.FormMessage className="alert alert-danger m-t-1 m-b-0" role="alert"
                                             style={{display: 'block'}} {...message} />
                </fieldset>
            </form>
        );
    }
}

class Buttons extends Accounts.ui.Buttons {
}

class Button extends Accounts.ui.Button {
    render() {
        const {
            label,
            href = null,
            type,
            disabled = false,
            onClick,
            className,
            icon
        } = this.props;
        return type == 'link' ? (
            <a href={href}
               style={{cursor: 'pointer'}}
               className={className}
               onClick={onClick}>
                {icon ? (<i className={['fa', icon].join(' ')}/>) : null}{icon ? ' | ' : ''}{label}
            </a>
        ) : (
            <button className={[
                'btn',
                type == 'submit' ? 'btn-primary' : '',
                disabled ? 'disabled' : '',
                className
            ].join(' ')}
                    type={type}
                    disabled={disabled}
                    onClick={onClick}>
                {icon ? (<i className={['fa', icon].join(' ')}/>) : null}{icon ? ' | ' : ''}{label}
            </button>
        );
    }
}

class Fields extends Accounts.ui.Fields {
    render() {
        let {fields = {}, className = ''} = this.props;
        return (
            <fieldset className={[className].join(' ')}>
                {Object.keys(fields).map((id, i) =>
                    <Accounts.ui.Field {...fields[id]} key={i}/>
                )}
            </fieldset>
        );
    }
}

class Field extends Accounts.ui.Field {
    render() {
        const {
            id,
            hint,
            label,
            type = 'text',
            onChange,
            required = false,
            className,
            defaultValue = '',
            message = ''
        } = this.props;
        const {mount = true} = this.state;
        return mount ? (
            <div className={['form-group', required ? 'required' : ''].join(' ')}>
                <label htmlFor={id} className="form-control-label control-label">{label}</label>
                {/*<input id="password" className="form-control" name="password" style={{display: 'none'}} />*/}
                <input id={id}
                       className="form-control"
                       name={id}
                       type={type}
                       ref={(ref) => this.input = ref}
                       autoCapitalize={type == 'email' ? 'none' : undefined}
                       autoCorrect="off"
                       onChange={onChange}
                       placeholder={hint}
                       defaultValue={defaultValue}
                       required={required ? 'required' : ''}/>
                {message && (
                    <span className={['message', message.type].join(' ').trim()}>{message.message}</span>
                )}

            </div>
        ) : null;
    }
}

export class PasswordOrService extends Accounts.ui.PasswordOrService {
    render() {
        let {className, style = {}} = this.props;
        let {hasPasswordService, services} = this.state;
        labels = services;
        if (services.length > 2) {
            labels = [];
        }

        if (hasPasswordService && services.length > 0) {
            return (
                <div className="or-sep">
                    <p style={style} className={className}>
                        {`${T9n.get('orUse')} ${ labels.join(' / ') }`}
                    </p>
                </div>
            );
        }
        return null;
    }
}

class SocialButtons extends Accounts.ui.SocialButtons {
    render() {
        let {oauthServices = {}, className = 'social-buttons'} = this.props;

        if (Object.keys(oauthServices).length > 0) {
            return (
                <div className={[className].join(' ')}>
                    {Object.keys(oauthServices).map((id, i) => {
                        var mapObj = {
                            google: 'google-plus',
                            'meteor-developer': ''
                        };
                        let serviceClass = id.replace(/google|meteor\-developer/gi, (matched) => {
                            return mapObj[matched];
                        });

                        return (
                            <Accounts.ui.Button key={i} {...oauthServices[id]}
                                                className={serviceClass.length > 0 ? `btn-social btn-${serviceClass}` : ''}
                                                icon={serviceClass.length > 0 ? `fa-${serviceClass}` : ''}/>
                        );
                    })}
                </div>
            );
        } else {
            return null;
        }
    }
}

class FormMessage extends Accounts.ui.FormMessage {
    render() {
        let {message, type, role, className = 'message', style = {}} = this.props;
        return message ? (
            <div style={style}
                 className={[className, type].join(' ')}
                 role={role}>{message}</div>
        ) : null;
    }
}

// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid
// overwriting this one, but have a look at it and learn how it works. And pull
// requests altering how that works are welcome.

// Alter provided default unstyled UI.
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.PasswordOrService = PasswordOrService;
Accounts.ui.SocialButtons = SocialButtons;
Accounts.ui.FormMessage = FormMessage;

// Export the themed version.
export {Accounts, STATES};
export default Accounts;

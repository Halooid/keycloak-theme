import { useState, useEffect } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";

export default function EmailOtp(props: {
    kcContext: Extract<KcContext, { pageId: "email-code-form.ftl" }>;
    i18n: I18n;
    doUseDefaultCss: boolean;
    classes?: any;
    Template: (props: TemplateProps<any, any>) => JSX.Element | null;
}) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [otp, setOtp] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(30);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("emailCode")}
            headerNode={msg("emailOtpTitle")}
        >
            <form id="kc-otp-login-form" className={classes?.kcFormClass} action={url.loginAction} method="post">
                <div className={clsx(classes?.kcFormGroupClass, "otp-container")}>
                    <div className={classes?.kcLabelWrapperClass}>
                        <label htmlFor="emailCode" className={classes?.kcLabelClass}>
                            {msg("emailOtpInstruction")}
                        </label>
                    </div>

                    <div className={clsx(classes?.kcInputWrapperClass, "otp-input-wrapper")}>
                        <input
                            id="emailCode"
                            name="emailCode"
                            autoComplete="one-time-code"
                            type="text"
                            autoFocus
                            className={clsx(classes?.kcInputClass, "otp-input")}
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="000000"
                        />
                        {messagesPerField.existsError("emailCode") && (
                            <span
                                id="input-error-otp-code"
                                className={classes?.kcInputErrorMessageClass}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: messagesPerField.get("emailCode")
                                }}
                            />
                        )}
                    </div>

                    <div className="resend-container">
                        <button type="submit" name="resend" value="true" className="resend-btn" disabled={secondsLeft > 0}>
                            {secondsLeft > 0 ? (
                                <span className="resend-timer">
                                    {msg("resendOtp")} ({secondsLeft}s)
                                </span>
                            ) : (
                                msg("resendOtp")
                            )}
                        </button>
                    </div>
                </div>

                <div className={clsx(classes?.kcFormGroupClass, "form-actions")}>
                    <div id="kc-form-options" className={classes?.kcFormOptionsClass}>
                        <div className={classes?.kcFormOptionsWrapperClass}></div>
                    </div>

                    <div id="kc-form-buttons" className={classes?.kcFormButtonsClass}>
                        <input
                            className={clsx(
                                classes?.kcButtonClass,
                                classes?.kcButtonPrimaryClass,
                                classes?.kcButtonBlockClass,
                                classes?.kcButtonLargeClass,
                                "submit-btn"
                            )}
                            name="login"
                            id="kc-login"
                            type="submit"
                            value={msgStr("doSubmit")}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}

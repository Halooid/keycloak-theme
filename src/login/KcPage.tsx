import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import "./main.css";

const UserProfileFormFields = lazy(
    () => import("./UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "email-otp.ftl":
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext as any}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {
    kcButtonClass: "btn",
    kcButtonPrimaryClass: "btn-primary",
    kcButtonBlockClass: "btn-block",
    kcButtonLargeClass: "btn-lg",
    kcInputClass: "input-field",
    kcLabelClass: "input-label",
    kcInputErrorMessageClass: "error-message",
    kcFormGroupClass: "input-group",
    kcInputGroup: "password-field-wrapper",
    kcFormPasswordVisibilityButtonClass: "password-toggle",
    kcInputHelperTextBeforeClass: "helper-text",
    kcInputHelperTextAfterClass: "helper-text",
    kcFormSocialAccountListButtonClass: ""
} satisfies { [key in ClassKey]?: string };

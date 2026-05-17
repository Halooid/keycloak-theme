/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            emailOtpTitle: "Email Verification",
            emailOtpInstruction:
                "Please enter the 6-digit code sent to your email address.",
            resendOtp: "Resend Code",
            doSubmit: "Verify & Continue"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };

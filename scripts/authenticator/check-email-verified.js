/**
 * Condition to check if email is NOT verified
 * This is used when added as a "Condition - Script" in a conditional flow.
 */
function evaluateCondition(context) {
    var user = context.getUser();
    if (user == null) {
        LOG.warn("[check-email-verified.js] No user found in context. Skipping OTP.");
        return false;
    }
    var isVerified = user.isEmailVerified();
    LOG.info("[check-email-verified.js] Checking verification for user: " + user.getUsername() + ", emailVerified: " + isVerified);
    
    // Return true to trigger the sub-flow if email is NOT verified
    var result = !isVerified;
    LOG.info("[check-email-verified.js] Condition evaluation result (should trigger OTP?): " + result);
    return result;
}

/**
 * Authenticator implementation
 * This is used as an "Alternative" execution in a standard sub-flow to implement conditional bypass.
 * - If the email is verified: calls success() to satisfy the alternative block, skipping the OTP.
 * - If the email is not verified: calls attempted() to fail over to the next alternative (the OTP step).
 */
function authenticate(context) {
    var user = context.getUser();
    if (user == null) {
        LOG.warn("[check-email-verified.js] No user found in context. Triggering OTP as fallback.");
        context.attempted();
        return;
    }
    
    var isVerified = user.isEmailVerified();
    LOG.info("[check-email-verified.js] Checking email verification for user: " + user.getUsername() + ", emailVerified: " + isVerified);
    
    if (isVerified) {
        LOG.info("[check-email-verified.js] Email is verified. Bypassing OTP step.");
        context.success();
    } else {
        LOG.info("[check-email-verified.js] Email is not verified. Proceeding to OTP step.");
        context.attempted();
    }
}

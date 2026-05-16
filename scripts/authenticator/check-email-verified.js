/**
 * Condition to check if email is NOT verified
 */
function evaluateCondition(context) {
    var user = context.getUser();
    // Return true to trigger the sub-flow (OTP) if email is NOT verified
    return !user.isEmailVerified();
}

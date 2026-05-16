/**
 * Condition to check if email is NOT verified
 * This is used when added as a "Condition - Script" in a conditional flow.
 */
function evaluateCondition(context) {
    var user = context.getUser();
    if (user == null) {
        return false;
    }
    var isVerified = user.isEmailVerified();
    // Return true to trigger the sub-flow if email is NOT verified
    return !isVerified;
}

/**
 * Authenticator implementation
 * This is used if the script is added as a "Script" execution directly.
 * It prevents the NullPointerException by always setting a success status.
 */
function authenticate(context) {
    var user = context.getUser();
    if (user != null && !user.isEmailVerified()) {
        // Optional: Force verification if used as an authenticator
        // user.addRequiredAction("VERIFY_EMAIL");
    }
    context.success();
}

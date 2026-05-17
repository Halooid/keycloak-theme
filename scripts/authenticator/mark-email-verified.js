function authenticate(context) {
    var user = context.getUser();
    if (user != null) {
        LOG.info("[mark-email-verified.js] Marking email as verified for user: " + user.getUsername() + " (was verified? " + user.isEmailVerified() + ")");
        user.setEmailVerified(true);
        LOG.info("[mark-email-verified.js] Successfully marked email as verified. Current status: " + user.isEmailVerified());
    } else {
        LOG.warn("[mark-email-verified.js] No user found in context, cannot mark email as verified.");
    }
    context.success();
}

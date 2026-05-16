function authenticate(context) {
    var user = context.getUser();
    if (user != null) {
        user.setEmailVerified(true);
    }
    context.success();
}

function authenticate(context) {
    var user = context.getUser();
    user.setEmailVerified(true);
    context.success();
}

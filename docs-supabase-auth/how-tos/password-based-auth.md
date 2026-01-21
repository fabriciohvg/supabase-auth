---
title: "Password-based Auth"
subtitle:
  "Allow users to sign in with a password connected to their email or phone
  number."
reference: "https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=framework&framework=nextjs#with-phone"
---

# Password-based Auth

> Allow users to sign in with a password connected to their email or phone
> number.

[Original Docs Source](https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=framework&framework=nextjs#with-phone)

Users often expect to sign in to your site with a password. Supabase Auth helps
you implement password-based auth safely, using secure configuration options and
best practices for storing and verifying passwords.

Users can associate a password with their identity using their
[email address](#with-email) or a [phone number](#with-phone).

## With email

### Enabling email and password-based authentication

Email authentication is enabled by default.

You can configure whether users need to verify their email to sign in. On hosted
Supabase projects, this is true by default. On self-hosted projects or in local
development, this is false by default.

Change this setting on the
[Auth Providers page](/dashboard/project/_/auth/providers) for hosted projects,
or in the
[configuration file](/docs/guides/cli/config#auth.email.enable_confirmations)
for self-hosted projects.

### Signing up with an email and password

There are two possible flows for email signup:
[implicit flow](/docs/guides/auth/sessions#implicit-flow) and
[PKCE flow](/docs/guides/auth/sessions#pkce-flow). If you're using SSR, you're
using the PKCE flow. If you're using client-only code, the default flow depends
upon the client library. The implicit flow is the default in JavaScript and
Dart, and the PKCE flow is the default in Swift.

The instructions in this section assume that email confirmations are enabled.

The PKCE flow allows for server-side authentication. Unlike the implicit flow,
which directly provides your app with the access token after the user clicks the
confirmation link, the PKCE flow requires an intermediate token exchange step
before you can get the access token.

##### Step 1: Update signup confirmation email

Update your signup email template to send the token hash. For detailed
instructions on how to configure your email templates, including the use of
variables like `{{ .SiteURL }}`, `{{ .TokenHash }}`, and `{{ .RedirectTo }}`,
refer to our [Email Templates](/docs/guides/auth/auth-email-templates) guide.

Your signup email template should contain the following HTML:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
    >Confirm your email</a
  >
</p>
```

##### Step 2: Create token exchange endpoint

Create an API endpoint at `<YOUR_SITE_URL>/auth/confirm` to handle the token
exchange.

> Make sure you're using the right `supabase` client in the following code. If
> you're not using Server-Side Rendering or cookie-based Auth, you can directly
> use the `createClient` from `@supabase/supabase-js`. If you're using
> Server-Side Rendering, see the
> [Server-Side Auth guide](/docs/guides/auth/server-side/creating-a-client) for
> instructions on creating your Supabase client.

Create a new file at `app/auth/confirm/route.ts` and populate with the
following:

```ts app/auth/confirm/route.ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }

  // redirect the user to an error page with some instructions
  redirect("/auth/auth-code-error");
}
```

##### Step 3: Call the sign up function to initiate the flow

To sign up the user, call [signUp()](/docs/reference/javascript/auth-signup)
with their email address and password:

You can optionally specify a URL to redirect to after the user clicks the
confirmation link. This URL must be configured as a
[Redirect URL](/docs/guides/auth/redirect-urls), which you can do in the
[dashboard](/dashboard/project/_/auth/url-configuration) for hosted projects, or
in the
[configuration file](/docs/guides/cli/config#auth.additional_redirect_urls) for
self-hosted projects.

If you don't specify a redirect URL, the user is automatically redirected to
your site URL. This defaults to `localhost:3000`, but you can also configure
this.

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://your-project.supabase.co",
  "sb_publishable_... or anon key",
);

// ---cut---
async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: "valid.email@supabase.io",
    password: "example-password",
    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
}
```

### Signing in with an email and password

When your user signs in, call
[`signInWithPassword()`](/docs/reference/javascript/auth-signinwithpassword)
with their email address and password:

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://your-project.supabase.co",
  "sb_publishable_... or anon key",
);

// ---cut---
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "valid.email@supabase.io",
    password: "example-password",
  });
}
```

### Resetting a password

The PKCE flow allows for server-side authentication. Unlike the implicit flow,
which directly provides your app with the access token after the user clicks the
confirmation link, the PKCE flow requires an intermediate token exchange step
before you can get the access token.

##### Step 1: Update reset password email

Update your reset password email template to send the token hash. See
[Email Templates](/docs/guides/auth/auth-email-templates) for how to configure
your email templates.

Your reset password email template should contain the following HTML:

```html
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p>
  <a
    href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password"
    >Reset Password</a
  >
</p>
```

##### Step 2: Create token exchange endpoint

Create an API endpoint at `<YOUR_SITE_URL>/auth/confirm` to handle the token
exchange.

Make sure you're using the right `supabase` client in the following code.

If you're not using Server-Side Rendering or cookie-based Auth, you can directly
use the `createClient` from `@supabase/supabase-js`. If you're using Server-Side
Rendering, see the
[Server-Side Auth guide](/docs/guides/auth/server-side/creating-a-client) for
instructions on creating your Supabase client.

Create a new file at `app/auth/confirm/route.ts` and populate with the
following:

```ts app/auth/confirm/route.ts
import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
```

##### Step 3: Call the reset password by email function to initiate the flow

```js
async function resetPassword() {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
}
```

Once you have a session, collect the user's new password and call `updateUser`
to update their password.

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("url", "anonKey");

// ---cut---
await supabase.auth.updateUser({ password: "new_password" });
```

### Email sending

The signup confirmation and password reset flows require an SMTP server to send
emails.

The Supabase platform comes with a default email-sending service for you to try
out. The service has a rate limit of 2 emails per hour, and availability is on a
best-effort basis. For production use, you should consider configuring a custom
SMTP server.

> Consider configuring a custom SMTP server for production.

See the [Custom SMTP guide](/docs/guides/auth/auth-smtp) for instructions.

#### Local development with Mailpit

You can test email flows on your local machine. The Supabase CLI automatically
captures emails sent locally by using
[Mailpit](https://github.com/axllent/mailpit).

In your terminal, run `supabase status` to get the Mailpit URL. Go to this URL
in your browser, and follow the instructions to find your emails.

## With phone

You can use a user's mobile phone number as an identifier, instead of an email
address, when they sign up with a password.

This practice is usually discouraged because phone networks recycle mobile phone
numbers. Anyone receiving a recycled phone number gets access to the original
user's account. To mitigate this risk,
[implement MFA](/docs/guides/auth/auth-mfa).

> Protect users who use a phone number as a password-based auth identifier by
> enabling MFA.

### Enabling phone and password-based authentication

Enable phone authentication on the
[Auth Providers page](/dashboard/project/_/auth/providers) for hosted Supabase
projects.

For self-hosted projects or local development, use the
[configuration file](/docs/guides/cli/config#auth.sms.enable_signup). See the
configuration variables namespaced under `auth.sms`.

If you want users to confirm their phone number on signup, you need to set up an
SMS provider. Each provider has its own configuration. Supported providers
include MessageBird, Twilio, Vonage, and TextLocal (community-supported).

### Signing up with a phone number and password

To sign up the user, call [`signUp()`](/docs/reference/javascript/auth-signup)
with their phone number and password:

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://your-project.supabase.co",
  "sb_publishable_... or anon key",
);

// ---cut---
const { data, error } = await supabase.auth.signUp({
  phone: "+13334445555",
  password: "some-password",
});
```

If you have phone verification turned on, the user receives an SMS with a
6-digit pin that you must verify within 60 seconds:

You should present a form to the user so they can input the 6 digit pin, then
send it along with the phone number to `verifyOtp`:

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://your-project.supabase.co",
  "sb_publishable_... or anon key",
);

// ---cut---
const {
  data: { session },
  error,
} = await supabase.auth.verifyOtp({
  phone: "+13334445555",
  token: "123456",
  type: "sms",
});
```

### Signing in a with a phone number and password

Call the function to sign in with the user's phone number and password:

```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://your-project.supabase.co",
  "sb_publishable_... or anon key",
);

// ---cut---
const { data, error } = await supabase.auth.signInWithPassword({
  phone: "+13334445555",
  password: "some-password",
});
```

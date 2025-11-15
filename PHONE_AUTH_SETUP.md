# Firebase Phone Authentication Setup

## Understanding the reCAPTCHA Warning

When using phone authentication, you may see this warning in the console:

```
Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.
```

**This is NORMAL and expected!** Firebase automatically falls back to reCAPTCHA v2, and authentication should still work. This warning can be safely ignored.

## Setup Requirements

### 1. Enable Phone Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Click on **Phone** provider
5. Toggle **Enable** to ON
6. Click **Save**

### 2. Enable Billing (Required for SMS)

Firebase phone authentication requires billing to be enabled, even for the free tier:

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click on **Usage and billing**
3. Set up a billing account if you haven't already
4. Firebase provides a free tier with limited SMS messages per month

**Note:** Without billing enabled, phone authentication will fail with quota errors.

### 3. Test Phone Number (Development Only)

For testing, Firebase allows you to use test phone numbers without sending actual SMS:

1. In Firebase Console, go to **Authentication** > **Sign-in method** > **Phone**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers (e.g., +1234567890) and verification codes
4. These numbers will bypass SMS sending during development

## Phone Number Format

Phone numbers must be in E.164 format:
- Start with `+` (plus sign)
- Followed by country code
- Then the phone number
- Example: `+1234567890` (US), `+441234567890` (UK)

## Common Issues

### Issue: "Failed to initialize reCAPTCHA Enterprise config"

**Solution:** This is just a warning. Firebase automatically uses reCAPTCHA v2. The authentication should still work. You can ignore this warning.

### Issue: "SMS quota exceeded"

**Solutions:**
1. Enable billing in Firebase Console
2. Check if you've exceeded the free tier limit
3. Wait for the quota to reset (usually monthly)
4. Use test phone numbers during development

### Issue: "Invalid phone number"

**Solutions:**
1. Ensure phone number starts with `+`
2. Include country code (e.g., `+1` for US)
3. Remove any spaces, dashes, or parentheses
4. Format: `+[country code][number]`

### Issue: Phone auth doesn't work in Expo Go

**Solution:** Phone authentication works better in:
- Development builds (not Expo Go)
- Physical devices (not simulators)
- Production builds

For Expo Go, consider using test phone numbers or email authentication instead.

## Testing

1. Use test phone numbers during development (see Setup step 3)
2. Test on a physical device when possible
3. Ensure billing is enabled
4. Check Firebase Console > Authentication > Users to see if users are created

## Production Considerations

- Phone authentication works best in native builds (not Expo Go)
- Consider implementing rate limiting
- Monitor SMS costs in Firebase Console
- Set up proper error handling for users
- Consider alternative auth methods for users who can't receive SMS

## Alternative: Use Email Authentication

If phone authentication continues to cause issues, consider using:
- Email/password authentication (already implemented)
- Google sign-in (already implemented)
- These methods don't require reCAPTCHA or SMS


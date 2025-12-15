Overview

This document provides comprehensive testing documentation for the Gym Membership Manager API. The API implements secure authentication, role-based access control, membership management, and real-time check-in validation.

Base URL: http://localhost:3000/api

Authentication: JWT Bearer Token

Supported Roles:

    admin - Full system access

    staff - Check-in operations, view members

    client - View own data only

Setup Instructions
Prerequisites

bash
# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Run migrations
npm run migrate

# Start server
npm run dev

Default Credentials

    Admin Email: admin@gym.com

    Admin Password: Admin@123

Collection Variables

Set these in Postman → Collection → Variables:
Variable	Description	Auto-filled
baseUrl	API base URL	Manual: http://localhost:3000/api
adminToken	Admin JWT token	Auto: Test 5
clientToken	Client JWT token	Auto: Test 4
testEmail	Test user email	Auto: Test 2
planId	Created plan ID	Auto: Test 6
memberId	Member profile ID	Auto: Test 4
subscriptionId	Subscription ID	Auto: Test 8
Authentication Tests
Test 1: Health Check

Purpose: Verify API server is running and accessible

Method: GET

Endpoint: /health

Authentication: None required

Headers:

text
(None)

Body:

text
(None - GET request)

Expected Response (200 OK):

json
{
  "status": "OK",
  "timestamp": "2025-12-14T20:25:00.000Z"
}

Test Assertions:

    Status code is 200

    Response has status field with value "OK"

    Response has timestamp field

    Response time < 500ms

Use Case: System health monitoring, pre-deployment checks
Test 2: Register New Client

Purpose: Create new client account with email verification

Method: POST

Endpoint: /auth/register

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com",
  "password": "TestPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

Field Validations:

    email: Valid email format, max 255 chars, unique

    password: Min 8 chars, must contain uppercase, lowercase, number, special character

    firstName: 2-100 chars, letters/spaces/hyphens only

    lastName: 2-100 chars, letters/spaces/hyphens only

    phone: Optional, E.164 format

Expected Response (201 Created):

json
{
  "userId": 2,
  "email": "testuser001@example.com",
  "message": "Registration successful. Please check your email for verification code."
}

Test Assertions:

    Status code is 201

    Response contains userId (number)

    Response contains email

    Response contains success message with "verification"

    Response time < 2000ms

Important: Check server console for 5-digit verification code

Server Console Output:

text
[DEV] Verification code for testuser001@example.com: 12345

Error Responses:
Status	Error	Cause
400	"Invalid email format"	Malformed email
400	"Password must be between 8 and 128 characters"	Weak password
400	"Email already registered"	Duplicate email
Test 3: Verify Email

Purpose: Activate user account with 5-digit verification code

Method: POST

Endpoint: /auth/verify-email

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com",
  "code": "12345"
}

Field Validations:

    email: Must match registered email

    code: Exactly 5 digits, valid and not expired (15 minutes)

Expected Response (200 OK):

json
{
  "verified": true,
  "message": "Email verified successfully. You can now log in."
}

Test Assertions:

    Status code is 200

    verified is true

    Message contains "verified"

Security Features:

    Maximum 5 verification attempts per code

    Code expires after 15 minutes

    Hashed code storage (not plain text)

Error Responses:
Status	Error	Cause
400	"Invalid verification code. X attempts remaining"	Wrong code
400	"Verification code expired"	Code > 15 min old
400	"Too many failed attempts"	5+ wrong attempts
400	"Email already verified"	Already active
Test 4: Login as Client

Purpose: Authenticate client and receive JWT token

Method: POST

Endpoint: /auth/login

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com",
  "password": "TestPass123!"
}

Expected Response (200 OK):

json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGVzdHVzZXIwMDFAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzM0MjA3MDAwLCJleHAiOjE3MzQ4MTE4MDB9.xxx",
  "user": {
    "id": 2,
    "email": "testuser001@example.com",
    "role": "client",
    "profile": {
      "id": 1,
      "user_id": 2,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "date_of_birth": null,
      "emergency_contact": null,
      "created_at": "2025-12-14T18:56:00.000Z",
      "updated_at": "2025-12-14T18:56:00.000Z"
    }
  }
}

Test Assertions:

    Status code is 200

    Response contains token (string > 20 chars)

    Response contains user object with id, email, role

    User role is "client"

    User has profile object with first_name, last_name

Important: Save the token value for authenticated requests

Token Details:

    Algorithm: HS256 (HMAC-SHA256)

    Expiration: 7 days (configurable)

    Payload: userId, email, role

Error Responses:
Status	Error	Cause
401	"Invalid credentials"	Wrong email/password
400	"Please verify your email before logging in"	Unverified account
400	"Your account has been suspended"	Suspended account

Rate Limiting: 5 attempts per 15 minutes
Test 5: Login as Admin

Purpose: Authenticate admin user for management operations

Method: POST

Endpoint: /auth/login

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "admin@gym.com",
  "password": "Admin@123"
}

Expected Response (200 OK):

json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@gym.com",
    "role": "admin",
    "profile": null
  }
}

Test Assertions:

    Status code is 200

    Response contains token

    User role is "admin"

    Profile is null (admins don't have member profiles)

Important: Save this admin token separately from client token

Admin Permissions:

    Create/update membership plans

    Manage all user accounts

    Create subscriptions for any member

    View all payments and reports

    Check-in any member

Test 13: Resend Verification Code

Purpose: Request new verification code if original expired or lost

Method: POST

Endpoint: /auth/resend-code

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "newuser@example.com"
}

Expected Response (200 OK):

json
{
  "message": "Verification code sent. Please check your email."
}

Test Assertions:

    Status code is 200

    Message indicates code was sent

Security Features:

    60-second cooldown between resend requests

    Maximum 3 resends per 24 hours

    Previous code is invalidated

    New 5-digit code generated

Server Console Output:

text
[DEV] Verification code for newuser@example.com: 67890

Error Responses:
Status	Error	Cause
404	"User not found"	Email not registered
400	"Email already verified"	Account already active
429	"Please wait X seconds before requesting a new code"	Cooldown active
Test 20: Get Current User

Purpose: Retrieve authenticated user's profile information

Method: GET

Endpoint: /auth/me

Authentication: Required (Bearer token)

Headers:

text
Authorization: Bearer {clientToken}

Body:

text
(None - GET request)

Expected Response (200 OK):

json
{
  "user": {
    "id": 2,
    "email": "testuser001@example.com",
    "role": "client",
    "status": "active",
    "createdAt": "2025-12-14T18:56:00.000Z",
    "profile": {
      "id": 1,
      "user_id": 2,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "date_of_birth": null,
      "emergency_contact": null,
      "created_at": "2025-12-14T18:56:00.000Z",
      "updated_at": "2025-12-14T18:56:00.000Z"
    }
  }
}

Test Assertions:

    Status code is 200

    User object contains id, email, role, status

    Client users have profile object

    Profile contains first_name, last_name

Use Case: Display user profile page, account settings
Test 21: Change Password

Purpose: Allow authenticated users to update their password

Method: POST

Endpoint: /auth/change-password

Authentication: Required (Bearer token)

Headers:

text
Content-Type: application/json
Authorization: Bearer {clientToken}

Body:

json
{
  "currentPassword": "TestPass123!",
  "newPassword": "NewSecurePass456!"
}

Field Validations:

    currentPassword: Must match current password hash

    newPassword: Min 8 chars, uppercase, lowercase, number, special char

    New password must differ from current password

Expected Response (200 OK):

json
{
  "success": true,
  "message": "Password changed successfully"
}

Test Assertions:

    Status code is 200

    success is true

    Message confirms change

Security Features:

    Requires authentication (can't change others' passwords)

    Current password verification required

    New password must meet strength requirements

    Password hashed with Argon2id before storage

Error Responses:
Status	Error	Cause
400	"Current password is incorrect"	Wrong current password
400	"New password must be different"	Same as current
400	"Password must contain..."	Weak new password
Test 22: Forgot Password

Purpose: Request password reset code via email

Method: POST

Endpoint: /auth/forgot-password

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com"
}

Expected Response (200 OK):

json
{
  "message": "If an account exists with this email, a password reset code has been sent."
}

Test Assertions:

    Status code is 200

    Message is generic (doesn't reveal if email exists)

    Message includes "If an account exists"

Security Features:

    Generic response prevents email enumeration

    6-digit reset code (different from verification)

    Code expires after 30 minutes

    Rate limited: 3 requests per hour

Server Console Output:

text
[DEV] Password reset code for testuser001@example.com: 123456

Important: Save the 6-digit code for Test 23
Test 23: Reset Password

Purpose: Reset password using 6-digit code from email

Method: POST

Endpoint: /auth/reset-password

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com",
  "code": "123456",
  "newPassword": "ResetPassword789!"
}

Field Validations:

    email: Must match reset request email

    code: Exactly 6 digits, valid, not expired (30 minutes)

    newPassword: Min 8 chars, uppercase, lowercase, number, special char

Expected Response (200 OK):

json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}

Test Assertions:

    Status code is 200

    success is true

    Message confirms reset

Security Features:

    Maximum 5 attempts per reset code

    Code expires after 30 minutes

    Old reset codes deleted after successful use

    New password hashed with Argon2id

Error Responses:
Status	Error	Cause
400	"Invalid reset code"	Wrong code
400	"Reset code expired"	Code > 30 min old
400	"Too many failed attempts"	5+ wrong attempts
400	"Code must be 6 digits"	Invalid format

Verification: After successful reset, login with new password using Test 4
Membership Management Tests
Test 6: Create Membership Plan (Admin Only)

Purpose: Admin creates a new membership plan

Method: POST

Endpoint: /memberships/plans

Authentication: Required (Admin token)

Headers:

text
Content-Type: application/json
Authorization: Bearer {adminToken}

Body:

json
{
  "name": "Monthly Membership",
  "description": "Full gym access for 30 days",
  "durationDays": 30,
  "price": 50.00
}

Field Validations:

    name: Required, 1-100 chars

    description: Optional, max 1000 chars

    durationDays: Required, positive integer

    price: Required, positive decimal (2 decimal places)

Expected Response (201 Created):

json
{
  "id": 1,
  "name": "Monthly Membership",
  "durationDays": 30,
  "price": 50
}

Test Assertions:

    Status code is 201

    Response contains id (number)

    name, durationDays, price match request

    Values are correct data types

Important: Save the id for creating subscriptions

Common Plan Examples:

    Weekly Pass: 7 days, $15

    Monthly Membership: 30 days, $50

    Quarterly: 90 days, $130

    Annual: 365 days, $500

Error Responses:
Status	Error	Cause
401	"Access token required"	No token provided
403	"Insufficient permissions"	Not admin role
400	Validation error	Invalid field values
Test 7: Get All Membership Plans (Public)

Purpose: Retrieve all active membership plans (no authentication)

Method: GET

Endpoint: /memberships/plans

Authentication: None required (public endpoint)

Headers:

text
(None)

Body:

text
(None - GET request)

Expected Response (200 OK):

json
[
  {
    "id": 1,
    "name": "Monthly Membership",
    "description": "Full gym access for 30 days",
    "duration_days": 30,
    "price": 50,
    "status": "active",
    "created_at": "2025-12-14T19:05:00.000Z",
    "updated_at": "2025-12-14T19:05:00.000Z"
  }
]

Test Assertions:

    Status code is 200

    Response is an array

    Each plan has id, name, duration_days, price, status

    All plans have status "active"

    At least one plan exists

Use Case: Display pricing page on public website

Notes:

    Returns only active plans (archived plans excluded)

    Sorted by price ascending

    No pagination for MVP (add for production)

Test 8: Create Subscription for Member (Admin/Staff)

Purpose: Assign a membership plan to a member

Method: POST

Endpoint: /memberships/subscriptions

Authentication: Required (Admin or Staff token)

Headers:

text
Content-Type: application/json
Authorization: Bearer {adminToken}

Body:

json
{
  "memberId": 1,
  "planId": 1,
  "startDate": "2025-12-14"
}

Field Validations:

    memberId: Required, must exist in member_profiles

    planId: Required, must exist in membership_plans

    startDate: Optional, defaults to today, format: YYYY-MM-DD

Expected Response (201 Created):

json
{
  "id": 1,
  "memberId": 1,
  "planId": 1,
  "planName": "Monthly Membership",
  "startDate": "2025-12-14",
  "endDate": "2026-01-13",
  "status": "active"
}

Test Assertions:

    Status code is 201

    Response contains subscription id

    memberId and planId match request

    status is "active"

    endDate is calculated correctly (startDate + plan duration)

Business Logic:

    endDate = startDate + plan.duration_days

    Status automatically set to "active"

    Only one active subscription per member (for MVP)

Important: Save the subscription id for future operations

Error Responses:
Status	Error	Cause
400	"Plan not found"	Invalid planId
400	"Member not found"	Invalid memberId
403	"Insufficient permissions"	Client role trying to create
Test 9: Get My Subscription (Client)

Purpose: Client views their own subscription details

Method: GET

Endpoint: /memberships/my-subscription

Authentication: Required (Client token)

Headers:

text
Authorization: Bearer {clientToken}

Body:

text
(None - GET request)

Expected Response (200 OK):

json
{
  "id": 1,
  "member_id": 1,
  "plan_id": 1,
  "status": "active",
  "start_date": "2025-12-14",
  "end_date": "2026-01-13",
  "paused_at": null,
  "paused_days": 0,
  "created_at": "2025-12-14T19:08:00.000Z",
  "updated_at": "2025-12-14T19:08:00.000Z",
  "plan_name": "Monthly Membership",
  "duration_days": 30,
  "price": 50
}

Test Assertions:

    Status code is 200

    Response contains subscription details

    Status is "active" (or other valid status)

    Includes plan details (name, duration, price)

Possible Statuses:

    active: Currently valid, can check in

    expired: Past end_date, needs renewal

    cancelled: Member cancelled, effective until end_date

    paused: Temporarily frozen, time not counting

If No Subscription:

json
{
  "message": "No active subscription"
}

Use Case: Display membership status on member dashboard

Security: Users can only view their own subscription (not other members)
Check-In System Tests
Test 10: Check-In Member (Allowed)

Purpose: Staff/Admin checks in a member with active subscription

Method: POST

Endpoint: /checkins/checkin

Authentication: Required (Admin or Staff token)

Headers:

text
Content-Type: application/json
Authorization: Bearer {adminToken}

Body:

json
{
  "memberEmail": "testuser001@example.com"
}

Expected Response (200 OK):

json
{
  "checkInId": 1,
  "allowed": true,
  "reason": null,
  "member": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "testuser001@example.com"
  },
  "timestamp": "2025-12-14T19:13:00.000Z"
}

Test Assertions:

    Status code is 200

    allowed is true

    checkInId is a number

    member object contains name and email

    timestamp is present

    reason is null (no denial reason)

Business Logic Checks:

    ✅ Member exists

    ✅ Has active subscription

    ✅ Subscription not expired

    ✅ Status is "active" (not suspended/paused)

Use Case: Front desk staff scanning member cards or entering email

Audit Trail: All check-ins logged with staff member who performed action
Test 11: Get My Check-In History (Client)

Purpose: Client views their check-in history

Method: GET

Endpoint: /checkins/my-checkins

Authentication: Required (Client token)

Headers:

text
Authorization: Bearer {clientToken}

Body:

text
(None - GET request)

Expected Response (200 OK):

json
[
  {
    "id": 1,
    "member_id": 1,
    "check_in_time": "2025-12-14T19:13:00.000Z",
    "check_out_time": null,
    "status": "allowed",
    "denial_reason": null,
    "created_by": 1
  }
]

Test Assertions:

    Status code is 200

    Response is an array

    Each entry has id, member_id, check_in_time, status

    At least one check-in exists (after Test 10)

Use Case: Member dashboard showing gym visit history

Notes:

    Sorted by check_in_time descending (most recent first)

    Limited to 50 entries for MVP (add pagination for production)

    created_by references staff/admin who checked them in

Test 12: Check-In Without Subscription (Denied)

Purpose: Verify system denies entry to members without active subscription

Method: POST

Endpoint: /checkins/checkin

Authentication: Required (Admin or Staff token)

Headers:

text
Content-Type: application/json
Authorization: Bearer {adminToken}

Body:

json
{
  "memberEmail": "nonexistent@example.com"
}

Expected Response (404 Not Found):

json
{
  "error": "Member not found"
}

OR (If member exists without subscription):

json
{
  "checkInId": 2,
  "allowed": false,
  "reason": "No active subscription",
  "member": {
    "first_name": "Test",
    "last_name": "User",
    "email": "nonexistent@example.com"
  },
  "timestamp": "2025-12-14T19:16:00.000Z"
}

Test Assertions:

    Status code is 200 or 404

    If 200: allowed is false and reason provided

    If 404: error indicates member not found

Denial Reasons:

    "Member not found"

    "No active subscription"

    "Subscription expired"

    "Subscription is paused"

    "Subscription is cancelled"

    "Account suspended"

Business Value: Prevents unauthorized gym access, enforces payment compliance

Audit Trail: Denied check-ins are also logged for security monitoring
Security & Validation Tests
Test 14: Invalid Login (Wrong Password)

Purpose: Verify authentication security rejects wrong passwords

Method: POST

Endpoint: /auth/login

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "testuser001@example.com",
  "password": "WrongPassword123!"
}

Expected Response (401 Unauthorized):

json
{
  "error": "Invalid credentials"
}

Test Assertions:

    Status code is 401

    Error message is "Invalid credentials"

    No token is returned

    No user data is returned

Security Best Practices:

    Generic error message (doesn't reveal if email exists)

    No indication whether email or password is wrong

    Rate limiting applied (5 attempts per 15 minutes)

    Argon2id hash verification

Test 15: Weak Password Validation

Purpose: Verify system rejects passwords not meeting security requirements

Method: POST

Endpoint: /auth/register

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "weakpass@example.com",
  "password": "weak",
  "firstName": "Test",
  "lastName": "User"
}

Expected Response (400 Bad Request):

json
{
  "error": "Password must be between 8 and 128 characters"
}

Test Assertions:

    Status code is 400

    Error message contains "password"

    Error message is descriptive (explains requirement)

Password Requirements:

    ✅ 8-128 characters length

    ✅ At least one uppercase letter (A-Z)

    ✅ At least one lowercase letter (a-z)

    ✅ At least one number (0-9)

    ✅ At least one special character (!@#$%^&*(),.?":{}|<>)

Other Weak Password Errors:

    "password" → "Password must contain at least one uppercase letter"

    "Password" → "Password must contain at least one number"

    "Password1" → "Password must contain at least one special character"

Test 16: Invalid Email Format

Purpose: Verify email validation prevents malformed addresses

Method: POST

Endpoint: /auth/register

Authentication: None required

Headers:

text
Content-Type: application/json

Body:

json
{
  "email": "not-an-email",
  "password": "TestPass123!",
  "firstName": "Test",
  "lastName": "User"
}

Expected Response (400 Bad Request):

json
{
  "error": "Invalid email format"
}

Test Assertions:

    Status code is 400

    Error message contains "email"

Email Validation Rules:

    Must contain @ symbol

    Must have local part before @

    Must have domain after @

    Max 255 characters

    RFC 5322 compliant

Invalid Email Examples:

    invalid-email (no @)

    @example.com (no local part)

    test@ (no domain)

    test..user@example.com (double dots)

Test 17: Unauthorized Access (Client Tries Admin Action)

Purpose: Verify role-based access control prevents privilege escalation

Method: POST

Endpoint: /memberships/plans

Authentication: Required (Client token - wrong role)

Headers:

text
Content-Type: application/json
Authorization: Bearer {clientToken}

Body:

json
{
  "name": "Unauthorized Plan",
  "description": "This should fail",
  "durationDays": 30,
  "price": 100.00
}

Expected Response (403 Forbidden):

json
{
  "error": "Insufficient permissions"
}

Test Assertions:

    Status code is 403

    Error indicates insufficient permissions

    No plan was created

Authorization Matrix:
Action	Client	Staff	Admin
View own data	✅	✅	✅
Create plans	❌	❌	✅
Create subscriptions	❌	✅	✅
Check-in members	❌	✅	✅
View all members	❌	✅	✅
View payments	Own only	✅	✅
Test 18: Access Without Token

Purpose: Verify protected endpoints require authentication

Method: GET

Endpoint: /memberships/my-subscription

Authentication: None (intentionally omitted)

Headers:

text
(No Authorization header)

Body:

text
(None - GET request)

Expected Response (401 Unauthorized):

json
{
  "error": "Access token required"
}

Test Assertions:

    Status code is 401

    Error message contains "token"

    No data is returned

Security: All protected endpoints must validate token presence before processing
Test 19: Invalid Token

Purpose: Verify system rejects tampered or fake tokens

Method: GET

Endpoint: /memberships/my-subscription

Authentication: Invalid token provided

Headers:

text
Authorization: Bearer invalid.fake.token.here

Body:

text
(None - GET request)

Expected Response (403 Forbidden):

json
{
  "error": "Invalid or expired token"
}

Test Assertions:

    Status code is 403

    Error indicates token problem

    No data is returned

Token Validation:

    Signature verification (HMAC-SHA256)

    Expiration check (7 days default)

    Structure validation (header.payload.signature)

    Payload integrity check

Error Codes Reference
HTTP Status Codes
Code	Name	Usage
200	OK	Successful GET/POST/PUT request
201	Created	Resource created successfully
400	Bad Request	Validation error, malformed request
401	Unauthorized	Missing or invalid authentication
403	Forbidden	Authenticated but insufficient permissions
404	Not Found	Resource doesn't exist
429	Too Many Requests	Rate limit exceeded
500	Internal Server Error	Server-side error
Common Error Response Format

json
{
  "error": "Descriptive error message"
}

Success Response Format

json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { }
}

Test Execution Order
Recommended Sequence

Phase 1: Authentication Setup

    Test 1: Health Check

    Test 5: Login as Admin

    Test 2: Register New Client

    Test 3: Verify Email

    Test 4: Login as Client

Phase 2: Membership Management
6. Test 6: Create Membership Plan
7. Test 7: Get All Plans
8. Test 8: Create Subscription

Phase 3: Member Operations
9. Test 9: Get My Subscription
10. Test 20: Get Current User
11. Test 10: Check-In Member
12. Test 11: Get Check-In History

Phase 4: Security Testing
13. Test 17: Unauthorized Access
14. Test 18: Access Without Token
15. Test 19: Invalid Token
16. Test 14: Invalid Login
17. Test 15: Weak Password
18. Test 16: Invalid Email

Phase 5: Advanced Auth Features
19. Test 21: Change Password
20. Test 22: Forgot Password
21. Test 23: Reset Password
22. Test 13: Resend Verification
23. Test 12: Check-In Denied
Rate Limiting
Endpoint	Limit	Window
/auth/register	3 requests	60 minutes
/auth/verify-email	5 attempts	15 minutes
/auth/resend-code	3 requests	60 minutes
/auth/login	5 attempts	15 minutes
/auth/forgot-password	3 requests	60 minutes
/auth/reset-password	5 attempts	15 minutes

Lockout Behavior:

    After max attempts, user locked for 5 minutes

    Counter resets after successful operation

    Prevents brute force attacks

Security Features Summary
Password Security

    ✅ Argon2id hashing (64MB memory, 3 iterations, parallelism 4)

    ✅ Minimum 8 characters with complexity requirements

    ✅ Rate limiting on login attempts

    ✅ Secure password reset flow

Token Security

    ✅ JWT with HMAC-SHA256 signature

    ✅ 7-day expiration (configurable)

    ✅ Payload includes userId, email, role

    ✅ Verified on every protected endpoint

Verification Codes

    ✅ Cryptographically secure random generation

    ✅ Hashed before storage (Argon2id 32MB, 2 iterations)

    ✅ Time-based expiration (15/30 minutes)

    ✅ Attempt limiting (max 5 tries)

Audit Logging

    ✅ User registration, login, logout

    ✅ Password changes and resets

    ✅ Subscription creation/modification

    ✅ Payment recording

    ✅ Check-in attempts (allowed and denied)

Database Schema Quick Reference
users

sql
id, email, password_hash, role, status, created_at, updated_at

email_verifications

sql
id, user_id, code_hash, expires_at, attempts, last_attempt_at, created_at

password_resets

sql
id, user_id, code_hash, expires_at, attempts, last_attempt_at, created_at

member_profiles

sql
id, user_id, first_name, last_name, phone, date_of_birth, emergency_contact

membership_plans

sql
id, name, description, duration_days, price, status, created_at, updated_at

subscriptions

sql
id, member_id, plan_id, status, start_date, end_date, paused_at, paused_days

check_ins

sql
id, member_id, check_in_time, check_out_time, status, denial_reason, created_by

audit_logs

sql
id, user_id, action, entity_type, entity_id, changes, ip_address, created_at

Troubleshooting Guide
"SQLITE_ERROR: no such table: users"

Solution: Run database migrations

bash
npm run migrate

"Access token required"

Solution: Add Authorization header with Bearer token
"Invalid or expired token"

Solution: Login again to get fresh token
"Verification code expired"

Solution: Use resend-code endpoint (Test 13)
"Too many attempts"

Solution: Wait 5 minutes or request new code
"Insufficient permissions"

Solution: Use correct role token (admin for admin operations)
404 on endpoint

Solution: Check server is running and URL is correct
API Performance Benchmarks
Operation	Target Response Time
Health Check	< 100ms
Login	< 500ms
Get Plans	< 200ms
Check-In	< 300ms
Create Subscription	< 400ms
Registration	< 1000ms (includes hashing)
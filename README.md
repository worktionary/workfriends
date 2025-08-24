# @worktionary/workfriends 👍👍

Ooh work friends. A simple utility to check if email addresses to infer if they are work friends.

![Ooh friend](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXVibXB4bmZnczkzcndic2Z6NW56b2x3anRub2FkaGIzeTBtOTlpMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UrMSH5YXfLpgA/giphy.gif)

## Installation

```bash
npm install @worktionary/workfriends
```

## Quick Start

```typescript
import { areWorkFriends } from "@worktionary/workfriends"

areWorkFriends(["alice@worktionary.com", "bob@worktionary.com"]) // true
```

## Usage

```typescript
import { areWorkFriends } from "@worktionary/workfriends"

// Auto-detect (all emails must be from same domain)
const emails1 = ["bob@worktionary.com", "sue@worktionary.com"]
areWorkFriends(emails1) // true

const emails2 = ["bob@worktionary.com", "external@gmail.com"]
areWorkFriends(emails2) // false

// With known domain
const emails3 = [
	"bob@worktionary.com",
	"sue@worktionary.com",
	"external@gmail.com",
]
areWorkFriends(emails3, "worktionary.com") // false (external person present)

// With multiple known domains (for companies with multiple domains)
const emails4 = ["bob@worktionary.com", "advisor@worktionary-advisors.com"]
areWorkFriends(emails4, ["worktionary.com", "worktionary-advisors.com"]) // true

// Clean ternary usage
{
	areWorkFriends(emails) ? <div>Internal</div> : <div>External</div>
}

// Descriptive variable names
const isInternalMeeting = areWorkFriends(emails)
const sameUserOrg = areWorkFriends(emails)
const fromSameDomain = areWorkFriends(emails)
```

## API

### `areWorkFriends(emails, knownDomains?)`

Check if emails are from work friends. Returns boolean directly for clean usage.

- `emails: string[]` - Array of email addresses
- `knownDomains?: string | string[]` - Optional known internal domain(s)
- Returns `boolean` - True if all emails are internal
- Throws `WorkFriendsError` - When validation fails

## Error Handling

Validation errors throw `WorkFriendsError` with detailed information. Use try-catch when you need error details:

```typescript
import { areWorkFriends, WorkFriendsError } from "@worktionary/workfriends"

try {
	const result = areWorkFriends(
		["valid@company.com", "invalid-email", "user@gmail.com"],
		"company.com"
	)

	console.log("Are work friends:", result)
} catch (error) {
	if (error instanceof WorkFriendsError) {
		console.log("Invalid emails:", error.invalidEmails) // Format errors: ["invalid-email"]
		console.log("Invalid domains:", error.invalidDomains) // Domain errors: ["invalid"]
		console.log("Error message:", error.message)
	}
}

// Validate email format
import { isValidEmail } from "@worktionary/workfriends"

isValidEmail("user@domain.com") // true
isValidEmail("not-an-email") // false
```

## Examples

```typescript
// Company with single domain
areWorkFriends(
	["team@worktionary.com", "boss@worktionary.com"],
	"worktionary.com"
) // true

// Company with multiple domains (e.g., main + advisors)
areWorkFriends(
	["employee@worktionary.com", "advisor@worktionary-advisors.com"],
	["worktionary.com", "worktionary-advisors.com"]
) // true

// Auto-detect when you don't know the domain
areWorkFriends(["a@same.com", "b@same.com"]) // true
areWorkFriends(["a@diff.com", "b@other.com"]) // false

// React component usage
function MeetingBadge({ emails }) {
	return (
		<div>
			{areWorkFriends(emails) ? (
				<span className="internal">🏢 Internal Meeting</span>
			) : (
				<span className="external">🌍 External Meeting</span>
			)}
		</div>
	)
}

// Conditional logic
if (areWorkFriends(meetingEmails)) {
	enableInternalFeatures()
	showConfidentialAgenda()
} else {
	restrictExternalAccess()
}

// Error handling when needed
try {
	const isInternal = areWorkFriends(userInputEmails)
	updateMeetingStatus(isInternal)
} catch (error) {
	if (error instanceof WorkFriendsError) {
		// Handle different types of validation errors
		if (error.invalidEmails) {
			showEmailFormatErrors(error.invalidEmails)
		}
		if (error.invalidDomains) {
			showDomainErrors(error.invalidDomains)
		}
	}
}
```

## Email Validation

### `isValidEmail(email)`

A standalone email validation utility that you can use independently for form validation, input sanitization, or anywhere you need to check email format.

```typescript
import { isValidEmail } from "@worktionary/workfriends"

// Basic validation
isValidEmail("user@domain.com") // true
isValidEmail("not-an-email") // false

// Form validation example
function validateEmailInput(email: string) {
	if (!isValidEmail(email)) {
		throw new Error("Please enter a valid email address")
	}
	return email
}

// Input sanitization
function sanitizeEmails(emails: string[]) {
	return emails.filter((email) => isValidEmail(email))
}

// React form validation
function EmailForm() {
	const [email, setEmail] = useState("")
	const [isValid, setIsValid] = useState(true)

	const handleEmailChange = (e) => {
		const value = e.target.value
		setEmail(value)
		setIsValid(isValidEmail(value))
	}

	return (
		<input
			type="email"
			value={email}
			onChange={handleEmailChange}
			className={isValid ? "valid" : "invalid"}
		/>
	)
}
```

**What it validates:**

- Must contain exactly one `@` symbol
- Must have content before and after the `@`
- Domain must contain at least one `.` (dot)
- All domain parts must have content (no empty segments)

**What it accepts:**

- `user@domain.com` ✅
- `user.name@domain.co.uk` ✅
- `user+tag@domain.com` ✅
- `test@sub.domain.org` ✅

**What it rejects:**

- `notanemail` ❌ (no @ symbol)
- `@domain.com` ❌ (no local part)
- `user@` ❌ (no domain)
- `user@domain` ❌ (domain needs dot)
- `user@@domain.com` ❌ (multiple @ symbols)
- `user@domain.` ❌ (empty domain segment)
- `user@.com` ❌ (empty domain segment)

## License

MIT

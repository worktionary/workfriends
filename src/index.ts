/**
 * Custom error for work friend validation issues
 */
export class WorkFriendsError extends Error {
	invalidEmails?: string[]
	invalidDomains?: string[]

	constructor(
		message: string,
		details: {
			invalidEmails?: string[]
			invalidDomains?: string[]
		} = {}
	) {
		super(message)
		this.name = "WorkFriendsError"
		if (details.invalidEmails) this.invalidEmails = details.invalidEmails
		if (details.invalidDomains) this.invalidDomains = details.invalidDomains
	}
}

/**
 * Simple email validation
 * @param email Email address to validate
 * @returns True if email appears valid
 */
export function isValidEmail(email: string): boolean {
	// Basic checks: has @, has content before/after @, domain has a dot
	const parts = email.split("@")
	if (parts.length !== 2) return false

	const [localPart, domain] = parts
	if (!localPart || !domain) return false

	// Check domain has at least one dot and content around it
	const domainParts = domain.split(".")
	if (domainParts.length < 2) return false

	// Each part of domain should have content
	return domainParts.every((part) => part.length > 0)
}

/**
 * Detect if a meeting is internal based on email addresses
 * @param emails Array of email addresses
 * @param knownDomains Optional known internal domain(s)
 * @returns True if all emails are from internal domain(s)
 * @throws WorkFriendsError when validation fails
 */
export function areWorkFriends(
	emails: string[],
	knownDomains?: string | string[]
): boolean {
	if (emails.length === 0) return true // Empty meeting is technically internal

	// Validate email formats
	const invalidEmails: string[] = []
	const validEmails: string[] = []

	emails.forEach((email) => {
		if (isValidEmail(email)) {
			validEmails.push(email)
		} else {
			invalidEmails.push(email)
		}
	})

	// Validate known domains if provided
	let validDomains: string[] = []
	let invalidDomains: string[] = []

	if (knownDomains !== undefined) {
		const domains = Array.isArray(knownDomains) ? knownDomains : [knownDomains]
		domains.forEach((domain) => {
			if (domain.includes(".") && domain.length > 1) {
				validDomains.push(domain)
			} else {
				invalidDomains.push(domain)
			}
		})
	}

	// Throw error if we have any validation issues
	if (invalidEmails.length > 0 || invalidDomains.length > 0) {
		const errorDetails: any = {}
		if (invalidEmails.length > 0) errorDetails.invalidEmails = invalidEmails
		if (invalidDomains.length > 0) errorDetails.invalidDomains = invalidDomains

		let message = "Validation failed"
		if (invalidEmails.length > 0)
			message += ` - ${invalidEmails.length} invalid email(s)`
		if (invalidDomains.length > 0)
			message += ` - ${invalidDomains.length} invalid domain(s)`

		throw new WorkFriendsError(message, errorDetails)
	}

	// If no valid emails after validation, can't determine
	if (validEmails.length === 0) {
		throw new WorkFriendsError("No valid emails provided")
	}

	// Check if all valid emails are work friends
	if (validDomains.length > 0) {
		// Check against known domains
		return validEmails.every((email) => {
			const emailDomain = email.split("@")[1]?.toLowerCase()
			return validDomains.some((domain) => emailDomain === domain.toLowerCase())
		})
	} else {
		// Auto-detect mode - check if all emails have same domain
		const emailDomains = validEmails.map((email) =>
			email.split("@")[1]?.toLowerCase()
		)
		return new Set(emailDomains).size === 1
	}
}

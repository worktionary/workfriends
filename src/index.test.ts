import { areWorkFriends, WorkFriendsError, isValidEmail } from "./index"

describe("areWorkFriends", () => {
	// Email validation tests
	describe("email validation", () => {
		test("throws error for invalid email formats", () => {
			expect(() => areWorkFriends(["notanemail"])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["@domain.com"])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["user@"])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["user@domain"])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["user@.com"])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["user@domain."])).toThrow(WorkFriendsError)
			expect(() => areWorkFriends(["user@@domain.com"])).toThrow(
				WorkFriendsError
			)
		})

		test("throws error when any email is invalid", () => {
			const emails = ["valid@domain.com", "notvalid"]
			expect(() => areWorkFriends(emails)).toThrow(WorkFriendsError)
		})

		test("throws error for invalid emails even with known domain", () => {
			expect(() => areWorkFriends(["invalid"], "domain.com")).toThrow(
				WorkFriendsError
			)
			expect(() =>
				areWorkFriends(["user@domain", "user2@domain.com"], "domain.com")
			).toThrow(WorkFriendsError)
		})

		test("provides detailed error information", () => {
			try {
				areWorkFriends(["valid@domain.com", "invalid"])
			} catch (error) {
				expect(error).toBeInstanceOf(WorkFriendsError)
				if (error instanceof WorkFriendsError) {
					expect(error.invalidEmails).toContain("invalid")
				}
			}
		})
	})

	// Auto-detect mode (no known domains)
	test("returns true when all emails have same domain", () => {
		const emails = [
			"bob@worktionary.com",
			"sue@worktionary.com",
			"jim@worktionary.com",
		]
		expect(areWorkFriends(emails)).toBe(true)
	})

	test("returns false when emails have different domains", () => {
		const emails = ["bob@worktionary.com", "external@gmail.com"]
		expect(areWorkFriends(emails)).toBe(false)
	})

	test("returns true for empty array", () => {
		expect(areWorkFriends([])).toBe(true)
	})

	test("returns true for single email", () => {
		expect(areWorkFriends(["bob@worktionary.com"])).toBe(true)
	})

	// Known domain mode (single domain)
	test("returns true when all emails match known domain", () => {
		const emails = ["bob@worktionary.com", "sue@worktionary.com"]
		expect(areWorkFriends(emails, "worktionary.com")).toBe(true)
	})

	test("returns false when some emails do not match known domain", () => {
		const emails = ["bob@worktionary.com", "external@gmail.com"]
		expect(areWorkFriends(emails, "worktionary.com")).toBe(false)
	})

	// Known domains mode (multiple domains)
	test("returns true when all emails match one of multiple known domains", () => {
		const emails = ["bob@worktionary.com", "advisor@worktionary.ai"]
		expect(areWorkFriends(emails, ["worktionary.com", "worktionary.ai"])).toBe(
			true
		)
	})

	test("returns false when some emails do not match any known domain", () => {
		const emails = ["bob@worktionary.com", "external@gmail.com"]
		expect(areWorkFriends(emails, ["worktionary.com", "worktionary.ai"])).toBe(
			false
		)
	})

	test("handles mixed case domains correctly", () => {
		const emails = ["Bob@WORKTIONARY.COM", "sue@worktionary.com"]
		expect(areWorkFriends(emails, "WORKTIONARY.COM")).toBe(true)
	})

	// Clean usage patterns
	test("supports ternary usage", () => {
		const emails = ["user1@company.com", "user2@company.com"]
		const result = areWorkFriends(emails) ? "Internal" : "External"
		expect(result).toBe("Internal")
	})

	test("supports descriptive variable names", () => {
		const emails = ["user1@company.com", "user2@company.com"]
		const isInternalMeeting = areWorkFriends(emails)
		const sameUserOrg = areWorkFriends(emails)
		const fromSameDomain = areWorkFriends(emails)

		expect(isInternalMeeting).toBe(true)
		expect(sameUserOrg).toBe(true)
		expect(fromSameDomain).toBe(true)
	})
})

describe("isValidEmail", () => {
	test("validates correct email formats", () => {
		expect(isValidEmail("user@domain.com")).toBe(true)
		expect(isValidEmail("user.name@domain.co.uk")).toBe(true)
		expect(isValidEmail("user+tag@domain.com")).toBe(true)
	})

	test("rejects invalid email formats", () => {
		expect(isValidEmail("notanemail")).toBe(false)
		expect(isValidEmail("@domain.com")).toBe(false)
		expect(isValidEmail("user@")).toBe(false)
		expect(isValidEmail("user@domain")).toBe(false)
		expect(isValidEmail("user@@domain.com")).toBe(false)
		expect(isValidEmail("user@domain.")).toBe(false)
		expect(isValidEmail("user@.com")).toBe(false)
	})
})

describe("error handling", () => {
	describe("domain validation", () => {
		test("throws error for invalid domains", () => {
			try {
				areWorkFriends(
					["user@domain.com"],
					["valid.com", "invalid", "another.valid.com"]
				)
			} catch (error) {
				expect(error).toBeInstanceOf(WorkFriendsError)
				if (error instanceof WorkFriendsError) {
					expect(error.invalidDomains).toContain("invalid")
				}
			}
		})
	})

	describe("successful cases", () => {
		test("returns true for work friends", () => {
			const result = areWorkFriends(["user1@company.com", "user2@company.com"])
			expect(result).toBe(true)
		})

		test("validates against multiple known domains", () => {
			const result = areWorkFriends(
				["user1@company.com", "user2@subsidiary.com"],
				["company.com", "subsidiary.com"]
			)
			expect(result).toBe(true)
		})
	})
})

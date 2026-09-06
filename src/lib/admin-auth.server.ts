/** Server-only admin passcode check. */
export function assertAdmin(passcode?: string) {
  const expected = process.env["ADMIN_PASSCODE"];
  if (!expected) throw new Error("Admin passcode is not configured on the server.");
  if (!passcode || passcode !== expected) {
    throw new Error("Wrong admin passcode. Please unlock again.");
  }
}

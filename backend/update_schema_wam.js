// Run this using: mongosh "your_connection_string" update_schema_wam.js

print("\n--- MIGRATING SCHEMA: current_gpa -> wam ---");

// 1. Rename 'current_gpa' to 'wam' in all user documents
// The $rename operator updates the field name in place.
var result = db.users.updateMany(
    { current_gpa: { $exists: true } },
    { $rename: { "current_gpa": "wam" } }
);

print("Matched Users: " + result.matchedCount);
print("Modified Users: " + result.modifiedCount);

// 2. Verify the change for Sam
var sam = db.users.findOne({ user_id: "SAM2026" });
if (sam) {
    print("\nVerification for SAM2026:");
    print("WAM Field exists: " + (sam.wam !== undefined));
    print("WAM Value: " + sam.wam);
    print("Old GPA Field exists: " + (sam.current_gpa !== undefined));
} else {
    print("User SAM2026 not found for verification.");
}

print("\nMigration Complete.");

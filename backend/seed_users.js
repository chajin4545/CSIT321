// MongoDB/DocumentDB script to seed users
// Run this script in your MongoDB shell or via a client connected to your Azure DocumentDB instance.
// Ensure you are connected to the correct database.

const users = [
  {
    name: "Alex Student",
    role: "student",
    initials: "AS",
    userId: "2024001",
    email: "alex.student@university.edu",
    phone: "9123-4567",
    address: "123 Student Dorms, Campus",
    password: "password123", // In production, ensure this is hashed
    createdAt: new Date()
  },
  {
    name: "Dr. Sarah Smith",
    role: "professor",
    initials: "SS",
    userId: "PROF001",
    email: "sarah.smith@university.edu",
    phone: "9876-5432",
    address: "45 Faculty Housing, Campus",
    password: "password123",
    createdAt: new Date()
  },
  {
    name: "School Admin",
    role: "school_admin",
    initials: "AD",
    userId: "ADM001",
    email: "admin.school@university.edu",
    phone: "6666-7777",
    address: "Admin Block A",
    password: "password123",
    createdAt: new Date()
  },
  {
    name: "System Admin",
    role: "sys_admin",
    initials: "SA",
    userId: "SYS001",
    email: "admin.system@university.edu",
    phone: "1111-2222",
    address: "IT Department, Server Room",
    password: "password123",
    createdAt: new Date()
  }
];

// Insert into 'users' collection
db.users.insertMany(users);

print("Users seeded successfully!");

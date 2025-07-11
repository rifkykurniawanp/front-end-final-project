// 
// export type UserRole =
//   | "guest"
//   | "buyer"
//   | "student"
//   | "instructor"
//   | "supplier"
//   | "superadmin";

// export const RoleAccessMatrix = {
//   public: ["guest", "buyer", "student", "instructor", "supplier", "superadmin"],
//   dashboard: ["buyer", "student", "instructor", "supplier", "superadmin"],
//   course: ["student", "instructor", "superadmin"],
//   product: ["buyer", "supplier", "superadmin"],
//   adminCourses: ["instructor", "superadmin"],
//   adminProducts: ["supplier", "superadmin"],
//   adminUsers: ["superadmin"]
// } as const;

// export function hasRoleAccess(role: UserRole, accessKey: keyof typeof RoleAccessMatrix): boolean {
//   return RoleAccessMatrix[accessKey].includes(role);
// }

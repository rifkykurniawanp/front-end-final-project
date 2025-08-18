# API Routes Manual - Method Route Table

## Authentication & Users

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | User login | No | - |
| POST | `/api/auth/logout` | User logout | Yes | All |
| POST | `/api/auth/refresh` | Refresh access token | Yes | All |
| GET | `/api/auth/me` | Get current user profile | Yes | All |
| PUT | `/api/auth/me` | Update current user profile | Yes | All |
| PUT | `/api/auth/password` | Change password | Yes | All |

## Users Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/users` | Get all users | Yes | ADMIN |
| GET | `/api/users/{id}` | Get user by ID | Yes | ADMIN, Own User |
| POST | `/api/users` | Create new user | Yes | ADMIN |
| PUT | `/api/users/{id}` | Update user | Yes | ADMIN, Own User |
| DELETE | `/api/users/{id}` | Delete user | Yes | ADMIN |
| GET | `/api/users/{id}/orders` | Get user's orders | Yes | ADMIN, Own User |
| GET | `/api/users/{id}/enrollments` | Get user's course enrollments | Yes | ADMIN, Own User |

## Roles & Permissions

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/roles` | Get all roles | Yes | ADMIN |
| GET | `/api/roles/{id}` | Get role by ID | Yes | ADMIN |
| POST | `/api/roles` | Create new role | Yes | ADMIN |
| PUT | `/api/roles/{id}` | Update role | Yes | ADMIN |
| DELETE | `/api/roles/{id}` | Delete role | Yes | ADMIN |
| GET | `/api/permissions` | Get all permissions | Yes | ADMIN |
| POST | `/api/roles/{roleId}/permissions/{permissionId}` | Assign permission to role | Yes | ADMIN |
| DELETE | `/api/roles/{roleId}/permissions/{permissionId}` | Remove permission from role | Yes | ADMIN |

## Product Categories

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/product-categories` | Get all product categories | No | - |
| GET | `/api/product-categories/{id}` | Get category by ID | No | - |
| GET | `/api/product-categories/slug/{slug}` | Get category by slug | No | - |
| POST | `/api/product-categories` | Create new category | Yes | ADMIN, SUPPLIER |
| PUT | `/api/product-categories/{id}` | Update category | Yes | ADMIN, SUPPLIER |
| DELETE | `/api/product-categories/{id}` | Delete category | Yes | ADMIN |
| GET | `/api/product-categories/{id}/children` | Get subcategories | No | - |

## Products Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/products` | Get all products (with filters) | No | - |
| GET | `/api/products/{id}` | Get product by ID | No | - |
| GET | `/api/products/slug/{slug}` | Get product by slug | No | - |
| POST | `/api/products` | Create new product | Yes | ADMIN, SUPPLIER |
| PUT | `/api/products/{id}` | Update product | Yes | ADMIN, Own SUPPLIER |
| DELETE | `/api/products/{id}` | Delete product | Yes | ADMIN, Own SUPPLIER |
| GET | `/api/products/search` | Search products | No | - |
| GET | `/api/products/category/{categoryId}` | Get products by category | No | - |
| GET | `/api/products/supplier/{supplierId}` | Get products by supplier | No | - |

## Product Tags & Reviews

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/products/{id}/tags` | Get product tags | No | - |
| POST | `/api/products/{id}/tags` | Add product tag | Yes | ADMIN, Own SUPPLIER |
| DELETE | `/api/products/{productId}/tags/{tagId}` | Remove product tag | Yes | ADMIN, Own SUPPLIER |
| GET | `/api/products/{id}/reviews` | Get product reviews | No | - |
| POST | `/api/products/{id}/reviews` | Add product review | Yes | USER (Buyer) |
| PUT | `/api/reviews/{id}` | Update review | Yes | ADMIN, Own USER |
| DELETE | `/api/reviews/{id}` | Delete review | Yes | ADMIN, Own USER |

## Orders Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/orders` | Get all orders | Yes | ADMIN |
| GET | `/api/orders/{id}` | Get order by ID | Yes | ADMIN, Own USER |
| POST | `/api/orders` | Create new order | Yes | USER (Buyer) |
| PUT | `/api/orders/{id}` | Update order status | Yes | ADMIN, SUPPLIER |
| DELETE | `/api/orders/{id}` | Cancel order | Yes | ADMIN, Own USER |
| GET | `/api/orders/{id}/items` | Get order items | Yes | ADMIN, Own USER |
| GET | `/api/orders/user/{userId}` | Get orders by user | Yes | ADMIN, Own USER |
| GET | `/api/orders/supplier/{supplierId}` | Get orders by supplier | Yes | ADMIN, Own SUPPLIER |

## Course Categories

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/course-categories` | Get all course categories | No | - |
| GET | `/api/course-categories/{id}` | Get category by ID | No | - |
| GET | `/api/course-categories/slug/{slug}` | Get category by slug | No | - |
| POST | `/api/course-categories` | Create new category | Yes | ADMIN |
| PUT | `/api/course-categories/{id}` | Update category | Yes | ADMIN |
| DELETE | `/api/course-categories/{id}` | Delete category | Yes | ADMIN |

## Courses Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/courses` | Get all courses (with filters) | No | - |
| GET | `/api/courses/{id}` | Get course by ID | No | - |
| GET | `/api/courses/slug/{slug}` | Get course by slug | No | - |
| POST | `/api/courses` | Create new course | Yes | ADMIN, INSTRUCTOR |
| PUT | `/api/courses/{id}` | Update course | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/courses/{id}` | Delete course | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/courses/search` | Search courses | No | - |
| GET | `/api/courses/category/{categoryId}` | Get courses by category | No | - |
| GET | `/api/courses/instructor/{instructorId}` | Get courses by instructor | No | - |

## Course Enrollments

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/enrollments` | Get all enrollments | Yes | ADMIN |
| GET | `/api/enrollments/{id}` | Get enrollment by ID | Yes | ADMIN, Own USER |
| POST | `/api/courses/{courseId}/enroll` | Enroll in course | Yes | USER (Student) |
| DELETE | `/api/enrollments/{id}` | Unenroll from course | Yes | ADMIN, Own USER |
| GET | `/api/courses/{courseId}/enrollments` | Get course enrollments | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/users/{userId}/enrollments` | Get user enrollments | Yes | ADMIN, Own USER |
| PUT | `/api/enrollments/{id}/progress` | Update course progress | Yes | System |
| POST | `/api/enrollments/{id}/certificate` | Issue certificate | Yes | System |

## Course Content Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/courses/{id}/tags` | Get course tags | No | - |
| POST | `/api/courses/{id}/tags` | Add course tag | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/courses/{courseId}/tags/{tagId}` | Remove course tag | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/courses/{id}/requirements` | Get course requirements | No | - |
| POST | `/api/courses/{id}/requirements` | Add course requirement | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/requirements/{id}` | Update requirement | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/requirements/{id}` | Delete requirement | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/courses/{id}/outcomes` | Get learning outcomes | No | - |
| POST | `/api/courses/{id}/outcomes` | Add learning outcome | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/outcomes/{id}` | Update learning outcome | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/outcomes/{id}` | Delete learning outcome | Yes | ADMIN, Own INSTRUCTOR |

## Course Modules & Lessons

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/courses/{courseId}/modules` | Get course modules | Yes | Enrolled USER, INSTRUCTOR |
| GET | `/api/modules/{id}` | Get module by ID | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/courses/{courseId}/modules` | Create new module | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/modules/{id}` | Update module | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/modules/{id}` | Delete module | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/modules/{moduleId}/lessons` | Get module lessons | Yes | Enrolled USER, INSTRUCTOR |
| GET | `/api/lessons/{id}` | Get lesson by ID | Yes | Enrolled USER, INSTRUCTOR |
| GET | `/api/lessons/slug/{slug}` | Get lesson by slug | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/modules/{moduleId}/lessons` | Create new lesson | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/lessons/{id}` | Update lesson | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/lessons/{id}` | Delete lesson | Yes | ADMIN, Own INSTRUCTOR |

## Lesson Progress

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/lessons/{lessonId}/progress` | Get lesson progress | Yes | ADMIN, Own USER |
| POST | `/api/lessons/{lessonId}/complete` | Mark lesson as completed | Yes | USER (Student) |
| POST | `/api/lessons/{lessonId}/bookmark` | Bookmark lesson | Yes | USER (Student) |
| DELETE | `/api/lessons/{lessonId}/bookmark` | Remove bookmark | Yes | USER (Student) |
| GET | `/api/users/{userId}/progress` | Get user's learning progress | Yes | ADMIN, Own USER |

## Quizzes Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/lessons/{lessonId}/quiz` | Get lesson quiz | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/lessons/{lessonId}/quiz` | Create quiz for lesson | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/quizzes/{id}` | Update quiz | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/quizzes/{id}` | Delete quiz | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/quizzes/{id}/questions` | Get quiz questions | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/quizzes/{id}/questions` | Add quiz question | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/questions/{id}` | Update quiz question | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/questions/{id}` | Delete quiz question | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/questions/{id}/choices` | Get question choices | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/questions/{id}/choices` | Add answer choice | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/choices/{id}` | Update answer choice | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/choices/{id}` | Delete answer choice | Yes | ADMIN, Own INSTRUCTOR |

## Quiz Attempts

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/quizzes/{quizId}/attempts` | Get quiz attempts | Yes | ADMIN, Own INSTRUCTOR |
| POST | `/api/quizzes/{quizId}/attempt` | Submit quiz attempt | Yes | USER (Student) |
| GET | `/api/attempts/{id}` | Get attempt details | Yes | ADMIN, INSTRUCTOR, Own USER |
| GET | `/api/users/{userId}/attempts` | Get user's quiz attempts | Yes | ADMIN, Own USER |

## Assignments Management

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/lessons/{lessonId}/assignments` | Get lesson assignments | Yes | Enrolled USER, INSTRUCTOR |
| GET | `/api/assignments/{id}` | Get assignment by ID | Yes | Enrolled USER, INSTRUCTOR |
| POST | `/api/lessons/{lessonId}/assignments` | Create new assignment | Yes | ADMIN, Own INSTRUCTOR |
| PUT | `/api/assignments/{id}` | Update assignment | Yes | ADMIN, Own INSTRUCTOR |
| DELETE | `/api/assignments/{id}` | Delete assignment | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/assignments/{id}/submissions` | Get assignment submissions | Yes | ADMIN, Own INSTRUCTOR |
| POST | `/api/assignments/{id}/submit` | Submit assignment | Yes | USER (Student) |
| PUT | `/api/submissions/{id}` | Update submission | Yes | ADMIN, Own USER |
| DELETE | `/api/submissions/{id}` | Delete submission | Yes | ADMIN, Own USER |
| PUT | `/api/submissions/{id}/grade` | Grade submission | Yes | ADMIN, Own INSTRUCTOR |

## Certificates

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/certificates` | Get all certificates | Yes | ADMIN |
| GET | `/api/certificates/{id}` | Get certificate by ID | Yes | ADMIN, Own USER |
| POST | `/api/certificates/generate` | Generate certificate | Yes | System |
| GET | `/api/users/{userId}/certificates` | Get user certificates | Yes | ADMIN, Own USER |
| GET | `/api/courses/{courseId}/certificates` | Get course certificates | Yes | ADMIN, Own INSTRUCTOR |
| GET | `/api/certificates/{id}/download` | Download certificate | Yes | ADMIN, Own USER |

## Payments

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/payments` | Get all payments | Yes | ADMIN |
| GET | `/api/payments/{id}` | Get payment by ID | Yes | ADMIN, Own USER |
| POST | `/api/payments` | Create payment record | Yes | USER |
| PUT | `/api/payments/{id}` | Update payment status | Yes | ADMIN |
| GET | `/api/users/{userId}/payments` | Get user payments | Yes | ADMIN, Own USER |
| POST | `/api/payments/{id}/verify` | Verify payment | Yes | ADMIN |
| POST | `/api/payments/webhook` | Payment gateway webhook | No | System |

## Dashboard & Analytics

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/dashboard/admin` | Admin dashboard data | Yes | ADMIN |
| GET | `/api/dashboard/instructor` | Instructor dashboard data | Yes | INSTRUCTOR |
| GET | `/api/dashboard/supplier` | Supplier dashboard data | Yes | SUPPLIER |
| GET | `/api/dashboard/user` | User dashboard data | Yes | USER |
| GET | `/api/analytics/sales` | Sales analytics | Yes | ADMIN, SUPPLIER |
| GET | `/api/analytics/courses` | Course analytics | Yes | ADMIN, INSTRUCTOR |
| GET | `/api/analytics/users` | User analytics | Yes | ADMIN |

## File Upload

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| POST | `/api/upload/image` | Upload image file | Yes | All |
| POST | `/api/upload/video` | Upload video file | Yes | INSTRUCTOR |
| POST | `/api/upload/document` | Upload document | Yes | All |
| DELETE | `/api/upload/{filename}` | Delete uploaded file | Yes | ADMIN, Owner |

## Notifications

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/notifications` | Get user notifications | Yes | All |
| PUT | `/api/notifications/{id}/read` | Mark notification as read | Yes | Own USER |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes | All |
| DELETE | `/api/notifications/{id}` | Delete notification | Yes | Own USER |

## System Configuration

| Method | Route | Description | Auth Required | Roles |
|--------|-------|-------------|---------------|-------|
| GET | `/api/config` | Get system configuration | Yes | ADMIN |
| PUT | `/api/config` | Update system configuration | Yes | ADMIN |
| GET | `/api/health` | System health check | No | - |
| GET | `/api/version` | Get API version | No | - |

---

## Route Parameters Legend

- `{id}` - Entity ID (integer)
- `{slug}` - URL-friendly string identifier
- `{userId}` - User ID
- `{courseId}` - Course ID  
- `{productId}` - Product ID
- `{orderId}` - Order ID
- `{lessonId}` - Lesson ID
- `{quizId}` - Quiz ID
- `{assignmentId}` - Assignment ID

## Auth Roles Explanation

- **ADMIN** - Full system access
- **SUPPLIER** - Can manage own products and view related orders
- **INSTRUCTOR** - Can manage own courses and view enrollments
- **USER** - Basic user with buyer/student capabilities
- **Own USER/INSTRUCTOR/SUPPLIER** - Can only access their own resources
- **Enrolled USER** - Can only access courses they are enrolled in
- **System** - Internal system operations

## HTTP Status Codes

- **200** - OK (Success)
- **201** - Created (Resource created successfully)
- **204** - No Content (Success with no response body)
- **400** - Bad Request (Invalid request data)
- **401** - Unauthorized (Authentication required)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Resource not found)
- **409** - Conflict (Resource already exists)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error (Server error)
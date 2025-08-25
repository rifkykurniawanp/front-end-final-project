# TypeScript Types Structure Tree

```
types/
├── index.ts                     # Barrel export for all types
│
├── enum.ts                      # Shared Enums
│   ├── RoleName
│   ├── ProductCategory
│   ├── ProductOrigin
│   ├── ProductStatus
│   ├── ProductTagName
│   ├── CourseCategory
│   ├── CourseLevel
│   ├── CartItemType
│   ├── LessonType
│   ├── PayableType
│   ├── PaymentStatus
│   ├── OrderStatus
│   └── EnrollmentStatus
│
├── user.ts                      # User Management
│   ├── User
│   ├── UserWithRelations
│   ├── CreateUserDto
│   ├── UpdateUserDto
│   ├── LoginDto
│   └── AuthResponse
│
├── product.ts                   # Product & Reviews
│   ├── Product
│   ├── ProductWithRelations
│   ├── ProductReview
│   ├── CreateProductDto
│   ├── UpdateProductDto
│   ├── CreateProductReviewDto
│   ├── UpdateProductReviewDto
│   ├── ProductResponseDto
│   ├── ProductFilterDto
│   ├── FilterState
│   ├── ProductReviewResponseDto
│   └── ProductReviewsStats
│
├── course.ts                    # Core Course Types
│   ├── Instructor
│   ├── Course
│   ├── CourseWithRelations
│   ├── CreateCourseDto
│   ├── UpdateCourseDto
│   ├── CourseResponseDto
│   ├── CoursePaginationParams
│   └── PaginatedResponse<T>
│
├── course-module.ts             # Course Modules
│   ├── CourseModule
│   ├── CreateCourseModuleDto
│   └── UpdateCourseModuleDto
│
├── course-enrollment.ts         # Course Enrollments
│   ├── CourseEnrollment
│   ├── EnrollCourseDto
│   └── UpdateEnrollmentDto
│
├── lesson.ts                    # Lessons
│   ├── Lesson
│   ├── CreateLessonDto
│   ├── UpdateLessonDto
│   ├── LessonResponseDto
│   └── LessonWithRelations
│
├── lesson-progress.ts           # Lesson Progress Tracking
│   ├── LessonProgress
│   ├── LessonProgressResponseDto
│   ├── CreateLessonProgressDto
│   └── LessonProgressParams
│
├── assignment.ts                # Assignments & Submissions
│   ├── Assignment
│   ├── AssignmentSubmission
│   ├── CreateAssignmentDto
│   ├── UpdateAssignmentDto
│   ├── CreateAssignmentSubmissionDto
│   ├── CreateAssignmentSubmissionDtoAlt
│   ├── UpdateAssignmentSubmissionDto
│   ├── GradeAssignmentSubmissionDto
│   ├── AssignmentSubmissionStats
│   └── AssignmentSubmissionList
│
├── certificate.ts              # Certificates
│   ├── Certificate
│   └── IssueCertificateDto
│
├── cart.ts                      # Shopping Cart
│   ├── Cart
│   ├── CartItem
│   ├── AddToCartDto
│   ├── UpdateCartDto
│   ├── CartWithItems
│   ├── CartItemWithDetails
│   ├── CartSummary
│   └── CartItemSummary
│
├── payment.ts                   # Payment Processing
│   ├── Payment
│   ├── CreatePaymentDto
│   ├── UpdatePaymentDto
│   ├── CancelPaymentDto
│   ├── PaymentStatsDto
│   ├── UserBasicDto
│   ├── CartBasicDto
│   ├── ProductOrderDto
│   ├── CourseEnrollmentDto
│   └── PaymentResponseDto
│
└── order.ts                     # Product Orders
    ├── ProductOrder
    ├── ProductOrderItem
    ├── CreateProductOrderDto
    ├── CreateProductOrderItemDto
    ├── UpdateProductOrderDto
    ├── OrderFilterParams
    ├── OrderFilterDto
    ├── ProductOrderWithDetails
    ├── ProductOrderItemWithDetails
    ├── OrderSummary
    ├── OrderTracking
    ├── OrderStatusHistory
    ├── ProductOrderResponseDto
    └── ProductOrderItemResponseDto
```

## Type Dependencies

```
Core Dependencies:
enum.ts → (imported by all other files)

User Domain:
user.ts → (used by product.ts, course.ts, cart.ts, payment.ts, order.ts)

Product Domain:
product.ts → user.ts, enum.ts
order.ts → product.ts, user.ts, payment.ts, enum.ts

Course Domain:
course.ts → enum.ts
course-module.ts → lesson.ts
course-enrollment.ts → enum.ts
lesson.ts → enum.ts
lesson-progress.ts → (no dependencies)
assignment.ts → (no dependencies)
certificate.ts → (no dependencies)

E-commerce Domain:
cart.ts → user.ts, product.ts, course.ts, payment.ts, enum.ts
payment.ts → user.ts, cart.ts, order.ts, course-enrollment.ts, enum.ts
```

## Usage Examples

```typescript
// Import specific types
import { User, CreateUserDto } from './types/user';
import { Product, ProductCategory } from './types/product';
import { Course, CourseLevel } from './types/course';

// Import from barrel export
import { 
  User, 
  CreateUserDto, 
  Product, 
  ProductCategory,
  Course,
  CourseLevel 
} from './types';

// Import enums
import { 
  RoleName, 
  ProductStatus, 
  PaymentStatus, 
  OrderStatus 
} from './types/enum';
```

## File Statistics

| File | Types Count | Primary Purpose |
|------|-------------|-----------------|
| enum.ts | 10 enums | Shared constants |
| user.ts | 6 types | User management |
| product.ts | 12 types | Product catalog & reviews |
| course.ts | 8 types | Course management |
| course-module.ts | 3 types | Course structure |
| course-enrollment.ts | 3 types | Student enrollments |
| lesson.ts | 5 types | Lesson content |
| lesson-progress.ts | 4 types | Progress tracking |
| assignment.ts | 10 types | Assignments & submissions |
| certificate.ts | 2 types | Certification |
| cart.ts | 8 types | Shopping cart |
| payment.ts | 10 types | Payment processing |
| order.ts | 14 types | Order management |
| **Total** | **95 types** | **Complete type system** |
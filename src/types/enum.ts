// ================= ENUMS =================

export enum RoleName {
  ADMIN = 'ADMIN',
  SUPPLIER = 'SUPPLIER',
  INSTRUCTOR = 'INSTRUCTOR',
  USER = 'USER'
}

export enum ProductCategory {
  COFFEE = 'COFFEE',
  TEA = 'TEA',
  HERBAL = 'HERBAL',
  EQUIPMENT = 'EQUIPMENT'
}

export enum ProductOrigin {
  INDONESIA = 'INDONESIA',
  VIETNAM = 'VIETNAM',
  BRAZIL = 'BRAZIL',
  ETHIOPIA = 'ETHIOPIA',
  OTHER = 'OTHER'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DRAFT = 'DRAFT'
}

export enum ProductTagName {
  ARABICA = 'ARABICA',
  ROBUSTA = 'ROBUSTA',
  GREEN_TEA = 'GREEN_TEA',
  HERBAL = 'HERBAL',
  EQUIPMENT = 'EQUIPMENT'
}

export enum CourseCategory {
  COFFEE_BREWING = 'COFFEE_BREWING',
  TEA_TASTING = 'TEA_TASTING',
  HERBAL_HEALTH = 'HERBAL_HEALTH'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum CartItemType {
  PRODUCT = 'PRODUCT',
  COURSE = 'COURSE'
}

export enum LessonType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT'
}

export enum PayableType {
  PRODUCT = 'PRODUCT',
  COURSE = 'COURSE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
import {
  sqliteTable,
  text,
  integer,
  real
} from "drizzle-orm/sqlite-core";

// Basic Users table for Better Auth
export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: 'boolean' }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).notNull(),
  role: text("role").notNull(), // Fleet Manager, Driver, Safety Officer, Financial Analyst
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: 'timestamp' }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: 'timestamp' }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: 'timestamp' }).notNull(),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: 'timestamp' }).notNull(),
  createdAt: integer("createdAt", { mode: 'timestamp' }),
  updatedAt: integer("updatedAt", { mode: 'timestamp' }),
});

export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  registrationNumber: text("registration_number").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  maxLoadCapacity: real("max_load_capacity").notNull(), // in kg
  odometer: real("odometer").notNull().default(0),
  acquisitionCost: real("acquisition_cost").notNull(),
  status: text("status", { enum: ["Available", "On Trip", "In Shop", "Retired"] }).default("Available").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const twoFactor = sqliteTable("twoFactor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backupCodes").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});

export const drivers = sqliteTable("drivers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  licenseCategory: text("license_category").notNull(),
  licenseExpiryDate: integer("license_expiry_date", { mode: 'timestamp' }).notNull(),
  contactNumber: text("contact_number").notNull(),
  safetyScore: integer("safety_score").default(100).notNull(),
  status: text("status", { enum: ["Available", "On Trip", "Off Duty", "Suspended"] }).default("Available").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const trips = sqliteTable("trips", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  driverId: text("driver_id").notNull().references(() => drivers.id),
  cargoWeight: real("cargo_weight").notNull(),
  plannedDistance: real("planned_distance").notNull(),
  status: text("status", { enum: ["Draft", "Dispatched", "Completed", "Cancelled"] }).default("Draft").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const maintenanceLogs = sqliteTable("maintenance_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  description: text("description").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  isOpen: integer("is_open", { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const fuelLogs = sqliteTable("fuel_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  liters: real("liters").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id").notNull().references(() => vehicles.id),
  description: text("description").notNull(),
  cost: real("cost").notNull(),
  date: integer("date", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

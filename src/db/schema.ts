import { roles } from "@/lib/roles";
import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const baseFields = {
	id: uuid().primaryKey().notNull().defaultRandom(),
	date_created: timestamp().notNull().defaultNow(),
	date_modified: timestamp().notNull().defaultNow(),
	is_deleted: boolean().notNull().default(false),
};

export const rolesEnum = pgEnum("roles", roles);

// MARK: TABLES

export const users = pgTable("users", {
	...baseFields,
	email: varchar({ length: 255 }).notNull(),
	last_name: varchar({ length: 255 }).notNull(),
	first_name: varchar({ length: 255 }).notNull(),
	role: rolesEnum(),
});

export const classes = pgTable("classes", {
	...baseFields,
	name: varchar({ length: 255 }).notNull(),
});

export const users_to_classes = pgTable("users_classes", {
	user_id: uuid()
		.notNull()
		.references(() => users.id),
	class_id: uuid()
		.notNull()
		.references(() => classes.id),
});

export const problems = pgTable("problems", {
	...baseFields,
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	deadline: timestamp().notNull(),
	max_score: integer().notNull().default(0),
	class_id: uuid()
		.notNull()
		.references(() => classes.id),
	author_id: uuid()
		.notNull()
		.references(() => users.id),
});

export const solutions = pgTable("solutions", {
	...baseFields,
	submitted: boolean().notNull().default(false),
	code: text().notNull().default(""),
	score: integer(),
	problem_id: uuid()
		.notNull()
		.references(() => problems.id),
	author_id: uuid()
		.notNull()
		.references(() => users.id),
});

// MARK: RELATIONS

export const user_relations = relations(users, ({ many }) => ({
	classes: many(users_to_classes),
	problems: many(problems),
	solutions: many(solutions),
}));

export const class_relations = relations(classes, ({ many }) => ({
	users: many(users_to_classes),
	problems: many(problems),
}));

export const users_to_classes_relations = relations(users_to_classes, ({ one }) => ({
	user: one(users, { fields: [users_to_classes.user_id], references: [users.id] }),
	class: one(classes, { fields: [users_to_classes.class_id], references: [classes.id] }),
}));

export const problems_relations = relations(problems, ({ one, many }) => ({
	class: one(classes, { fields: [problems.class_id], references: [classes.id] }),
	author: one(users, { fields: [problems.author_id], references: [users.id] }),
	solutions: many(solutions),
}));

export const solutions_relations = relations(solutions, ({ one }) => ({
	problem: one(problems, { fields: [solutions.problem_id], references: [problems.id] }),
	author: one(users, { fields: [solutions.author_id], references: [users.id] }),
}));

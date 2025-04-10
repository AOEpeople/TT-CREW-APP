import { relations, sql } from "drizzle-orm";

import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull(),
});

export const players = sqliteTable("players", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  createdBy: integer("createdBy").notNull(),
  rating: integer("rating"),
  priority: integer("priority").notNull().default(9999),
  status: text({ enum: ["ACTIVE", "INACTIVE", "HALL_OF_FAME"] }).default(
    "ACTIVE",
  ),
});

export const ratings = sqliteTable("ratings", {
  id: integer("id").primaryKey(),
  averageSkill: real("averageSkill").default(25),
  uncertainty: real("uncertainty").default(8.3),
  player: integer("player").notNull(),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  enteredBy: integer("enteredBy").notNull(),
});

export type WonLost = "WON" | "LOST";

export const playerMatches = sqliteTable("playerMatches", {
  id: integer("id").primaryKey(),
  type: text({ enum: ["WON", "LOST"] }).notNull(),
  match: integer("match").notNull(),
  player: integer("player").notNull(),
});

export const monthResult = sqliteTable("monthResult", {
  id: integer("id").primaryKey(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  enteredBy: integer("enteredBy").notNull(),
});

export const monthResultPlayers = sqliteTable("monthResultPlayers", {
  id: integer("id").primaryKey(),
  monthResult: integer("monthResult").notNull(),
  player: integer("player").notNull(),
  points: integer("points").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  players: many(players),
}));

export const ratingRelations = relations(ratings, ({ one }) => ({
  player: one(players, {
    fields: [ratings.player],
    references: [players.rating],
  }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.createdBy],
    references: [users.id],
  }),
  rating: one(ratings, {
    fields: [players.rating],
    references: [ratings.id],
  }),
  playerMatches: many(playerMatches, { relationName: "playerMatchesToPlayer" }),
  monthResultPlayers: many(monthResultPlayers, {
    relationName: "monthResultPlayerToPlayer",
  }),
}));

export const playerMatchesRelations = relations(playerMatches, ({ one }) => ({
  player: one(players, {
    fields: [playerMatches.player],
    references: [players.id],
    relationName: "playerMatchesToPlayer",
  }),
  matches: one(matches, {
    fields: [playerMatches.match],
    references: [matches.id],
    relationName: "playerMatchesToMatch",
  }),
}));

export const matchesRelations = relations(matches, ({ many }) => ({
  playerMatches: many(playerMatches, { relationName: "playerMatchesToMatch" }),
}));

export const monthResultRelations = relations(monthResult, ({ many }) => ({
  monthResultPlayers: many(monthResultPlayers, {
    relationName: "monthResultPlayerToMonthResult",
  }),
}));

export const monthResultPlayersRelations = relations(
  monthResultPlayers,
  ({ one }) => ({
    player: one(players, {
      fields: [monthResultPlayers.player],
      references: [players.id],
      relationName: "monthResultPlayerToPlayer",
    }),
    monthResult: one(monthResult, {
      fields: [monthResultPlayers.monthResult],
      references: [monthResult.id],
      relationName: "monthResultPlayerToMonthResult",
    }),
  }),
);

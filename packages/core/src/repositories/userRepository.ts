import { LibSQLDatabase } from "drizzle-orm/libsql";
import { schema } from "../db";

export class UserRepository {
  constructor(private db: LibSQLDatabase<typeof schema>) {}

  async getOrCreateDefaultUser(): Promise<{ id: number; username: string }> {
    const user = await this.db.query.users.findFirst();

    if (!user) {
      const [newUser] = await this.db
        .insert(schema.users)
        .values({ username: "default" })
        .returning({ id: schema.users.id, username: schema.users.username });
      return newUser;
    }

    return user;
  }
} 
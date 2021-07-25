import { User } from "./entities/User";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "test",
  user: "postgres",
  password: "postgres",
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];

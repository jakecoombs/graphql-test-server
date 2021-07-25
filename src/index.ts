import { MyContext } from "src/types";
import "reflect-metadata";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.set("trust proxy", 1);

  app.use(
    cors({
      credentials: true,
      origin: [
        "https://studio.apollographql.com",
        "http://localhost:4000",
        "http://localhost:3000",
        "http://127.0.0.1",
      ],
    })
  );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax",
        secure: __prod__,
        httpOnly: true,
      },
      saveUninitialized: false,
      secret: "sldewflkmqwerfkwmsfkem",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main();

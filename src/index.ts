import "dotenv/config";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "GymHabitsAI API",
      description: "API for GymHabitsAI application",
      version: "1.0.0",
    },
    servers: [
      { description: "Development server", url: "http://localhost:8080" },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Health check endpoint",
    tags: ["Health Check"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return {
      message: "Server is running",
    };
  },
});

try {
  await app.listen({ port: Number(process.env.PORT) ?? 8081 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

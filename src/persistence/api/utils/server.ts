// src/server.js
import { createServer, Model } from "miragejs";
import { factories } from "./factories";

function makeServer({ environment = "test" } = {}) {
  const server = createServer({
    environment,

    models: {
      todo: Model,
    },
    factories,

    seeds(server) {
      server.createList("todo", 3);
    },

    routes() {
      this.namespace = "api";

      this.get("/todos", (schema) => {
        // @ts-expect-error - testing
        return schema.todos.all();
      });

      this.delete("/todos/:id");
      this.patch("/todos/:id", (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);

        // @ts-expect-error testing
        const todo = schema.todos.find(id);
        return todo.update(attrs);
      });

      this.post("/todos", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        // @ts-expect-error testing
        return schema.todos.create(attrs);
      });
    },
  });

  return server;
}

let serverStarted = false;
function startServer() {
  if (serverStarted) {
    return;
  }

  serverStarted = true;
  makeServer({ environment: "development" });
}

export { startServer };

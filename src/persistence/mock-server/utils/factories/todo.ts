import { Factory } from "miragejs";
import { faker } from "@faker-js/faker";

export const TodoFactory = Factory.extend({
  text() {
    return faker.lorem.sentence();
  },
});

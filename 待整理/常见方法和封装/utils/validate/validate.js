import Schema from "async-validator";

const descriptor = {
  name: {
    type: "string",
    required: true,
    validator: (rule, value) => /^(.*){1,10}$/.test(value),
  },
  age: {
    type: "number",
  },
};

const validator = new Schema(descriptor);

validator
  .validate()
  .then(() => {})
  .catch(() => {});

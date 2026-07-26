// grpc-client.js
//
// Loads the shared todo.proto at runtime and exposes promisified wrappers
// around the four RPCs. No code generation step on the JS side — proto-loader
// builds the message types in memory.

const path = require("path");
const { promisify } = require("util");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.resolve(__dirname, "../proto/todo.proto");
const SERVER_ADDR = process.env.GRPC_SERVER || "localhost:50051";

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: Number,   // int64 → JS number (fine for small ids)
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef).todo;

const client = new proto.TodoService(
  SERVER_ADDR,
  grpc.credentials.createInsecure()
);

// Wrap each unary RPC in a Promise so the Express handlers can `await`.
module.exports = {
  listTodos:  promisify(client.listTodos.bind(client)),
  createTodo: promisify(client.createTodo.bind(client)),
  toggleTodo: promisify(client.toggleTodo.bind(client)),
  deleteTodo: promisify(client.deleteTodo.bind(client)),
};

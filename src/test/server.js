import { rest } from "msw";
import { setupServer } from "msw/node";

export const createServer = (configs) => {
  const handlers = configs.map((config) => {
    return rest[config.method || "get"](config.path, (req, res, ctx) => {
      return config.res(req, res, ctx);
    });
  });

  const server = setupServer(...handlers);

  // Enable request interception.
  beforeAll(() => server.listen());

  // Reset handlers so that each test could alter them
  // without affecting other, unrelated tests.
  afterEach(() => {
    server.resetHandlers();
  });

  // Don't forget to clean up afterwards.
  afterAll(() => server.close());
};

// NOTE: The below is the actual code, we made below code reusable as above.
// import { rest } from "msw";
// import { setupServer } from "msw/node";
// const handlers = [
//     // If URL orignated from same port, just use /users. Since external URL, use full URL
//     rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
//       return res(
//         ctx.json([
//           {
//             id: "43",
//             name: "Chandrahas Balleda",
//             email: "chandrahaswtw@gmail.com",
//           },
//           {
//             id: "44",
//             name: "Vikram seth",
//             email: "vikram.seth@gmail.com",
//           },
//         ])
//       );
//     }),
//   ];

//   const server = setupServer(...handlers);

//   // Enable request interception.
//   beforeAll(() => server.listen());

//   // Reset handlers so that each test could alter them
//   // without affecting other, unrelated tests.
//   afterEach(() => server.resetHandlers());

//   // Don't forget to clean up afterwards.
//   afterAll(() => server.close());

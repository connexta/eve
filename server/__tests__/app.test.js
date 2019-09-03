const request = require("supertest");
const app = require("../app.js");

describe("GET ", () => {
  describe("/theme ", () => {
    test("with empty query (No wallboard or component)", async () => {
      const response = await request(app).get("/theme");
      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(200);
    }),
      test("with existing query (wallboard=TV & component=BANNER)", async () => {
        const response = await request(app).get(
          "/theme?wallboard=TV&component=BANNER"
        );
        expect(response.body).toEqual(expect.not.objectContaining({}));
        expect(response.statusCode).toBe(200);
      }),
      test("with non-existing query (wallboard=Fake & component=Fake)", async () => {
        const response = await request(app).get(
          "/theme?wallboard=Fake&component=Fake"
        );
        expect(response.body).toEqual({});
        expect(response.statusCode).toBe(200);
      });
  });
});

describe("POST ", () => {
  describe("/theme ", () => {
    const data = {
      data: "connexta/eve"
    };
    test("with empty query (No wallboard or component)", async () => {
      return request(app)
        .post("/theme")
        .send(data)
        .then(res => {
          expect(res.statusCode).toBe(200);
        });
    }),
      test("with existing query (wallboard=TV & component=GITHUB)", async () => {
        return request(app)
          .post("/theme?wallboard=TV&component=GITHUB")
          .send(data)
          .then(res => {
            expect(res.statusCode).toBe(200);
            return request(app).get("/theme?wallboard=TV&component=GITHUB");
          })
          .then(res => {
            let returnedData = res.body.data;
            expect(returnedData).toBe(data.data);
          });
      });
  });
});

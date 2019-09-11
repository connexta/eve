const request = require("supertest");
const app = require("../app.js");

describe("GET ", () => {
  describe("/theme ", () => {
    test("with empty query (No wallboard, component, id)", async () => {
      const response = await request(app).get("/theme");
      expect(response.body).toEqual({});
      expect(response.statusCode).toBe(200);
    }),
      test("with existing query (wallboard=HOME & component=BANNER, id=Guest)", async () => {
        const response = await request(app).get(
          "/theme?wallboard=HOME&component=BANNER&id=Guest"
        );
        expect(response.body).toEqual(expect.not.objectContaining({}));
        expect(response.statusCode).toBe(200);
      }),
      test("with non-existing query (wallboard=Fake & component=Fake & id=Fake)", async () => {
        const response = await request(app).get(
          "/theme?wallboard=Fake&component=Fake&id=Fake"
        );
        expect(response.body).toEqual({});
        expect(response.statusCode).toBe(200);
      });
  });
  describe("/checkadmin ", () => {
    test("with non-existing query (id)", async () => {
      const response = await request(app).get("/checkadmin?id=c2a366b7-3eb2-43d4-9b1b-8a28bbd7b27c");
      expect(response.body).toEqual({ result: false });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("POST ", () => {
  describe("/theme ", () => {
    const data = {
      data: "connexta/eve"
    };
    test("with empty query (No wallboard, component, id)", async () => {
      return request(app)
        .post("/theme")
        .send(data)
        .then(res => {
          expect(res.statusCode).toBe(200);
        });
    }),
      test("with existing query (wallboard=TV & component=BANNER, id=Guest)", async () => {
        return request(app)
          .post("/theme?wallboard=TV&component=BANNER&id=Guest")
          .send(data)
          .then(res => {
            expect(res.statusCode).toBe(200);
            return request(app).get(
              "/theme?wallboard=TV&component=BANNER&id=Guest"
            );
          })
          .then(res => {
            let returnedData = res.body.data;
            expect(returnedData).toBe(data.data);
          });
      });
  });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const usersController = require("../users.controller");
const app = require("../../app").app;

before((done) => {
  usersController.registerUser("vicent", "1234");
  done();
});


describe('Suite de prueba de auth', () => {
    it('should return 401 when jtw token avaiable', (done) => {
        chai.request(app)
        .get('/teams')
        .end((err, res) => {
            chai.assert.equal(res.statusCode, 401);
            done();
        });
    });

    it("should return 400 when no data is provided", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .end((err, res) => {
          //Expect valid login
          chai.assert.equal(res.statusCode, 400);
          done();
        });
    });

    it("should return 200 and token for succesful login", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({ user: "vicent", password: "1234" })
        .end((err, res) => {
          //Expect valid login
          chai.assert.equal(res.statusCode, 200);
          done();
        });
    });

    it("should return 200 when jwt is valid", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .set("content-type", "application/json")
        .send({ user: "vicent", password: "1234" })
        .end((err, res) => {
          //Expect valid login
          chai.assert.equal(res.statusCode, 200);
          chai
            .request(app)
            .get("/teams")
            .set("Authorization", `JWT ${res.body.token}`)
            .end((err, res) => {
              chai.assert.equal(res.statusCode, 200);
              done();
            });
        });
    });
});

after((done) => {
  usersController.cleanUpUsers();
  done();
});
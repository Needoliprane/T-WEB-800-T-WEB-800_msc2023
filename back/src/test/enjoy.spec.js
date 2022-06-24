const axios = require("axios");
const { describe, expect, it } = require("@jest/globals");
const eventsGetResSchema = require("./schemas/enjoy/eventsGetRes.json");
const eventGetResSchema = require("./schemas/enjoy/eventGetRes.json");
const Validator = require("jsonschema").Validator;
const v = new Validator();

const BASE_URL = `http://localhost:${process.env.PORT}`;
const axiosRequest = axios.create({
  baseURL: `${BASE_URL}/enjoy`,
});

describe("/enjoy", () => {
  describe("/", () => {
    it("should send a status 400 if neither a query or an id was provided", async () => {
      const response = await axiosRequest.get("/");
      expect(response.status).toEqual(400);
      expect(response.data).toMatchObject({
        message: "One of Id or query must be provided",
      });
    });
    it("should send a status 400 if both a query and an id were provided", async () => {
      const response = await axiosRequest.get("/", {
        params: {
          id: "AWBfUKA3EW6eBpXrGY",
          query: "Poitiers",
        },
      });
      expect(response.status).toEqual(400);
      expect(response.data).toMatchObject({
        message: "Only one of id or query must be provided",
      });
    });
    it("should send a status 400 if an invalid param was added", async () => {
      const response = await axiosRequest.get("/", {
        params: { query: "Katy Perry", foo: "bar" },
      });
      expect(response.status).toEqual(400);
      expect(response.data).toMatchObject({
        message: "bar is not allowed",
      });
    });
    it("should send a status 200 and information about an event if an id was provided", async () => {
      const response = await axiosRequest.get("/");
      expect(response.status).toEqual(200);
      expect(response.data).toBeTruthy();
      expect(v.validate(response.data, eventGetResSchema).errors).toHaveLength(
        0
      );
    });
    it("should send a status 200 and a series of events if a query was provided", async () => {
      const response = await axiosRequest.get("/");
      expect(response.status).toEqual(200);
      expect(response.data).toBeTruthy();
      expect(v.validate(eventGetResSchema).errors).toHaveLength(0);
    });
    describe("/:location", () => {
      it("should send a status 400 if an invalid param was added", async () => {
        const response = await axiosRequest.get("/Paris", {
          params: { foo: "bar" },
        });
        expect(response.status).toEqual(400);
        expect(response.data).toMatchObject({
          message: "bar is not allowed",
        });
      });
      it("should send a status 200 and a series of events", async () => {
        const response = await axiosRequest.get("/Paris");
        expect(response.status).toEqual(200);
        expect(response.data).toBeTruthy();
        expect(
          v.validate(response.data, eventGetResSchema).errors
        ).toHaveLength(0);
      });
    });
  });
});

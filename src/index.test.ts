import { CNFBuilder, CNFClause } from "./index";
import dedent from "ts-dedent";

describe("Builder", () => {
  describe("AND clause", () => {
    it("should build CNF format string from single clause", () => {
      const builder = new CNFBuilder();

      const A = builder.addVariable("A");
      const B = builder.addVariable("B");
      const C = builder.addVariable("C");

      builder.addClause(CNFClause.and([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 0
        -2 0
        3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const builder = new CNFBuilder();

      const A = builder.addVariable("A");
      const B = builder.addVariable("B");
      const C = builder.addVariable("C");

      builder.addClause(CNFClause.and([A, B.not]));
      builder.addClause(CNFClause.and([B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 0
        -2 0
        -2 0
        3 0
      `);
    });
  });

  describe("OR clause", () => {
    it("should build CNF format string from single clause", () => {
      const builder = new CNFBuilder();

      const A = builder.addVariable("A");
      const B = builder.addVariable("B");
      const C = builder.addVariable("C");

      builder.addClause(CNFClause.or([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const builder = new CNFBuilder();

      const A = builder.addVariable("A");
      const B = builder.addVariable("B");
      const C = builder.addVariable("C");

      builder.addClause(CNFClause.or([A, B.not]));
      builder.addClause(CNFClause.or([B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 -2 0
        -2 3 0
      `);
    });
  });
});

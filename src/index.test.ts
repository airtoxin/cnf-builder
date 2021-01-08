import { CNFBuilder, CNFClause } from "./index";
import dedent from "ts-dedent";

describe("Builder", () => {
  const createDefaultContext = () => {
    const builder = new CNFBuilder();

    const A = builder.addVariable("A");
    const B = builder.addVariable("B");
    const C = builder.addVariable("C");
    const D = builder.addVariable("D");
    const E = builder.addVariable("E");

    return { builder, A, B, C, D, E };
  };

  describe("and clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.and([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 0
        -2 0
        3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.and([A, B.not, C]));
      builder.addClause(CNFClause.and([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        1 0
        -2 0
        3 0
        3 0
        4 0
        -5 0
      `);
    });
  });

  describe("or clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.or([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.or([A, B.not, C]));
      builder.addClause(CNFClause.or([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        1 -2 3 0
        3 4 -5 0
      `);
    });
  });

  describe("atMostOne clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.atMostOne([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        -1 2 0
        -1 -3 0
        2 -3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.atMostOne([A, B.not, C]));
      builder.addClause(CNFClause.atMostOne([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        -1 2 0
        -1 -3 0
        2 -3 0
        -3 -4 0
        -3 5 0
        -4 5 0
      `);
    });
  });

  describe("atLeastOne clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.atLeastOne([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.atLeastOne([A, B.not, C]));
      builder.addClause(CNFClause.atLeastOne([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        1 -2 3 0
        3 4 -5 0
      `);
    });
  });

  describe("exactlyOne clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.exactlyOne([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        -1 2 0
        -1 -3 0
        2 -3 0
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.exactlyOne([A, B.not, C]));
      builder.addClause(CNFClause.exactlyOne([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        -1 2 0
        -1 -3 0
        2 -3 0
        1 -2 3 0
        -3 -4 0
        -3 5 0
        -4 5 0
        3 4 -5 0
      `);
    });
  });
});

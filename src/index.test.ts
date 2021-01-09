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
        p cnf 3 3
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
        p cnf 5 6
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
        p cnf 3 1
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.or([A, B.not, C]));
      builder.addClause(CNFClause.or([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 2
        1 -2 3 0
        3 4 -5 0
      `);
    });
  });

  describe("not clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.not([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        p cnf 3 1
        -1 2 -3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.not([A, B.not, C]));
      builder.addClause(CNFClause.not([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 2
        -1 2 -3 0
        -3 -4 5 0
      `);
    });
  });

  describe("implies clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B } = createDefaultContext();

      builder.addClause(CNFClause.implies(A, B));

      expect(builder.build()).toEqual(dedent`
        p cnf 2 1
        -1 2 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.implies(A, B));
      builder.addClause(CNFClause.implies(C, D));
      builder.addClause(CNFClause.implies(D, E.not));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 3
        -1 2 0
        -3 4 0
        -4 -5 0
      `);
    });
  });

  describe("equals clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B } = createDefaultContext();

      builder.addClause(CNFClause.equals(A, B));

      expect(builder.build()).toEqual(dedent`
        p cnf 2 2
        -1 2 0
        -2 1 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.equals(A, B));
      builder.addClause(CNFClause.equals(C, D));
      builder.addClause(CNFClause.equals(D, E.not));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 6
        -1 2 0
        -2 1 0
        -3 4 0
        -4 3 0
        -4 -5 0
        5 4 0
      `);
    });
  });

  describe("allEquals clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.allEquals([A, B, C]));

      expect(builder.build()).toEqual(dedent`
        p cnf 3 6
        -1 2 0
        -2 1 0
        -1 3 0
        -3 1 0
        -2 3 0
        -3 2 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.allEquals([A, B, C]));
      builder.addClause(CNFClause.allEquals([C.not, D.not, E]));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 12
        -1 2 0
        -2 1 0
        -1 3 0
        -3 1 0
        -2 3 0
        -3 2 0
        3 -4 0
        4 -3 0
        3 5 0
        -5 -3 0
        4 5 0
        -5 -4 0
      `);
    });
  });

  describe("atMostOne clause", () => {
    it("should build CNF format string from single clause", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.atMostOne([A, B.not, C]));

      expect(builder.build()).toEqual(dedent`
        p cnf 3 3
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
        p cnf 5 6
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
        p cnf 3 1
        1 -2 3 0
      `);
    });

    it("should build CNF format string from multiple clauses", () => {
      const { builder, A, B, C, D, E } = createDefaultContext();

      builder.addClause(CNFClause.atLeastOne([A, B.not, C]));
      builder.addClause(CNFClause.atLeastOne([C, D, E.not]));

      expect(builder.build()).toEqual(dedent`
        p cnf 5 2
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
        p cnf 3 4
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
        p cnf 5 8
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

  describe("comment", () => {
    it("should build CNF format string with comment", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.and([A, B.not, C]));
      builder.addComments(dedent`
        This is comment.
        Newline.
      `);

      expect(builder.build()).toEqual(dedent`
        c This is comment.
        c Newline.
        p cnf 3 3
        1 0
        -2 0
        3 0
      `);
    });

    it("should build CNF format string with comments", () => {
      const { builder, A, B, C } = createDefaultContext();

      builder.addClause(CNFClause.and([A, B.not, C]));
      builder.addComments(["This is comment.", "Newline."]);

      expect(builder.build()).toEqual(dedent`
        c This is comment.
        c Newline.
        p cnf 3 3
        1 0
        -2 0
        3 0
      `);
    });
  });
});

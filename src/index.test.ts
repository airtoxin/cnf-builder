import { CNFBuilder, CNFClause } from "./index";

describe("Builder", () => {
  it("should return CNF format string", () => {
    const builder = new CNFBuilder();

    const A = builder.addVariable("A");
    const B = builder.addVariable("B");
    const C = builder.addVariable("C");

    builder.addClause(CNFClause.and([A, B.not, C]));

    expect(builder.build()).toEqual("");
  });
});

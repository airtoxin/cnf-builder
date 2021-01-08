import { combination } from "./utils";

class CNFVariable {
  constructor(
    public readonly name: string,
    public readonly num: number,
    public readonly isNot: boolean = false
  ) {}

  get not(): CNFVariable {
    return new CNFVariable(this.name, this.num, !this.isNot);
  }
}

export type Clause = CNFVariable[];

export class CNFClause {
  constructor(public readonly clauses: Clause[]) {}

  static and(vars: CNFVariable[]): CNFClause {
    return new CNFClause(vars.map((v) => [v]));
  }

  static or(vars: CNFVariable[]): CNFClause {
    return new CNFClause([vars]);
  }

  static atMostOne(vars: CNFVariable[]): CNFClause {
    return new CNFClause(
      combination(vars).map((pair) => pair.map((v) => v.not))
    );
  }

  static atLeastOne(vars: CNFVariable[]): CNFClause {
    return CNFClause.or(vars);
  }

  static exactlyOne(vars: CNFVariable[]): CNFClause {
    return new CNFClause([
      ...CNFClause.atMostOne(vars).clauses,
      ...CNFClause.atLeastOne(vars).clauses,
    ]);
  }
}

export class CNFBuilder {
  private variableCount = 0;
  private variables: CNFVariable[] = [];
  private clauses: Clause[] = [];

  public addVariable(name: string): CNFVariable {
    this.variableCount += 1;
    const v = new CNFVariable(name, this.variableCount);
    this.variables.push(v);
    return v;
  }

  public addClause(clause: CNFClause): void {
    this.clauses.push(...clause.clauses);
  }

  public build(): string {
    return this.clauses
      .map((clause) =>
        clause
          .map((v) => (v.isNot ? `-${v.num}` : `${v.num}`))
          .concat(["0"])
          .join(" ")
      )
      .join("\n");
  }
}

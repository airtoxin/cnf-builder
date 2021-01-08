import { combination } from "./utils";

class CNFVariable {
  constructor(
    public readonly name: string,
    public readonly num: number,
    public readonly isNot: boolean = false,
    public readonly id: Symbol = Symbol(name)
  ) {}

  get not(): CNFVariable {
    return new CNFVariable(this.name, this.num, !this.isNot, this.id);
  }
}

export type Clause = CNFVariable[];

export class CNFClause {
  public readonly variables: Set<Symbol>;
  constructor(public readonly clauses: Clause[]) {
    this.variables = new Set(clauses.flat().map((v) => v.id));
  }

  static and(vars: CNFVariable[]): CNFClause {
    return new CNFClause(vars.map((v) => [v]));
  }

  static or(vars: CNFVariable[]): CNFClause {
    return new CNFClause([vars]);
  }

  static not(vars: CNFVariable[]): CNFClause {
    return new CNFClause([vars.map((v) => v.not)]);
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
  private variables: Set<Symbol> = new Set();
  private clauses: Clause[] = [];

  public addVariable(name: string): CNFVariable {
    this.variableCount += 1;
    return new CNFVariable(name, this.variableCount);
  }

  public addClause(clause: CNFClause): void {
    this.variables = new Set([...this.variables, ...clause.variables]);
    this.clauses.push(...clause.clauses);
  }

  public build(): string {
    const headerLines = [`p cnf ${this.variables.size} ${this.clauses.length}`];
    const clauseLines = this.clauses.map((clause) =>
      clause
        .map((v) => (v.isNot ? `-${v.num}` : `${v.num}`))
        .concat(["0"])
        .join(" ")
    );

    return [...headerLines, ...clauseLines].join("\n");
  }
}

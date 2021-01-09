import { combination } from "./utils";

class CNFVariable {
  constructor(
    public readonly name: string,
    public readonly sequence: number,
    public readonly isNot: boolean = false,
    public readonly id: Symbol = Symbol(name)
  ) {}

  get not(): CNFVariable {
    return new CNFVariable(this.name, this.sequence, !this.isNot, this.id);
  }
}

const AlwaysTrueVariable = new CNFVariable("ALWAYS_TRUE", 1);
const AlwaysFalseVariable = new CNFVariable("ALWAYS_FALSE", 2);

export type Clause = CNFVariable[];

export class CNFClause {
  public readonly variables: Set<Symbol>;
  constructor(public readonly clauses: Clause[]) {
    this.variables = new Set(clauses.flat().map((v) => v.id));
  }

  static alwaysTrue(): CNFClause {
    return new CNFClause([[AlwaysTrueVariable]]);
  }

  static alwaysFalse(): CNFClause {
    return new CNFClause([[AlwaysFalseVariable]]);
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

export type CNFBuilderOptions = {
  newline?: string;
};

export class CNFBuilder {
  // sequence=1 and sequence=2 used to AlwaysTrueVariable, AlwaysFalseVariable
  private nextVariableSeq = 3;
  private variables: Set<Symbol> = new Set();
  private clauses: Clause[] = [];
  private comments: string[] = [];

  private readonly defaultOptions: Required<CNFBuilderOptions> = {
    newline: "\n",
  };

  constructor(public readonly options?: CNFBuilderOptions) {}

  private getOption<K extends keyof CNFBuilderOptions>(
    name: K
  ): Required<CNFBuilderOptions>[K] {
    return this.options?.[name] ?? this.defaultOptions[name];
  }

  public addComments(comment: string | string[]): void {
    const comments =
      typeof comment === "string"
        ? comment.split(this.getOption("newline"))
        : comment;
    this.comments.push(...comments);
  }

  public addVariable(name: string): CNFVariable {
    return new CNFVariable(name, this.nextVariableSeq++);
  }

  public addClause(clause: CNFClause): void {
    this.variables = new Set([...this.variables, ...clause.variables]);
    this.clauses.push(...clause.clauses);
  }

  public build(): string {
    const commentLines = this.comments.map((c) => `c ${c}`);
    const headerLines = [`p cnf ${this.variables.size} ${this.clauses.length}`];

    // Reassign the sequence to remove sequence that assigned to the unused variable.
    let newSequence = 1;
    const variableNumberMap = new Map<Symbol, number>();

    const clauseLines = this.clauses.map((clause) =>
      clause
        .map((variable) => {
          const isNot = variable.isNot;
          const sequence =
            variableNumberMap.get(variable.id) ||
            variableNumberMap.set(variable.id, newSequence++).get(variable.id)!;

          return isNot ? `-${sequence}` : `${sequence}`;
        })
        .concat(["0"])
        .join(" ")
    );

    return [...commentLines, ...headerLines, ...clauseLines].join(
      this.getOption("newline")
    );
  }
}

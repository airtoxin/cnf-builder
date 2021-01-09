# cnf-builder

Conjuctive-Normal-Form builder

## Usage

```typescript
import { CNFBuilder } from "cnf-builder";

const builder = new CNFBuilder();

const Alice = builder.addVariable("Alice");
const Bob = builder.addVariable("Bob");

builder.addComments("My first cnf.");
builder.addClause(CNFClause.and([Alice, Bob.not]));

console.log(builder.build());
// c My first cnf.
// p cnf 2 2
// 1 0
// -2 0
```

## Supported Clauses

### `CNFClause.alwaysTrue(): CNFClause`

Always true.

### `CNFClause.alwaysFalse(): CNFClause`

Always false.

### `CNFClause.and(vars: CNFVariable[]): CNFClause`

A ∧ B ∧ C ...

### `CNFClause.or(vars: CNFVariable[]): CNFClause`

A ∨ B ∨ C ...

### `CNFClause.not(vars: CNFVariable[]): CNFClause`

¬A ∧ ¬B ∧ ¬C ...

### `CNFClause.implies(p: CNFVariable, q: CNFVariable): CNFClause`

P ⇒ Q

### `CNFClause.equals(p: CNFVariable, q: CNFVariable): CNFClause`

P ⇔ Q

### `CNFClause.allEquals(vars: CNFVariable[]): CNFClause`

A ⇔ B ⇔ C ...

### `CNFClause.atMostOne(vars: CNFVariable[]): CNFClause`

There are at most one true variable.

### `CNFClause.atLeastOne(vars: CNFVariable[]): CNFClause`

There are at least one true variables.

### `CNFClause.exactlyOne(vars: CNFVariable[]): CNFClause`

There are exactly one true variable.

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  buildContainmentTree,
  containmentAncestors,
  containmentPath,
  createGraph,
  createObjectRegistry,
  createRelationFacts,
  createRelationIndex,
  findAncestors,
  findPath
} = require("../src/graph-primitives.cjs");

function neutralGraphData() {
  return {
    objects: {
      root: { id: "root", type: "node", slug: "root", title: "Root" },
      alpha: { id: "alpha", type: "node", slug: "alpha", title: "Alpha" },
      beta: { id: "beta", type: "node", slug: "beta", title: "Beta" },
      gamma: { id: "gamma", type: "leaf", slug: "gamma", title: "Gamma" }
    },
    relations: [
      { type: "links", from: "root", to: "alpha" },
      { type: "links", from: "alpha", to: "beta" },
      { type: "contains", from: "root", to: "alpha" },
      { type: "contains", from: "alpha", to: "gamma" },
      { type: "mentions", from: "beta", to: "gamma" }
    ]
  };
}

test("object registry indexes objects by type and rejects duplicate ids", () => {
  const registry = createObjectRegistry({
    one: { id: "one", type: "node" },
    two: { id: "two", type: "leaf" }
  });

  assert.equal(registry.get("one", "node").id, "one");
  assert.deepEqual(
    registry.all("leaf").map((object) => object.id),
    ["two"]
  );
  assert.throws(() => registry.get("one", "leaf"), /Expected one to be leaf/);
  assert.throws(() => registry.get("missing"), /Unknown object: missing/);
  assert.throws(() => registry.add({ id: "one", type: "node" }), /Object already exists: one/);
});

test("relation facts validate endpoints and expose relation records without indexing concerns", () => {
  const registry = createObjectRegistry({
    one: { id: "one", type: "node" },
    two: { id: "two", type: "node" }
  });
  const facts = createRelationFacts(registry, [{ type: "links", from: "one", to: "two" }]);

  assert.deepEqual(facts.all("links"), [{ type: "links", from: "one", to: "two" }]);
  assert.equal(facts.has("links", "one", "two"), true);
  assert.throws(
    () => facts.add({ type: "links", from: "one", to: "missing" }),
    /Unknown object: missing/
  );
});

test("relation index supports source and target lookup over relation facts", () => {
  const graph = createGraph(neutralGraphData());

  assert.deepEqual(graph.relationIndex.targets("links", "root"), ["alpha"]);
  assert.deepEqual(graph.relationIndex.sources("mentions", "gamma"), ["beta"]);

  graph.relationFacts.add({ type: "links", from: "beta", to: "gamma" });

  assert.deepEqual(graph.relationIndex.targets("links", "beta"), ["gamma"]);
});

test("generic graph traversal finds typed paths without relation meaning", () => {
  const graph = createGraph(neutralGraphData());
  const path = findPath(graph.relationIndex, {
    relationType: "links",
    from: "root",
    to: "beta"
  });

  assert.deepEqual(
    path.map((edge) => [edge.from, edge.to]),
    [
      ["root", "alpha"],
      ["alpha", "beta"]
    ]
  );
  assert.equal(
    findPath(graph.relationIndex, { relationType: "mentions", from: "root", to: "gamma" }),
    undefined
  );
});

test("generic ancestor traversal returns paths toward roots", () => {
  const graph = createGraph(neutralGraphData());
  const ancestors = findAncestors(graph.relationIndex, {
    relationType: "contains",
    of: "gamma"
  });

  assert.deepEqual(
    ancestors.map((entry) => [entry.id, entry.path.map((edge) => [edge.from, edge.to])]),
    [
      ["alpha", [["alpha", "gamma"]]],
      [
        "root",
        [
          ["alpha", "gamma"],
          ["root", "alpha"]
        ]
      ]
    ]
  );
});

test("containment projection names contains semantics and keeps stable identity explicit", () => {
  const graph = createGraph(neutralGraphData());

  assert.deepEqual(
    containmentPath(graph, "root", "gamma").map((edge) => [edge.from, edge.to]),
    [
      ["root", "alpha"],
      ["alpha", "gamma"]
    ]
  );
  assert.deepEqual(
    containmentAncestors(graph, "gamma").map((entry) => entry.id),
    ["alpha", "root"]
  );

  const tree = buildContainmentTree(graph, "root", { includeTypes: ["node", "leaf"] });
  assert.equal(tree.id, "root");
  assert.deepEqual(tree.projection, {
    relation: "contains",
    identity: "stable-id"
  });
  assert.deepEqual(tree.children[0].children[0].id, "gamma");
});

const assert = require("node:assert/strict");
const test = require("node:test");

const { cloneFixture } = require("../src/publication-fixture.cjs");
const { ObjectSpace, createGraphFirstPublication } = require("../src/graph-object-space.cjs");
const { definePublicationBehaviorContract } = require("./publication-behavior-contract.cjs");

definePublicationBehaviorContract(test, "graph-first object space", createGraphFirstPublication);

test("graph-first object space exposes indexed relation traversal", () => {
  const space = new ObjectSpace(cloneFixture());

  assert.deepEqual(space.targets("contains", "s-main"), ["sec-news", "sec-guides"]);
  assert.deepEqual(space.sources("contains", "pg-install"), ["sec-guides"]);
  assert.equal(space.get("pg-install", "page").slug, "install");
});

test("graph-first authorization explains membership, grant, and containment projection", () => {
  const subject = createGraphFirstPublication(cloneFixture());
  const explanation = subject.capabilityExplanation("u-cy", "pg-draft", "publish");

  assert.equal(explanation.allowed, true);
  assert.deepEqual(explanation.graphTrace.subjectPath, [
    { type: "memberOf", from: "u-cy", to: "g-publishers" }
  ]);
  assert.equal(explanation.graphTrace.grant.to, "s-main");
  assert.equal(explanation.graphTrace.scope.mode, "variant-target-contained");
  assert.deepEqual(
    explanation.graphTrace.scope.path.map((edge) => edge.type),
    ["variantOf", "contains", "contains"]
  );
});

test("graph-first visibility includes explicit workspace relation trace", () => {
  const subject = createGraphFirstPublication(cloneFixture());
  const explanation = subject.explainVisibility("u-ada", "pg-launch", "ws-live");

  assert.equal(explanation.allowed, true);
  assert.equal(explanation.workspaceTrace.mode, "workspace-relation");
  assert.deepEqual(explanation.workspaceTrace.path, [
    { type: "inWorkspace", from: "pg-launch", to: "ws-live" }
  ]);
});

test("graph-first behavior candidates include graph traces", () => {
  const subject = createGraphFirstPublication(cloneFixture());
  const render = subject.selectBehavior("pg-install", "render");

  assert.equal(render.behavior.id, "behavior-guide-render");
  assert.deepEqual(render.candidates[0].graphTrace, {
    relation: "usesBehavior",
    from: "sec-guides",
    to: "behavior-guide-render"
  });
});

const assert = require("node:assert/strict");
const test = require("node:test");

const { cloneFixture } = require("../src/publication-fixture.cjs");
const baseline = require("../src/conventional-baseline.cjs");

test("lists pages visible to a viewer in the live workspace", () => {
  const data = cloneFixture();
  const pages = baseline.listVisiblePages(data, "u-ada", "ws-live");

  assert.deepEqual(
    pages.map((page) => page.id),
    ["pg-install", "pg-launch"]
  );
});

test("does not expose draft workspace pages to a viewer without draft access", () => {
  const data = cloneFixture();
  const pages = baseline.listVisiblePages(data, "u-ada", "ws-draft");

  assert.deepEqual(pages, []);
});

test("lets an editor see draft workspace content without granting publish", () => {
  const data = cloneFixture();
  const pages = baseline.listVisiblePages(data, "u-bert", "ws-draft");
  const publish = baseline.capabilityExplanation(data, "u-bert", "pg-draft", "publish");

  assert.deepEqual(
    pages.map((page) => page.id),
    ["pg-draft"]
  );
  assert.equal(publish.allowed, false);
  assert.match(publish.reason, /does not have publish/);
});

test("resolves referenced assets independently of containment", () => {
  const data = cloneFixture();
  const launchAssets = baseline.resolveReferencedAssets(data, "pg-launch");
  const installAssets = baseline.resolveReferencedAssets(data, "pg-install");

  assert.deepEqual(
    launchAssets.map((asset) => asset.id),
    ["asset-logo"]
  );
  assert.deepEqual(
    installAssets.map((asset) => asset.id),
    ["asset-logo"]
  );
});

test("builds a hierarchy projection without using paths as identity", () => {
  const data = cloneFixture();
  const nav = baseline.buildNavigationProjection(data, "s-main");

  assert.equal(nav.id, "s-main");
  assert.deepEqual(
    nav.children.map((child) => [child.id, child.children.map((grandchild) => grandchild.id)]),
    [
      ["sec-guides", ["pg-install"]],
      ["sec-news", ["pg-launch"]]
    ]
  );
  assert.equal(data.objects["pg-launch"].id, "pg-launch");
});

test("lists pages by topic independently of navigation projection", () => {
  const data = cloneFixture();
  const releasePages = baseline.listPagesByTopic(data, "topic-release");

  assert.deepEqual(
    releasePages.map((page) => page.id),
    ["pg-launch"]
  );
});

test("explains why a published live page is visible", () => {
  const data = cloneFixture();
  const explanation = baseline.explainVisibility(data, "u-ada", "pg-launch", "ws-live");

  assert.equal(explanation.allowed, true);
  assert.equal(explanation.view.via.subjectId, "g-viewers");
  assert.equal(explanation.view.via.grantScopeId, "s-main");
  assert.equal(explanation.view.via.scopeType, "site");
});

test("explains why a draft page is hidden from a viewer", () => {
  const data = cloneFixture();
  const explanation = baseline.explainVisibility(data, "u-ada", "pg-draft", "ws-draft");

  assert.equal(explanation.allowed, false);
  assert.equal(explanation.pageStatus, "draft");
  assert.equal(explanation.editConsideredForDraft.allowed, false);
});

test("creates and edits a draft page through explicit functions", () => {
  const data = cloneFixture();
  const page = baseline.createDraftPage(data, "u-bert", {
    id: "pg-new",
    slug: "new",
    title: "New Draft",
    body: "",
    sectionId: "sec-news",
    topicId: "topic-setup",
    languageId: "lang-en",
    workspaceId: "ws-draft"
  });

  baseline.updateDraftPageBody(data, "u-bert", page.id, "Now ready for review.");

  assert.equal(data.objects["pg-new"].body, "Now ready for review.");
  assert.equal(baseline.validatePage(data, "pg-new").valid, true);
});

test("rejects publishing an invalid release page and reports validation", () => {
  const data = cloneFixture();
  const page = baseline.createDraftPage(data, "u-bert", {
    id: "pg-release-draft",
    slug: "release-draft",
    title: "Release Draft",
    body: "Release copy.",
    sectionId: "sec-news",
    topicId: "topic-release",
    languageId: "lang-en",
    workspaceId: "ws-draft"
  });

  assert.throws(
    () => baseline.publishPage(data, "u-cy", page.id),
    (error) => {
      assert.match(error.message, /must reference at least one asset/);
      assert.equal(error.validation.valid, false);
      return true;
    }
  );
  assert.equal(data.objects[page.id].status, "draft");
});

test("publishes a valid draft page with publisher capability", () => {
  const data = cloneFixture();
  const page = baseline.createDraftPage(data, "u-bert", {
    id: "pg-valid-draft",
    slug: "valid-draft",
    title: "Valid Draft",
    body: "Ready.",
    sectionId: "sec-news",
    topicId: "topic-release",
    languageId: "lang-en",
    workspaceId: "ws-draft"
  });

  baseline.addAssetReference(data, "u-bert", page.id, "asset-logo");
  const result = baseline.publishPage(data, "u-cy", page.id);

  assert.equal(result.page.status, "published");
  assert.equal(result.authorization.via.subjectId, "g-publishers");
  assert.equal(result.validation.valid, true);
});

test("denies publishing to an editor with an explainable failed capability path", () => {
  const data = cloneFixture();

  assert.throws(
    () => baseline.publishPage(data, "u-bert", "pg-draft"),
    (error) => {
      assert.equal(error.authorization.allowed, false);
      assert.equal(error.authorization.capability, "publish");
      assert.deepEqual(error.authorization.checkedSubjects, ["u-bert", "g-editors"]);
      return true;
    }
  );
});

test("selects behavior by deterministic relation precedence", () => {
  const data = cloneFixture();
  const render = baseline.selectBehavior(data, "pg-install", "render");
  const validation = baseline.selectBehavior(data, "pg-launch", "validation");

  assert.equal(render.behavior.id, "behavior-guide-render");
  assert.equal(render.candidates[0].sourceKind, "section");
  assert.equal(validation.behavior.id, "behavior-release-validation");
  assert.equal(validation.candidates[0].sourceKind, "topic");
});

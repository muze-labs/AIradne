const assert = require("node:assert/strict");

const { cloneFixture } = require("../src/publication-fixture.cjs");

function definePublicationBehaviorContract(test, label, createSubject) {
  test(`${label}: lists pages visible to a viewer in the live workspace`, () => {
    const subject = createSubject(cloneFixture());
    const pages = subject.listVisiblePages("u-ada", "ws-live");

    assert.deepEqual(
      pages.map((page) => page.id),
      ["pg-install", "pg-launch"]
    );
  });

  test(`${label}: hides draft workspace pages from a viewer without draft access`, () => {
    const subject = createSubject(cloneFixture());
    const pages = subject.listVisiblePages("u-ada", "ws-draft");

    assert.deepEqual(pages, []);
  });

  test(`${label}: lets an editor see draft content without publish capability`, () => {
    const subject = createSubject(cloneFixture());
    const pages = subject.listVisiblePages("u-bert", "ws-draft");
    const publish = subject.capabilityExplanation("u-bert", "pg-draft", "publish");

    assert.deepEqual(
      pages.map((page) => page.id),
      ["pg-draft"]
    );
    assert.equal(publish.allowed, false);
    assert.match(publish.reason, /does not have publish/);
  });

  test(`${label}: resolves referenced assets independently of containment`, () => {
    const subject = createSubject(cloneFixture());
    const launchAssets = subject.resolveReferencedAssets("pg-launch");
    const installAssets = subject.resolveReferencedAssets("pg-install");

    assert.deepEqual(
      launchAssets.map((asset) => asset.id),
      ["asset-logo"]
    );
    assert.deepEqual(
      installAssets.map((asset) => asset.id),
      ["asset-logo"]
    );
  });

  test(`${label}: builds a hierarchy projection without path identity`, () => {
    const data = cloneFixture();
    const subject = createSubject(data);
    const nav = subject.buildNavigationProjection("s-main");

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

  test(`${label}: lists pages by topic independently of navigation`, () => {
    const subject = createSubject(cloneFixture());
    const releasePages = subject.listPagesByTopic("topic-release");

    assert.deepEqual(
      releasePages.map((page) => page.id),
      ["pg-launch"]
    );
  });

  test(`${label}: explains visible published live pages`, () => {
    const subject = createSubject(cloneFixture());
    const explanation = subject.explainVisibility("u-ada", "pg-launch", "ws-live");

    assert.equal(explanation.allowed, true);
    assert.equal(explanation.view.via.subjectId, "g-viewers");
    assert.equal(explanation.view.via.grantScopeId, "s-main");
    assert.equal(explanation.view.via.scopeType, "site");
  });

  test(`${label}: explains hidden draft pages`, () => {
    const subject = createSubject(cloneFixture());
    const explanation = subject.explainVisibility("u-ada", "pg-draft", "ws-draft");

    assert.equal(explanation.allowed, false);
    assert.equal(explanation.pageStatus, "draft");
    assert.equal(explanation.editConsideredForDraft.allowed, false);
  });

  test(`${label}: creates and edits draft pages`, () => {
    const data = cloneFixture();
    const subject = createSubject(data);
    const page = subject.createDraftPage("u-bert", {
      id: "pg-new",
      slug: "new",
      title: "New Draft",
      body: "",
      sectionId: "sec-news",
      topicId: "topic-setup",
      languageId: "lang-en",
      workspaceId: "ws-draft"
    });

    subject.updateDraftPageBody("u-bert", page.id, "Now ready for review.");

    assert.equal(data.objects["pg-new"].body, "Now ready for review.");
    assert.equal(subject.validatePage("pg-new").valid, true);
  });

  test(`${label}: rejects invalid release-page publishing`, () => {
    const data = cloneFixture();
    const subject = createSubject(data);
    const page = subject.createDraftPage("u-bert", {
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
      () => subject.publishPage("u-cy", page.id),
      (error) => {
        assert.match(error.message, /must reference at least one image asset/);
        assert.equal(error.validation.valid, false);
        return true;
      }
    );
    assert.equal(data.objects[page.id].status, "draft");
  });

  test(`${label}: rejects release-page publishing when only non-image assets are referenced`, () => {
    const data = cloneFixture();
    const subject = createSubject(data);
    const page = subject.createDraftPage("u-bert", {
      id: "pg-release-with-pdf",
      slug: "release-with-pdf",
      title: "Release With PDF",
      body: "Release copy.",
      sectionId: "sec-news",
      topicId: "topic-release",
      languageId: "lang-en",
      workspaceId: "ws-draft"
    });

    subject.addAssetReference("u-bert", page.id, "asset-handbook");

    assert.throws(
      () => subject.publishPage("u-cy", page.id),
      (error) => {
        assert.match(error.message, /must reference at least one image asset/);
        assert.equal(error.validation.valid, false);
        return true;
      }
    );
    assert.equal(data.objects[page.id].status, "draft");
  });

  test(`${label}: publishes valid draft pages`, () => {
    const data = cloneFixture();
    const subject = createSubject(data);
    const page = subject.createDraftPage("u-bert", {
      id: "pg-valid-draft",
      slug: "valid-draft",
      title: "Valid Draft",
      body: "Ready.",
      sectionId: "sec-news",
      topicId: "topic-release",
      languageId: "lang-en",
      workspaceId: "ws-draft"
    });

    subject.addAssetReference("u-bert", page.id, "asset-logo");
    const result = subject.publishPage("u-cy", page.id);

    assert.equal(result.page.status, "published");
    assert.equal(result.authorization.via.subjectId, "g-publishers");
    assert.equal(result.validation.valid, true);
  });

  test(`${label}: denies publishing to editors with explainable failure`, () => {
    const subject = createSubject(cloneFixture());

    assert.throws(
      () => subject.publishPage("u-bert", "pg-draft"),
      (error) => {
        assert.equal(error.authorization.allowed, false);
        assert.equal(error.authorization.capability, "publish");
        assert.deepEqual(error.authorization.checkedSubjects, ["u-bert", "g-editors"]);
        return true;
      }
    );
  });

  test(`${label}: selects behavior by deterministic relation precedence`, () => {
    const subject = createSubject(cloneFixture());
    const render = subject.selectBehavior("pg-install", "render");
    const validation = subject.selectBehavior("pg-launch", "validation");

    assert.equal(render.behavior.id, "behavior-guide-render");
    assert.equal(render.candidates[0].sourceKind, "section");
    assert.equal(validation.behavior.id, "behavior-release-validation");
    assert.equal(validation.candidates[0].sourceKind, "topic");
  });
}

module.exports = {
  definePublicationBehaviorContract
};

const fixture = {
  objects: {
    "s-main": { id: "s-main", type: "site", slug: "main", title: "Main Site" },

    "sec-news": { id: "sec-news", type: "section", slug: "news", title: "News" },
    "sec-guides": { id: "sec-guides", type: "section", slug: "guides", title: "Guides" },

    "pg-launch": {
      id: "pg-launch",
      type: "page",
      slug: "launch",
      title: "Launch Notes",
      body: "Airadne launch notes.",
      status: "published"
    },
    "pg-install": {
      id: "pg-install",
      type: "page",
      slug: "install",
      title: "Install Guide",
      body: "Install Airadne.",
      status: "published"
    },
    "pg-draft": {
      id: "pg-draft",
      type: "page",
      slug: "launch-nl",
      title: "Lancering",
      body: "Conceptversie.",
      status: "draft"
    },

    "asset-logo": {
      id: "asset-logo",
      type: "asset",
      slug: "logo",
      mediaType: "image/svg+xml",
      label: "Airadne logo"
    },
    "asset-handbook": {
      id: "asset-handbook",
      type: "asset",
      slug: "handbook",
      mediaType: "application/pdf",
      label: "Airadne handbook"
    },

    "topic-release": { id: "topic-release", type: "topic", slug: "release", label: "Release" },
    "topic-setup": { id: "topic-setup", type: "topic", slug: "setup", label: "Setup" },

    "lang-en": { id: "lang-en", type: "language", tag: "en", label: "English" },
    "lang-nl": { id: "lang-nl", type: "language", tag: "nl", label: "Nederlands" },

    "ws-live": { id: "ws-live", type: "workspace", slug: "live", label: "Live" },
    "ws-draft": { id: "ws-draft", type: "workspace", slug: "draft", label: "Draft" },

    "u-ada": { id: "u-ada", type: "user", handle: "ada" },
    "u-bert": { id: "u-bert", type: "user", handle: "bert" },
    "u-cy": { id: "u-cy", type: "user", handle: "cy" },

    "g-viewers": { id: "g-viewers", type: "group", slug: "viewers", label: "Viewers" },
    "g-editors": { id: "g-editors", type: "group", slug: "editors", label: "Editors" },
    "g-publishers": { id: "g-publishers", type: "group", slug: "publishers", label: "Publishers" },

    "behavior-default-render": {
      id: "behavior-default-render",
      type: "behavior",
      kind: "render",
      label: "Default page rendering"
    },
    "behavior-guide-render": {
      id: "behavior-guide-render",
      type: "behavior",
      kind: "render",
      label: "Guide page rendering"
    },
    "behavior-release-validation": {
      id: "behavior-release-validation",
      type: "behavior",
      kind: "validation",
      label: "Release validation"
    }
  },

  relations: [
    { type: "contains", from: "s-main", to: "sec-news" },
    { type: "contains", from: "s-main", to: "sec-guides" },
    { type: "contains", from: "sec-news", to: "pg-launch" },
    { type: "contains", from: "sec-guides", to: "pg-install" },

    { type: "references", from: "pg-launch", to: "asset-logo" },
    { type: "references", from: "pg-install", to: "asset-logo" },

    { type: "taggedWith", from: "pg-launch", to: "topic-release" },
    { type: "taggedWith", from: "pg-install", to: "topic-setup" },

    { type: "variantOf", from: "pg-draft", to: "pg-launch" },
    { type: "inLanguage", from: "pg-launch", to: "lang-en" },
    { type: "inLanguage", from: "pg-draft", to: "lang-nl" },

    { type: "inWorkspace", from: "pg-launch", to: "ws-live" },
    { type: "inWorkspace", from: "pg-install", to: "ws-live" },
    { type: "inWorkspace", from: "pg-draft", to: "ws-draft" },

    { type: "memberOf", from: "u-ada", to: "g-viewers" },
    { type: "memberOf", from: "u-bert", to: "g-editors" },
    { type: "memberOf", from: "u-cy", to: "g-publishers" },

    { type: "grants", from: "g-viewers", capability: "view", to: "s-main" },
    { type: "grants", from: "g-editors", capability: "view", to: "ws-draft" },
    { type: "grants", from: "g-editors", capability: "edit", to: "ws-draft" },
    { type: "grants", from: "g-publishers", capability: "view", to: "s-main" },
    { type: "grants", from: "g-publishers", capability: "edit", to: "s-main" },
    { type: "grants", from: "g-publishers", capability: "publish", to: "s-main" },
    { type: "grants", from: "g-publishers", capability: "configureBehavior", to: "s-main" },

    { type: "usesBehavior", from: "s-main", to: "behavior-default-render" },
    { type: "usesBehavior", from: "sec-guides", to: "behavior-guide-render" },
    { type: "usesBehavior", from: "topic-release", to: "behavior-release-validation" }
  ]
};

function cloneFixture() {
  return {
    objects: structuredClone(fixture.objects),
    relations: structuredClone(fixture.relations)
  };
}

module.exports = {
  fixture,
  cloneFixture
};

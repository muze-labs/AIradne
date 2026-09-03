const {
  buildContainmentTree,
  containmentAncestors,
  containmentPath,
  createGraph
} = require("./graph-primitives.cjs");

const PAGE_STATUSES = new Set(["draft", "published"]);
const BEHAVIOR_PRECEDENCE = ["direct-page", "topic", "section", "site"];

class ObjectSpace {
  constructor(data) {
    this.graph = createGraph(data);
    this.data = this.graph.data;
    this.objects = this.graph.registry.records;
    this.relations = this.graph.relationFacts.records;
  }

  get(id, expectedType) {
    return this.graph.registry.get(id, expectedType);
  }

  all(type) {
    return this.graph.registry.all(type);
  }

  edges(type, options = {}) {
    return this.graph.relationIndex.edges(type, options);
  }

  targets(type, from) {
    return this.graph.relationIndex.targets(type, from);
  }

  sources(type, to) {
    return this.graph.relationIndex.sources(type, to);
  }

  addObject(object) {
    return this.graph.registry.add(object);
  }

  connect(edge) {
    return this.graph.relationFacts.add(edge);
  }

  hasEdge(type, from, to) {
    return this.graph.relationFacts.has(type, from, to);
  }

  containmentPathFromScope(scopeId, objectId) {
    return containmentPath(this.graph, scopeId, objectId);
  }

  ancestorsViaContainment(objectId) {
    return containmentAncestors(this.graph, objectId);
  }

  containmentTree(rootId, options = {}) {
    return buildContainmentTree(this.graph, rootId, options);
  }
}

function createGraphFirstPublication(data) {
  const space = new ObjectSpace(data);

  return {
    data,
    space,
    addAssetReference: (userId, pageId, assetId) => addAssetReference(space, userId, pageId, assetId),
    buildNavigationProjection: (rootId) => buildNavigationProjection(space, rootId),
    can: (userId, objectId, capability) => capabilityExplanation(space, userId, objectId, capability).allowed,
    capabilityExplanation: (userId, objectId, capability) => capabilityExplanation(space, userId, objectId, capability),
    createDraftPage: (userId, input) => createDraftPage(space, userId, input),
    explainVisibility: (userId, pageId, workspaceId) => explainVisibility(space, userId, pageId, workspaceId),
    listPagesByTopic: (topicId) => listPagesByTopic(space, topicId),
    listVisiblePages: (userId, workspaceId) => listVisiblePages(space, userId, workspaceId),
    publishPage: (userId, pageId) => publishPage(space, userId, pageId),
    resolveReferencedAssets: (pageId) => resolveReferencedAssets(space, pageId),
    selectBehavior: (pageId, kind) => selectBehavior(space, pageId, kind),
    updateDraftPageBody: (userId, pageId, body) => updateDraftPageBody(space, userId, pageId, body),
    validatePage: (pageId) => validatePage(space, pageId)
  };
}

function listVisiblePages(space, userId, workspaceId) {
  space.get(workspaceId, "workspace");
  return sortObjects(space.all("page").filter((page) => isVisiblePage(space, userId, page.id, workspaceId)));
}

function isVisiblePage(space, userId, pageId, workspaceId) {
  const page = space.get(pageId, "page");
  if (workspaceOf(space, pageId) !== workspaceId) return false;
  if (!capabilityExplanation(space, userId, pageId, "view").allowed) return false;
  return page.status === "published" || capabilityExplanation(space, userId, pageId, "edit").allowed;
}

function resolveReferencedAssets(space, pageId) {
  space.get(pageId, "page");
  return space.targets("references", pageId).map((assetId) => space.get(assetId, "asset"));
}

function buildNavigationProjection(space, rootId) {
  return space.containmentTree(rootId, { includeTypes: ["section", "page"] });
}

function listPagesByTopic(space, topicId) {
  space.get(topicId, "topic");
  return sortObjects(
    space
      .sources("taggedWith", topicId)
      .map((pageId) => space.get(pageId))
      .filter((object) => object.type === "page")
  );
}

function explainVisibility(space, userId, pageId, workspaceId) {
  const page = space.get(pageId, "page");
  const workspaceTrace = workspaceTraceFor(space, pageId, workspaceId);
  const view = capabilityExplanation(space, userId, pageId, "view");
  const edit = capabilityExplanation(space, userId, pageId, "edit");
  const statusAllowed = page.status === "published" || edit.allowed;
  const allowed = workspaceTrace.allowed && view.allowed && statusAllowed;

  return {
    allowed,
    pageId,
    userId,
    workspaceId,
    workspaceMatches: workspaceTrace.allowed,
    workspaceTrace,
    pageStatus: page.status,
    view,
    editConsideredForDraft: page.status !== "published" ? edit : undefined,
    reason: allowed
      ? `${pageId} is visible to ${userId} in ${workspaceId}`
      : `${pageId} is hidden from ${userId} in ${workspaceId}`
  };
}

function validatePage(space, pageId) {
  const page = space.get(pageId, "page");
  const errors = [];
  const workspaces = space.targets("inWorkspace", pageId);
  const languages = space.targets("inLanguage", pageId);

  if (!PAGE_STATUSES.has(page.status)) {
    errors.push(`Page ${pageId} has invalid status ${page.status}`);
  }
  if (workspaces.length !== 1) {
    errors.push(`Page ${pageId} must belong to exactly one workspace`);
  }
  if (languages.length > 1) {
    errors.push(`Page ${pageId} may have at most one language`);
  }
  if (page.status === "published") {
    if (!page.title || !page.title.trim()) errors.push(`Published page ${pageId} requires title`);
    if (!page.body || !page.body.trim()) errors.push(`Published page ${pageId} requires body`);
  }

  const validationBehavior = selectBehavior(space, pageId, "validation");
  if (validationBehavior.behavior?.id === "behavior-release-validation") {
    if (resolveReferencedAssets(space, pageId).length === 0) {
      errors.push(`Release page ${pageId} must reference at least one asset`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    behavior: validationBehavior
  };
}

function createDraftPage(space, userId, input) {
  requireCapability(space, userId, input.workspaceId, "edit");
  space.get(input.sectionId, "section");
  space.get(input.topicId, "topic");
  space.get(input.languageId, "language");
  space.get(input.workspaceId, "workspace");

  const page = {
    id: input.id,
    type: "page",
    slug: input.slug,
    title: input.title,
    body: input.body,
    status: "draft"
  };

  space.addObject(page);
  space.connect({ type: "contains", from: input.sectionId, to: page.id });
  space.connect({ type: "taggedWith", from: page.id, to: input.topicId });
  space.connect({ type: "inLanguage", from: page.id, to: input.languageId });
  space.connect({ type: "inWorkspace", from: page.id, to: input.workspaceId });

  return page;
}

function updateDraftPageBody(space, userId, pageId, body) {
  const page = space.get(pageId, "page");
  requireCapability(space, userId, pageId, "edit");
  if (page.status !== "draft") {
    throw new Error(`Cannot edit published page ${pageId}`);
  }
  page.body = body;
  return page;
}

function addAssetReference(space, userId, pageId, assetId) {
  space.get(pageId, "page");
  space.get(assetId, "asset");
  requireCapability(space, userId, pageId, "edit");
  if (!space.hasEdge("references", pageId, assetId)) {
    space.connect({ type: "references", from: pageId, to: assetId });
  }
}

function publishPage(space, userId, pageId) {
  const page = space.get(pageId, "page");
  const authorization = requireCapability(space, userId, pageId, "publish");
  const priorStatus = page.status;
  page.status = "published";

  const validation = validatePage(space, pageId);
  if (!validation.valid) {
    page.status = priorStatus;
    const error = new Error(`Cannot publish ${pageId}: ${validation.errors.join("; ")}`);
    error.validation = validation;
    error.authorization = authorization;
    throw error;
  }

  return {
    page,
    authorization,
    validation
  };
}

function selectBehavior(space, pageId, kind) {
  space.get(pageId, "page");
  const topicIds = space.targets("taggedWith", pageId);
  const sectionIds = containingAncestorsOfType(space, pageId, "section").map((entry) => entry.id);
  const siteIds = containingAncestorsOfType(space, pageId, "site").map((entry) => entry.id);
  const sources = [
    { sourceKind: "direct-page", sourceIds: [pageId] },
    { sourceKind: "topic", sourceIds: topicIds },
    { sourceKind: "section", sourceIds: sectionIds },
    { sourceKind: "site", sourceIds: siteIds }
  ];

  const candidates = sources.flatMap(({ sourceKind, sourceIds }) => {
    return sourceIds.flatMap((sourceId) => behaviorCandidates(space, pageId, kind, sourceKind, sourceId));
  });

  return {
    pageId,
    kind,
    behavior: candidates[0]?.behavior,
    precedence: BEHAVIOR_PRECEDENCE,
    candidates,
    reason: candidates[0]
      ? `${candidates[0].behavior.id} selected from ${candidates[0].sourceKind} ${candidates[0].sourceId}`
      : `No ${kind} behavior applies to ${pageId}`
  };
}

function behaviorCandidates(space, pageId, kind, sourceKind, sourceId) {
  return space
    .edges("usesBehavior", { from: sourceId })
    .map((edge) => space.get(edge.to, "behavior"))
    .filter((behavior) => behavior.kind === kind)
    .map((behavior) => ({
      pageId,
      sourceKind,
      sourceId,
      behavior,
      graphTrace: {
        relation: "usesBehavior",
        from: sourceId,
        to: behavior.id
      }
    }));
}

function capabilityExplanation(space, userId, objectId, capability) {
  space.get(userId, "user");
  space.get(objectId);

  const subjects = actorSubjects(space, userId);
  const checkedGrants = subjects.flatMap((subject) => {
    return space.edges("grants", { from: subject.id }).map((grant) => ({
      subject,
      grant,
      scopeTrace: scopeTraceFor(space, objectId, grant.to)
    }));
  });

  const match = checkedGrants.find((entry) => {
    return entry.grant.capability === capability && entry.scopeTrace.allowed;
  });

  if (match) {
    return {
      allowed: true,
      capability,
      userId,
      objectId,
      via: {
        subjectId: match.subject.id,
        grantScopeId: match.grant.to,
        scopeType: space.get(match.grant.to).type
      },
      graphTrace: {
        subjectPath: match.subject.path,
        grant: match.grant,
        scope: match.scopeTrace
      },
      checkedGrants: checkedGrants.map(compactCheckedGrant),
      reason: `${userId} has ${capability} through ${match.subject.id} on ${match.grant.to}`
    };
  }

  return {
    allowed: false,
    capability,
    userId,
    objectId,
    checkedSubjects: subjects.map((subject) => subject.id),
    checkedScopes: checkedGrants.map((entry) => ({
      subjectId: entry.subject.id,
      capability: entry.grant.capability,
      scopeId: entry.grant.to
    })),
    checkedGrants: checkedGrants.map(compactCheckedGrant),
    reason: `${userId} does not have ${capability} for ${objectId}`
  };
}

function actorSubjects(space, userId) {
  return [
    { id: userId, path: [] },
    ...space.edges("memberOf", { from: userId }).map((edge) => ({
      id: edge.to,
      path: [edge]
    }))
  ];
}

function scopeTraceFor(space, objectId, scopeId) {
  if (objectId === scopeId) {
    return { allowed: true, mode: "exact", objectId, scopeId, path: [] };
  }

  const scope = space.get(scopeId);
  if (scope.type === "workspace") {
    return workspaceTraceFor(space, objectId, scopeId);
  }
  if (scope.type === "site" || scope.type === "section") {
    return containmentScopeTraceFor(space, objectId, scopeId);
  }

  return { allowed: false, mode: "unsupported-scope", objectId, scopeId, path: [] };
}

function workspaceTraceFor(space, objectId, workspaceId) {
  const edge = space.edges("inWorkspace", { from: objectId, to: workspaceId })[0];
  return {
    allowed: Boolean(edge),
    mode: "workspace-relation",
    objectId,
    scopeId: workspaceId,
    path: edge ? [edge] : []
  };
}

function containmentScopeTraceFor(space, objectId, scopeId) {
  const directPath = space.containmentPathFromScope(scopeId, objectId);
  if (directPath) {
    return {
      allowed: true,
      mode: "contains-projection",
      objectId,
      scopeId,
      path: directPath
    };
  }

  for (const edge of space.edges("variantOf", { from: objectId })) {
    const variantPath = space.containmentPathFromScope(scopeId, edge.to);
    if (variantPath) {
      return {
        allowed: true,
        mode: "variant-target-contained",
        objectId,
        scopeId,
        path: [edge, ...variantPath]
      };
    }
  }

  return {
    allowed: false,
    mode: "not-in-containment-projection",
    objectId,
    scopeId,
    path: []
  };
}

function containingAncestorsOfType(space, objectId, type) {
  return space.ancestorsViaContainment(objectId).filter((entry) => space.get(entry.id).type === type);
}

function requireCapability(space, userId, objectId, capability) {
  const explanation = capabilityExplanation(space, userId, objectId, capability);
  if (!explanation.allowed) {
    const error = new Error(explanation.reason);
    error.authorization = explanation;
    throw error;
  }
  return explanation;
}

function workspaceOf(space, objectId) {
  const workspaceIds = space.targets("inWorkspace", objectId);
  return workspaceIds.length === 1 ? workspaceIds[0] : undefined;
}

function compactCheckedGrant(entry) {
  return {
    subjectId: entry.subject.id,
    capability: entry.grant.capability,
    scopeId: entry.grant.to,
    scopeAllowed: entry.scopeTrace.allowed,
    scopeMode: entry.scopeTrace.mode
  };
}

function sortObjects(objects) {
  return [...objects].sort(bySlugThenId);
}

function bySlugThenId(left, right) {
  return (left.slug || left.id).localeCompare(right.slug || right.id) || left.id.localeCompare(right.id);
}

module.exports = {
  ObjectSpace,
  createGraphFirstPublication
};

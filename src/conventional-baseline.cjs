const PAGE_STATUSES = new Set(["draft", "published"]);

function listObjects(data, type) {
  return Object.values(data.objects).filter((object) => object.type === type);
}

function relations(data, type, from) {
  return data.relations.filter((relation) => {
    if (relation.type !== type) return false;
    return from === undefined || relation.from === from;
  });
}

function relationTargets(data, type, from) {
  return relations(data, type, from).map((relation) => relation.to);
}

function relationSources(data, type, to) {
  return data.relations
    .filter((relation) => relation.type === type && relation.to === to)
    .map((relation) => relation.from);
}

function getObject(data, id, expectedType) {
  const object = data.objects[id];
  if (!object) {
    throw new Error(`Unknown object: ${id}`);
  }
  if (expectedType && object.type !== expectedType) {
    throw new Error(`Expected ${id} to be ${expectedType}, got ${object.type}`);
  }
  return object;
}

function actorIds(data, userId) {
  getObject(data, userId, "user");
  return [userId, ...relationTargets(data, "memberOf", userId)];
}

function descendants(data, rootId) {
  const seen = new Set();
  const queue = [...relationTargets(data, "contains", rootId)];

  while (queue.length > 0) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    queue.push(...relationTargets(data, "contains", id));
  }

  return seen;
}

function isContainedBy(data, objectId, rootId) {
  return descendants(data, rootId).has(objectId);
}

function workspaceOf(data, objectId) {
  const workspaces = relationTargets(data, "inWorkspace", objectId);
  return workspaces.length === 1 ? workspaces[0] : undefined;
}

function canonicalTargets(data, objectId) {
  return relationTargets(data, "variantOf", objectId);
}

function isInScope(data, objectId, scopeId) {
  if (objectId === scopeId) return true;

  const scope = getObject(data, scopeId);
  if (scope.type === "workspace") {
    return workspaceOf(data, objectId) === scopeId;
  }

  if (scope.type === "site" || scope.type === "section") {
    if (isContainedBy(data, objectId, scopeId)) return true;
    return canonicalTargets(data, objectId).some((targetId) => isContainedBy(data, targetId, scopeId));
  }

  return false;
}

function grantMatches(data, grant, objectId, capability) {
  return grant.capability === capability && isInScope(data, objectId, grant.to);
}

function capabilityExplanation(data, userId, objectId, capability) {
  const subjectIds = actorIds(data, userId);
  const grants = data.relations.filter((relation) => {
    return relation.type === "grants" && subjectIds.includes(relation.from);
  });
  const matchingGrant = grants.find((grant) => grantMatches(data, grant, objectId, capability));

  if (matchingGrant) {
    return {
      allowed: true,
      capability,
      userId,
      objectId,
      via: {
        subjectId: matchingGrant.from,
        grantScopeId: matchingGrant.to,
        scopeType: data.objects[matchingGrant.to].type
      },
      reason: `${userId} has ${capability} through ${matchingGrant.from} on ${matchingGrant.to}`
    };
  }

  return {
    allowed: false,
    capability,
    userId,
    objectId,
    checkedSubjects: subjectIds,
    checkedScopes: grants.map((grant) => ({
      subjectId: grant.from,
      capability: grant.capability,
      scopeId: grant.to
    })),
    reason: `${userId} does not have ${capability} for ${objectId}`
  };
}

function can(data, userId, objectId, capability) {
  return capabilityExplanation(data, userId, objectId, capability).allowed;
}

function isVisiblePage(data, userId, pageId, workspaceId) {
  const page = getObject(data, pageId, "page");
  if (workspaceOf(data, pageId) !== workspaceId) return false;
  if (!can(data, userId, pageId, "view")) return false;
  return page.status === "published" || can(data, userId, pageId, "edit");
}

function listVisiblePages(data, userId, workspaceId) {
  getObject(data, workspaceId, "workspace");
  return listObjects(data, "page")
    .filter((page) => isVisiblePage(data, userId, page.id, workspaceId))
    .sort(bySlugThenId);
}

function resolveReferencedAssets(data, pageId) {
  getObject(data, pageId, "page");
  return relationTargets(data, "references", pageId).map((assetId) => getObject(data, assetId, "asset"));
}

function buildNavigationProjection(data, rootId) {
  const root = getObject(data, rootId);
  const children = relationTargets(data, "contains", rootId)
    .map((childId) => buildNavigationProjection(data, childId))
    .filter((node) => node.object.type === "section" || node.object.type === "page")
    .sort((left, right) => bySlugThenId(left.object, right.object));

  return {
    id: root.id,
    type: root.type,
    slug: root.slug,
    title: root.title,
    object: root,
    children
  };
}

function listPagesByTopic(data, topicId) {
  getObject(data, topicId, "topic");
  return relationSources(data, "taggedWith", topicId)
    .map((pageId) => getObject(data, pageId))
    .filter((object) => object.type === "page")
    .sort(bySlugThenId);
}

function explainVisibility(data, userId, pageId, workspaceId) {
  const page = getObject(data, pageId, "page");
  const workspaceMatches = workspaceOf(data, pageId) === workspaceId;
  const view = capabilityExplanation(data, userId, pageId, "view");
  const edit = capabilityExplanation(data, userId, pageId, "edit");
  const statusAllowed = page.status === "published" || edit.allowed;
  const allowed = workspaceMatches && view.allowed && statusAllowed;

  return {
    allowed,
    pageId,
    userId,
    workspaceId,
    workspaceMatches,
    pageStatus: page.status,
    view,
    editConsideredForDraft: page.status !== "published" ? edit : undefined,
    reason: allowed
      ? `${pageId} is visible to ${userId} in ${workspaceId}`
      : `${pageId} is hidden from ${userId} in ${workspaceId}`
  };
}

function validatePage(data, pageId) {
  const page = getObject(data, pageId, "page");
  const errors = [];
  const workspaces = relationTargets(data, "inWorkspace", pageId);
  const languages = relationTargets(data, "inLanguage", pageId);

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
  if (selectBehavior(data, pageId, "validation").behavior?.id === "behavior-release-validation") {
    if (resolveReferencedAssets(data, pageId).length === 0) {
      errors.push(`Release page ${pageId} must reference at least one asset`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function createDraftPage(data, userId, input) {
  const page = {
    id: input.id,
    type: "page",
    slug: input.slug,
    title: input.title,
    body: input.body,
    status: "draft"
  };
  assertNewObject(data, page.id);
  requireCapability(data, userId, input.workspaceId, "edit");
  getObject(data, input.sectionId, "section");
  getObject(data, input.topicId, "topic");
  getObject(data, input.languageId, "language");
  getObject(data, input.workspaceId, "workspace");

  data.objects[page.id] = page;
  data.relations.push({ type: "contains", from: input.sectionId, to: page.id });
  data.relations.push({ type: "taggedWith", from: page.id, to: input.topicId });
  data.relations.push({ type: "inLanguage", from: page.id, to: input.languageId });
  data.relations.push({ type: "inWorkspace", from: page.id, to: input.workspaceId });

  return page;
}

function updateDraftPageBody(data, userId, pageId, body) {
  const page = getObject(data, pageId, "page");
  requireCapability(data, userId, pageId, "edit");
  if (page.status !== "draft") {
    throw new Error(`Cannot edit published page ${pageId}`);
  }
  page.body = body;
  return page;
}

function addAssetReference(data, userId, pageId, assetId) {
  getObject(data, pageId, "page");
  getObject(data, assetId, "asset");
  requireCapability(data, userId, pageId, "edit");
  if (!relationTargets(data, "references", pageId).includes(assetId)) {
    data.relations.push({ type: "references", from: pageId, to: assetId });
  }
}

function publishPage(data, userId, pageId) {
  const page = getObject(data, pageId, "page");
  const capability = requireCapability(data, userId, pageId, "publish");
  const priorStatus = page.status;
  page.status = "published";
  const validation = validatePage(data, pageId);
  if (!validation.valid) {
    page.status = priorStatus;
    const error = new Error(`Cannot publish ${pageId}: ${validation.errors.join("; ")}`);
    error.validation = validation;
    error.authorization = capability;
    throw error;
  }
  return {
    page,
    authorization: capability,
    validation
  };
}

function selectBehavior(data, pageId, kind) {
  getObject(data, pageId, "page");
  const candidates = [
    ...behaviorCandidates(data, pageId, kind, "direct-page", [pageId]),
    ...behaviorCandidates(data, pageId, kind, "topic", relationTargets(data, "taggedWith", pageId)),
    ...behaviorCandidates(data, pageId, kind, "section", containingSections(data, pageId)),
    ...behaviorCandidates(data, pageId, kind, "site", containingSites(data, pageId))
  ];

  return {
    pageId,
    kind,
    behavior: candidates[0]?.behavior,
    precedence: ["direct-page", "topic", "section", "site"],
    candidates,
    reason: candidates[0]
      ? `${candidates[0].behavior.id} selected from ${candidates[0].sourceKind} ${candidates[0].sourceId}`
      : `No ${kind} behavior applies to ${pageId}`
  };
}

function behaviorCandidates(data, pageId, kind, sourceKind, sourceIds) {
  return sourceIds.flatMap((sourceId) => {
    return relationTargets(data, "usesBehavior", sourceId)
      .map((behaviorId) => getObject(data, behaviorId, "behavior"))
      .filter((behavior) => behavior.kind === kind)
      .map((behavior) => ({
        pageId,
        sourceKind,
        sourceId,
        behavior
      }));
  });
}

function containingSections(data, pageId) {
  return containingAncestors(data, pageId).filter((id) => data.objects[id].type === "section");
}

function containingSites(data, pageId) {
  return containingAncestors(data, pageId).filter((id) => data.objects[id].type === "site");
}

function containingAncestors(data, objectId) {
  const ancestors = [];
  let frontier = relationSources(data, "contains", objectId);

  while (frontier.length > 0) {
    const parentId = frontier.shift();
    if (ancestors.includes(parentId)) continue;
    ancestors.push(parentId);
    frontier.push(...relationSources(data, "contains", parentId));
  }

  return ancestors;
}

function requireCapability(data, userId, objectId, capability) {
  const explanation = capabilityExplanation(data, userId, objectId, capability);
  if (!explanation.allowed) {
    const error = new Error(explanation.reason);
    error.authorization = explanation;
    throw error;
  }
  return explanation;
}

function assertNewObject(data, id) {
  if (data.objects[id]) {
    throw new Error(`Object already exists: ${id}`);
  }
}

function bySlugThenId(left, right) {
  return (left.slug || left.id).localeCompare(right.slug || right.id) || left.id.localeCompare(right.id);
}

module.exports = {
  addAssetReference,
  buildNavigationProjection,
  can,
  capabilityExplanation,
  createDraftPage,
  explainVisibility,
  listPagesByTopic,
  listVisiblePages,
  publishPage,
  resolveReferencedAssets,
  selectBehavior,
  updateDraftPageBody,
  validatePage
};

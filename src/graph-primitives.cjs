function createObjectRegistry(objects) {
  const byType = new Map();

  for (const object of Object.values(objects)) {
    addToMapSet(byType, object.type, object.id);
  }

  return {
    get(id, expectedType) {
      const object = objects[id];
      if (!object) {
        throw new Error(`Unknown object: ${id}`);
      }
      if (expectedType && object.type !== expectedType) {
        throw new Error(`Expected ${id} to be ${expectedType}, got ${object.type}`);
      }
      return object;
    },

    all(type) {
      return [...(byType.get(type) || [])].map((id) => this.get(id));
    },

    add(object) {
      if (objects[object.id]) {
        throw new Error(`Object already exists: ${object.id}`);
      }
      objects[object.id] = object;
      addToMapSet(byType, object.type, object.id);
      return object;
    },

    has(id) {
      return Boolean(objects[id]);
    },

    records: objects
  };
}

function createRelationFacts(registry, records) {
  let version = 0;

  for (const edge of records) {
    assertKnownEndpoints(registry, edge);
  }

  return {
    all(type) {
      return records.filter((edge) => type === undefined || edge.type === type);
    },

    add(edge) {
      assertKnownEndpoints(registry, edge);
      records.push(edge);
      version += 1;
      return edge;
    },

    has(type, from, to) {
      return records.some((edge) => {
        return edge.type === type && edge.from === from && edge.to === to;
      });
    },

    version() {
      return version;
    },

    records
  };
}

function createRelationIndex(relationFacts) {
  let indexedVersion = -1;
  let byType = new Map();
  let byTypeFrom = new Map();
  let byTypeTo = new Map();

  function ensureFresh() {
    const currentVersion = relationFacts.version();
    if (indexedVersion === currentVersion) return;

    byType = new Map();
    byTypeFrom = new Map();
    byTypeTo = new Map();

    for (const edge of relationFacts.all()) {
      addToMapSet(byType, edge.type, edge);
      addToMapSet(byTypeFrom, relationKey(edge.type, edge.from), edge);
      if (edge.to !== undefined) {
        addToMapSet(byTypeTo, relationKey(edge.type, edge.to), edge);
      }
    }

    indexedVersion = currentVersion;
  }

  return {
    edges(type, options = {}) {
      ensureFresh();
      if (options.from !== undefined) {
        return [...(byTypeFrom.get(relationKey(type, options.from)) || [])].filter((edge) => {
          return options.to === undefined || edge.to === options.to;
        });
      }
      if (options.to !== undefined) {
        return [...(byTypeTo.get(relationKey(type, options.to)) || [])];
      }
      return [...(byType.get(type) || [])];
    },

    targets(type, from) {
      return this.edges(type, { from }).map((edge) => edge.to);
    },

    sources(type, to) {
      return this.edges(type, { to }).map((edge) => edge.from);
    }
  };
}

function createGraph(data) {
  const registry = createObjectRegistry(data.objects);
  const relationFacts = createRelationFacts(registry, data.relations);
  const relationIndex = createRelationIndex(relationFacts);

  return {
    data,
    registry,
    relationFacts,
    relationIndex
  };
}

function findPath(index, { relationType, from, to }) {
  const queue = [{ id: from, path: [] }];
  const seen = new Set([from]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.id === to) return current.path;

    for (const edge of index.edges(relationType, { from: current.id })) {
      if (seen.has(edge.to)) continue;
      seen.add(edge.to);
      queue.push({
        id: edge.to,
        path: [...current.path, edge]
      });
    }
  }

  return undefined;
}

function findAncestors(index, { relationType, of }) {
  const ancestors = [];
  const queue = index.edges(relationType, { to: of }).map((edge) => ({
    id: edge.from,
    path: [edge]
  }));
  const seen = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (seen.has(current.id)) continue;
    seen.add(current.id);
    ancestors.push(current);

    for (const edge of index.edges(relationType, { to: current.id })) {
      queue.push({
        id: edge.from,
        path: [...current.path, edge]
      });
    }
  }

  return ancestors;
}

function containmentPath(graph, scopeId, objectId) {
  return findPath(graph.relationIndex, {
    relationType: "contains",
    from: scopeId,
    to: objectId
  });
}

function containmentAncestors(graph, objectId) {
  return findAncestors(graph.relationIndex, {
    relationType: "contains",
    of: objectId
  });
}

function buildContainmentTree(graph, rootId, options = {}) {
  const includeTypes = options.includeTypes ? new Set(options.includeTypes) : undefined;
  const root = graph.registry.get(rootId);
  const children = graph.relationIndex
    .targets("contains", rootId)
    .map((childId) => buildContainmentTree(graph, childId, options))
    .filter((node) => !includeTypes || includeTypes.has(node.object.type))
    .sort((left, right) => bySlugThenId(left.object, right.object));

  return {
    id: root.id,
    type: root.type,
    slug: root.slug,
    title: root.title,
    object: root,
    projection: {
      relation: "contains",
      identity: "stable-id"
    },
    children
  };
}

function assertKnownEndpoints(registry, edge) {
  registry.get(edge.from);
  if (edge.to !== undefined) {
    registry.get(edge.to);
  }
}

function relationKey(type, id) {
  return `${type}\0${id}`;
}

function addToMapSet(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function bySlugThenId(left, right) {
  return (left.slug || left.id).localeCompare(right.slug || right.id) || left.id.localeCompare(right.id);
}

module.exports = {
  buildContainmentTree,
  containmentAncestors,
  containmentPath,
  createGraph,
  createObjectRegistry,
  createRelationFacts,
  createRelationIndex,
  findAncestors,
  findPath
};

import {
  Champion,
  ChampionConstellation,
  ConstellationNode,
  ConstellationConnection
} from "@/types";

export const isNodeUnlockable = (
  nodeId: string,
  constellation: ChampionConstellation,
  unlockedNodes: string[]
): boolean => {
  if (unlockedNodes.includes(nodeId)) return false;

  const incoming = constellation.connections.filter((c) => c.to === nodeId);
  if (incoming.length === 0) return true;

  return incoming.some((c) => unlockedNodes.includes(c.from));
};

export const lockNodeAndDownstream = (
  nodeId: string,
  constellation: ChampionConstellation,
  unlockedNodes: string[]
): string[] => {
  let nextUnlocked = unlockedNodes.filter((id) => id !== nodeId);

  const roots = constellation.nodes.filter((n) => {
    const incoming = constellation.connections.filter((c) => c.to === n.id);
    return incoming.length === 0;
  });

  let changed = true;
  while (changed) {
    const prevLength = nextUnlocked.length;
    nextUnlocked = nextUnlocked.filter((id) => {
      if (roots.some((r) => r.id === id)) return true;
      const incoming = constellation.connections.filter((c) => c.to === id);
      return incoming.some((c) => nextUnlocked.includes(c.from));
    });
    if (nextUnlocked.length === prevLength) {
      changed = false;
    }
  }

  return nextUnlocked;
};

export const computeStarsFromUnlockedNodes = (
  unlockedNodes: string[],
  nodes: ConstellationNode[]
): number => {
  return nodes.filter((n) => n.upgradeType === "Star Power" && unlockedNodes.includes(n.id)).length;
};

export const getConstellationMaxStars = (champ: Champion): number => {
  return champ.constellation?.nodes?.filter((n) => n.upgradeType === "Star Power").length || 0;
};

export const computeNodeStarLevel = (
  node: ConstellationNode,
  nodes: ConstellationNode[],
  connections: ConstellationConnection[]
): number => {
  if (node.upgradeType === "Star Power") {
    const idMatch = node.id.match(/_(\d+)$/);
    if (idMatch) {
      return parseInt(idMatch[1], 10);
    }
    const match = node.id.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    // Fallback: Compute based on the longest path of Star Power nodes leading to this node
    const getLongestStarPowerPath = (currId: string, visited: Set<string>): number => {
      if (visited.has(currId)) return 0;
      visited.add(currId);

      const currNode = nodes.find((n) => n.id === currId);
      const isStar = currNode?.upgradeType === "Star Power" ? 1 : 0;

      const incoming = connections.filter((c) => c.to === currId);
      if (incoming.length === 0) {
        return isStar;
      }

      let maxPredecessorStars = 0;
      for (const edge of incoming) {
        maxPredecessorStars = Math.max(
          maxPredecessorStars,
          getLongestStarPowerPath(edge.from, new Set(visited))
        );
      }

      return isStar + maxPredecessorStars;
    };

    return Math.max(1, getLongestStarPowerPath(node.id, new Set<string>()));
  }

  const visited = new Set<string>([node.id]);
  const queue: string[] = [];

  for (const conn of connections) {
    if (conn.from === node.id) {
      queue.push(conn.to);
      visited.add(conn.to);
    }
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodes.find((n) => n.id === currentId);
    if (currentNode) {
      if (currentNode.upgradeType === "Star Power") {
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
        const match = currentNode.id.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        return 1;
      }
      for (const conn of connections) {
        if (conn.from === currentId && !visited.has(conn.to)) {
          queue.push(conn.to);
          visited.add(conn.to);
        }
      }
    }
  }

  const predVisited = new Set<string>([node.id]);
  const predQueue: string[] = [];
  for (const conn of connections) {
    if (conn.to === node.id) {
      predQueue.push(conn.from);
      predVisited.add(conn.from);
    }
  }

  while (predQueue.length > 0) {
    const currentId = predQueue.shift()!;
    const currentNode = nodes.find((n) => n.id === currentId);
    if (currentNode) {
      if (currentNode.upgradeType === "Star Power") {
        const idMatch = currentNode.id.match(/_(\d+)$/);
        if (idMatch) return parseInt(idMatch[1], 10);
        const match = currentNode.id.match(/\d+/);
        if (match) return parseInt(match[0], 10);
        return 1;
      }
      for (const conn of connections) {
        if (conn.to === currentId && !predVisited.has(conn.from)) {
          predQueue.push(conn.from);
          predVisited.add(conn.from);
        }
      }
    }
  }

  return 1;
};

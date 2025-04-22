import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TeamtailorClient } from "./teamtailor.js";

if (!process.env.TEAMTAILOR_API_KEY) {
  throw new Error("Missing TEAMTAILOR_API_KEY environment variable");
}

const client = new TeamtailorClient(
  process.env.TEAMTAILOR_URL || "https://api.teamtailor.com/v1",
  process.env.TEAMTAILOR_API_KEY as string
);

const server = new McpServer({
  name: "teamtailor",
  version: "0.0.1"
});

server.tool(
  "teamtailor_list_candidates",
  "List and filter candidates.",
  {
    pageSize: z.number().default(10),
    page: z.number().default(1),
    filter: z.object({
      createdAfter: z.string().optional(),
      createdBefore: z.string().optional(),
      updatedAfter: z.string().optional(),
      updatedBefore: z.string().optional(),
    }).optional(),
  },
  async ({ pageSize, page, filter}) => {
    const candidates = await client.listCandidates({ page, perPage: pageSize, filter });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(candidates),
        }
      ]
    }
  }
);

server.tool(
  "teamtailor_get_candidate",
  "Get a single candidate by their id.",
  {
    candidateId: z.number(),
  },
  async ({ candidateId }) => {
    const candidate = await client.getCandidate(candidateId);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(candidate),
        }
      ]
    }
  }
);

export { server };
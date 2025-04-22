# mcp-teamtailor

The MCP Teamtailor is a Model Context Protocol (MCP) server that provides a simple integration with the [teamtailor api](https://docs.teamtailor.com/).

## Dependencies

No other dependencies are required to use the MCP Teamtailor server.

## Usage

MCP servers are configured differently depending on the client that you are using. For reference, this is how you would configure it using Claude Desktop.

```json
{
  "mcpServers": {
    "teamtailor": {
      "command": "npx",
      "args": [
        "-y",
        "@crunchloop/mcp-teamtailor"
      ],
      "env": {
        "TEAMTAILOR_URL": "https://api.teamtailor.com/v1",
        "TEAMTAILOR_API_KEY": "XXXX"
      }
    }
  }
}
```

## MCP Transport

At the moment, only `stdio` transport has been implemented.

## Tools

- **teamtailor_list_candidates** - List and filter candidates.
  - `pageSize`: The size of the page response (string, optional)
  - `page`: The page number to retrieve (string, optional)
  - `filter.createdAfter`: Filter candidates created after a specific date (string, optional)
  - `filter.createdBefore`: Filter candidates created before a specific date (string, optional)
  - `filter.updatedAfter`: Filter candidates updated after a specific date (string, optional)
  - `filter.updatedBefore`: Filter candidates updated before a specific date (string, optional)

- **teamtailor_get_candidate** - Get a single candidate by their id.
  - `candidateId`: The id of the candidate to retrieve (number, required)

## License

Released under the MIT License.  See the [LICENSE](./LICENSE) file for further details.

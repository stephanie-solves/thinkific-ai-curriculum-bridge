/**
 * Portfolio example from the Thinkific AI Curriculum Bridge.
 *
 * This sanitized example demonstrates how the integration combines
 * Thinkific REST metadata with richer GraphQL lesson content behind
 * a single MCP tool.
 *
 * Authentication credentials, private endpoints, and production
 * configuration are intentionally excluded.
 */

async function thinkificGraphQL(apiToken, query, variables = {}) {
  const response = await fetch(
    "https://api.thinkific.com/stable/graphql",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Thinkific GraphQL returned HTTP ${response.status}`
    );
  }

  if (body.errors?.length) {
    throw new Error("Thinkific GraphQL returned an error.");
  }

  return body.data;
}


// Simplified example of the MCP get_content workflow.

async function getContent(contentId, apiToken) {

  // REST provides the standard lesson metadata.
  const restResponse = await fetch(
    `https://api.thinkific.com/api/public/v1/contents/${contentId}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
      },
    }
  );

  const restData = await restResponse.json();


  // GraphQL provides richer text lesson content.
  const query = `
    query GetLessonContent($id: ID!) {
      lesson(id: $id) {
        id
        title
        lessonType
        content {
          __typename
          contentType
          id

          ... on TextContent {
            htmlDescription
          }
        }
      }
    }
  `;

  const graphData = await thinkificGraphQL(
    apiToken,
    query,
    { id: String(contentId) }
  );


  // The MCP tool can return one combined result to the AI.
  return {
    ...restData,
    graphql: graphData.lesson,
  };
}

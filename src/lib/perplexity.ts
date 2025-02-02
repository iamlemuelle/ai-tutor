export async function searchResources(query: string): Promise<any> {
  // Return mock data since we're in a WebContainer environment
  return {
    results: [
      {
        title: "Understanding " + query,
        url: "https://example.com/resource1",
        snippet: "This is a sample resource about " + query
      },
      {
        title: "Learn more about " + query,
        url: "https://example.com/resource2",
        snippet: "Additional information about " + query
      }
    ]
  };
}
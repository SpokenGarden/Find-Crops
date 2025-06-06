export async function getAmazonDeals(limit = 5) {
  const response = await fetch(`http://localhost:4000/api/deals?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch deals");
  const data = await response.json();
  return data.deals;
}
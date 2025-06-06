export async function getAmazonDeals(limit = 5) {
  const response = await fetch(`https://deals-hlcl.onrender.com/api/deals?limit=5`);
  if (!response.ok) throw new Error("Failed to fetch deals");
  const data = await response.json();
  return data.deals;
}

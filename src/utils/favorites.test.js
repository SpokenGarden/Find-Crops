import { buildFavoritePayload, makeItemId, normalizeFavoriteRecord } from "./favorites";

describe("favorites utilities", () => {
  const cropData = {
    Image: [{ label: "Photo", value: "african-daisy.jpg" }],
    Basics: [
      { label: "Type", value: "flower" },
      { label: "Hardy Zones", value: "2, 3, 4, 5, 6, 7, 8, 9, 10" },
      { label: "Kind", value: "Annual" },
      { label: "Flower Season", value: "Summer" },
    ],
    Care: [
      { label: "Sun", value: "Full Sun" },
      { label: "Water", value: "Low" },
      { label: "Soil", value: "Rich, well-draining" },
    ],
    Links: [{ label: "Buy Now", value: "https://bit.ly/AfroDaisy" }],
  };

  it("builds a canonical payload with stable favorite metadata", () => {
    const payload = buildFavoritePayload("African Daisy", cropData);

    expect(payload.favoriteMeta).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
        itemId: makeItemId("African Daisy"),
        itemName: "African Daisy",
        itemType: "flower",
        kind: "Annual",
        hardinessZones: "2, 3, 4, 5, 6, 7, 8, 9, 10",
        season: "Summer",
        image: "african-daisy.jpg",
        buyNowUrl: "https://bit.ly/AfroDaisy",
        vendor: null,
        sun: "Full Sun",
        water: "Low",
        soil: "Rich, well-draining",
      })
    );
    expect(payload.Basics).toEqual(cropData.Basics);
  });

  it("normalizes legacy rows with partial fields and strips bogus vendor hosts", () => {
    const favorite = normalizeFavoriteRecord({
      item_id: "african-daisy",
      vendor: "BIT.LY",
      payload: cropData,
    });

    expect(favorite.item_id).toBe("african-daisy");
    expect(favorite.item_name).toBe("African Daisy");
    expect(favorite.item_type).toBe("flower");
    expect(favorite.vendor).toBeNull();
    expect(favorite.payload.favoriteMeta).toEqual(
      expect.objectContaining({
        itemName: "African Daisy",
        itemType: "flower",
        vendor: null,
        image: "african-daisy.jpg",
      })
    );
  });
});

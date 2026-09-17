import { filterCrops } from "./filterCrops";

const baseCrop = (name, type) => ({
  name,
  Basics: [{ label: "Type", value: type }],
  Care: [{ label: "Sun", value: "Full Sun" }, { label: "Water", value: "Moderate" }, { label: "Soil", value: "Loamy" }],
});

describe("filterCrops single-mode behavior", () => {
  it("does not gate matches by mode anymore", () => {
    const crops = [
      { ...baseCrop("radish", "vegetable"), Sowing: [] },
      { ...baseCrop("basil", "herb"), Care: [] },
    ];

    const sowMatches = filterCrops(crops, { cropName: "radish", mode: "sow", category: "all" });
    const growMatches = filterCrops(crops, { cropName: "basil", mode: "grow", category: "all" });

    expect(sowMatches.map((crop) => crop.name)).toEqual(["radish"]);
    expect(growMatches.map((crop) => crop.name)).toEqual(["basil"]);
  });
});

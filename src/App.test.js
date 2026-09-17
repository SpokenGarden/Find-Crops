import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import GardenPlannerApp from "./App";

jest.mock("./hooks/useCropData", () => ({
  useCropData: jest.fn(),
}));

jest.mock("./context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("./hooks/useFavorites", () => ({
  useFavorites: jest.fn(),
}));

const { useCropData } = require("./hooks/useCropData");
const { useAuth } = require("./context/AuthContext");
const { useFavorites } = require("./hooks/useFavorites");

function render(ui) {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  return {
    container,
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

const cropData = {
  Tomato: {
    Basics: [
      { label: "Type", value: "Vegetable" },
      { label: "Hardy Zones", value: "5,6,7" },
    ],
    Sowing: [{ label: "Indoors", value: "4 to 6 before" }],
    Care: [
      { label: "Sun", value: "Full Sun" },
      { label: "Water", value: "Moderate" },
      { label: "Soil", value: "Loamy" },
    ],
    Image: [{ label: "Photo", value: "tomato.jpg" }],
  },
  Basil: {
    Basics: [
      { label: "Type", value: "Herb" },
      { label: "Hardy Zones", value: "5,6,7" },
    ],
    Sowing: [{ label: "Indoors", value: "3 to 4 before" }],
    Care: [
      { label: "Sun", value: "Full Sun" },
      { label: "Water", value: "Moderate" },
      { label: "Soil", value: "Loamy" },
    ],
    Image: [{ label: "Photo", value: "basil.jpg" }],
  },
  Daffodil: {
    Basics: [{ label: "Type", value: "Bulb" }],
    Image: [{ label: "Photo", value: "daffodil.jpg" }],
  },
};

describe("App banner search integration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useCropData.mockReturnValue({
      cropData,
      loading: false,
      error: null,
      lastUpdated: "2026-09-01T00:00:00.000Z",
    });
    useAuth.mockReturnValue({
      user: null,
      signOut: jest.fn(),
    });
    useFavorites.mockReturnValue({
      count: 0,
      isFavorite: jest.fn(() => false),
      toggleFavorite: jest.fn(async () => ({})),
      favorites: {},
      removeFavoriteById: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("resets advanced filters and runs a direct crop search from banner click", () => {
    const view = render(<GardenPlannerApp />);

    expect(view.container.textContent.toLowerCase()).not.toContain("daffodil");

    const advancedToggle = view.container.querySelector(".gp-toggle-advanced");
    act(() => {
      advancedToggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const form = view.container.querySelector("form");
    const categorySelect = view.container.querySelector("select.gp-select");
    act(() => {
      categorySelect.value = "herb";
      categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    act(() => {
      form.dispatchEvent(new Event("submit", { bubbles: true }));
      jest.advanceTimersByTime(200);
    });

    const herbResultTitles = Array.from(view.container.querySelectorAll(".crop-card-title")).map(
      (node) => node.textContent.toLowerCase()
    );
    expect(herbResultTitles).toContain("basil");
    expect(herbResultTitles).not.toContain("tomato");

    const bannerButtons = Array.from(view.container.querySelectorAll(".top-plant-banner-item"));
    const tomatoButton = bannerButtons.find((node) =>
      node.textContent.toLowerCase().includes("tomato")
    );
    act(() => {
      tomatoButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      jest.advanceTimersByTime(200);
    });

    const resultTitles = Array.from(view.container.querySelectorAll(".crop-card-title")).map(
      (node) => node.textContent.toLowerCase()
    );
    expect(resultTitles).toContain("tomato");
    expect(resultTitles).not.toContain("basil");

    const advancedToggleAfterSearch = view.container.querySelector(".gp-toggle-advanced");
    expect(advancedToggleAfterSearch.textContent).toContain("Show Advanced Filters");

    act(() => {
      advancedToggleAfterSearch.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const updatedInputs = view.container.querySelectorAll("input.gp-input");
    const updatedZoneInput = updatedInputs[1];
    const resetCategorySelect = view.container.querySelector("select.gp-select");
    expect(updatedZoneInput.value).toBe("");
    expect(resetCategorySelect.value).toBe("all");

    view.unmount();
  });
});

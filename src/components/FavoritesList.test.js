import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import FavoritesList from "./FavoritesList";

jest.mock("../hooks/useFavorites", () => ({
  useFavorites: jest.fn(),
}));

const { useFavorites } = require("../hooks/useFavorites");

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

describe("FavoritesList", () => {
  it('renders compact card details without a bogus "BIT.LY" heading', () => {
    useFavorites.mockReturnValue({
      favorites: {
        "african-daisy": {
          item_name: "African Daisy",
          item_type: "flower",
          vendor: null,
          payload: {
            favoriteMeta: {
              itemType: "flower",
              kind: "Annual",
              hardinessZones: "2, 3, 4, 5, 6, 7, 8, 9, 10",
              sun: "Full Sun",
              image: "african-daisy.jpg",
            },
          },
        },
      },
      removeFavoriteById: jest.fn(),
      count: 1,
    });

    const view = render(<FavoritesList onClose={jest.fn()} onNeedsAuth={jest.fn()} />);

    expect(view.container.textContent).toContain("African Daisy");
    expect(view.container.textContent).toContain("Flower • Annual");
    expect(view.container.textContent).toContain("Zones 2, 3, 4, 5, 6, 7, 8, 9, 10");
    expect(view.container.textContent).toContain("Sun: Full Sun");
    expect(view.container.textContent).not.toContain("BIT.LY");

    view.unmount();
  });
});

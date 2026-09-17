import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import TopPlantBanner from "./TopPlantBanner";

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

describe("TopPlantBanner", () => {
  it("renders featured plant buttons", () => {
    const view = render(
      <TopPlantBanner crops={[{ name: "Tomato", data: {} }, { name: "Zinnia", data: {} }]} />
    );
    const items = view.container.querySelectorAll(".top-plant-banner-item");
    expect(items.length).toBe(2);
    expect(view.container.textContent).toContain("Tomato");
    expect(view.container.textContent).toContain("Zinnia");
    view.unmount();
  });

  it("fires onSearchCrop when a thumbnail is clicked", () => {
    const onSearchCrop = jest.fn();
    const view = render(
      <TopPlantBanner crops={[{ name: "Basil", data: {} }]} onSearchCrop={onSearchCrop} />
    );

    const button = view.container.querySelector(".top-plant-banner-item");
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onSearchCrop).toHaveBeenCalledWith("Basil");
    view.unmount();
  });

  it("marks the active crop", () => {
    const view = render(
      <TopPlantBanner crops={[{ name: "Pepper", data: {} }]} activeCropName="pepper" />
    );
    const button = view.container.querySelector(".top-plant-banner-item");
    expect(button.className).toContain("is-active");
    view.unmount();
  });
});

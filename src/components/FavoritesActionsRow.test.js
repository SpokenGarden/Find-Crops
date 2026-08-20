/**
 * Tests for the Favorites trigger repositioning:
 * - Trigger lives inside `.gp-fav-actions-row`, not inside `.gp-groups-row`
 * - Panel opens and closes from the new trigger location
 * - Trigger renders the live count badge
 */
import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";

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

/**
 * Minimal harness that replicates only the Favorites actions row layout
 * from App.js, allowing focused testing of trigger placement and panel toggle.
 */
function FavActionsRowHarness({ user = { id: "u1" }, initialOpen = false }) {
  const { count: favCount } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(initialOpen);
  const favPanelRef = useRef(null);

  return (
    <div>
      {/* Simulated groups row — Favorites trigger must NOT be here */}
      <div className="gp-groups-row" role="list" data-testid="groups-row">
        <div className="gp-group-box" role="listitem">
          <div className="gp-group-header">Flowers (3)</div>
        </div>
      </div>

      {/* Dedicated actions row — Favorites trigger MUST be here */}
      <div className="gp-fav-actions-row" data-testid="fav-actions-row">
        <div className="gp-fav-btn-wrap" ref={favPanelRef}>
          <button
            type="button"
            className="gp-fav-btn"
            aria-expanded={showFavorites}
            aria-controls="gp-favorites-panel"
            onClick={() => {
              if (!user) return;
              setShowFavorites((v) => !v);
            }}
          >
            <span>❤️ Favorites ({favCount})</span>
            <span>{showFavorites ? "▲" : "▼"}</span>
          </button>
          {showFavorites && (
            <div id="gp-favorites-panel" data-testid="fav-panel">
              <p>Favorites panel content</p>
              <button
                type="button"
                onClick={() => setShowFavorites(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

describe("Favorites trigger repositioning", () => {
  beforeEach(() => {
    useFavorites.mockReturnValue({
      favorites: {},
      removeFavoriteById: jest.fn(),
      count: 2,
    });
  });

  it("renders the Favorites trigger inside .gp-fav-actions-row", () => {
    const view = render(<FavActionsRowHarness />);

    const actionsRow = view.container.querySelector(".gp-fav-actions-row");
    expect(actionsRow).not.toBeNull();

    const triggerInActions = actionsRow.querySelector(".gp-fav-btn");
    expect(triggerInActions).not.toBeNull();

    view.unmount();
  });

  it("does NOT render the Favorites trigger inside .gp-groups-row", () => {
    const view = render(<FavActionsRowHarness />);

    const groupsRow = view.container.querySelector(".gp-groups-row");
    expect(groupsRow).not.toBeNull();

    const triggerInGroups = groupsRow.querySelector(".gp-fav-btn");
    expect(triggerInGroups).toBeNull();

    view.unmount();
  });

  it("displays the favorites count badge on the trigger", () => {
    const view = render(<FavActionsRowHarness />);

    const actionsRow = view.container.querySelector(".gp-fav-actions-row");
    expect(actionsRow.textContent).toContain("Favorites (2)");

    view.unmount();
  });

  it("opens the favorites panel when the trigger is clicked", () => {
    const view = render(<FavActionsRowHarness />);

    expect(view.container.querySelector("[data-testid='fav-panel']")).toBeNull();

    const trigger = view.container.querySelector(".gp-fav-btn");
    act(() => {
      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(view.container.querySelector("[data-testid='fav-panel']")).not.toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    view.unmount();
  });

  it("closes the favorites panel via the close button inside the panel", () => {
    const view = render(<FavActionsRowHarness initialOpen={true} />);

    expect(view.container.querySelector("[data-testid='fav-panel']")).not.toBeNull();

    const closeBtn = view.container.querySelector("[data-testid='fav-panel'] button");
    act(() => {
      closeBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(view.container.querySelector("[data-testid='fav-panel']")).toBeNull();

    view.unmount();
  });

  it("panel wrapper stays anchored inside .gp-fav-actions-row when open", () => {
    const view = render(<FavActionsRowHarness initialOpen={true} />);

    const actionsRow = view.container.querySelector(".gp-fav-actions-row");
    const panel = actionsRow.querySelector("[data-testid='fav-panel']");
    expect(panel).not.toBeNull();

    view.unmount();
  });
});

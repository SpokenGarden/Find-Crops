import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { useOutsideClick } from "./useOutsideClick";

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

function Harness({ onOutsideClick }) {
  const ref = useRef(null);
  useOutsideClick(ref, onOutsideClick, true);

  return (
    <div>
      <div ref={ref}>
        <button type="button">Inside</button>
      </div>
      <button type="button">Outside</button>
    </div>
  );
}

describe("useOutsideClick", () => {
  it("ignores inside clicks and only closes on a real outside click", () => {
    const onOutsideClick = jest.fn();
    const view = render(<Harness onOutsideClick={onOutsideClick} />);
    const [insideButton, outsideButton] = view.container.querySelectorAll("button");

    act(() => {
      insideButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onOutsideClick).not.toHaveBeenCalled();

    act(() => {
      outsideButton.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    });
    expect(onOutsideClick).not.toHaveBeenCalled();

    act(() => {
      outsideButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onOutsideClick).toHaveBeenCalledTimes(1);

    view.unmount();
  });
});

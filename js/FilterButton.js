/**
 * FilterButton class represents a button that can be clicked to filter some data.
 */
export default class FilterButton {
  /**
   * Constructor for the FilterButton class.
   * @param {HTMLElement} element - The HTML element associated with the button.
   * @param {function} onClickCallback - The callback function to be called when the button is clicked.
   * @param {string} selector - The CSS selector used to initialize this button.
   */
  constructor(element, onClickCallback, selector) {
    this.element = element;
    this.id = element.id;
    this.isActive = element.classList.contains("active");
    this.onClickCallback = onClickCallback;
    this.selector = selector;

    this.element.addEventListener("click", () => this.onClick());
  }

  /**
   * Handles the click event for the button.
   * Deactivates all buttons with the same selector, activates the clicked button, and calls the onClickCallback function.
   */
  onClick() {
    FilterButton.instancesBySelector
      .get(this.selector)
      .forEach((btn) => btn.deactivate());
    this.activate();
    if (this.onClickCallback) {
      this.onClickCallback(this.id);
    }
  }

  /**
   * Activates the button by adding the "active" class, setting isActive to true, and setting aria-pressed to true.
   */
  activate() {
    this.element.classList.add("active");
    this.element.setAttribute("aria-pressed", "true");
    this.isActive = true;
  }

  /**
   * Deactivates the button by removing the "active" class, setting isActive to false, and setting aria-pressed to false.
   */
  deactivate() {
    this.element.classList.remove("active");
    this.element.removeAttribute("aria-pressed");
    this.isActive = false;
  }

  /**
   * Static property to hold instances of FilterButton by selector.
   */
  static instancesBySelector = new Map();

  /**
   * Static method to initialize all instances of FilterButton.
   * @param {string} selector - The CSS selector to find the elements.
   * @param {function} onClickCallback - The callback function to be called when a button is clicked.
   */
  static initializeAll(selector, onClickCallback) {
    const elements = document.querySelectorAll(selector);
    const instances = Array.from(elements).map(
      (el) => new FilterButton(el, onClickCallback, selector)
    );
    FilterButton.instancesBySelector.set(selector, instances);
  }
}
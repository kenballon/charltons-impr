/**
 * FilterButton class represents a button that can be clicked to filter some data.
 */
export default class FilterButton {
  /**
   * Constructor for the FilterButton class.
   * @param {HTMLElement} element - The HTML element associated with the button.
   * @param {function} onClickCallback - The callback function to be called when the button is clicked.
   */
  constructor(element, onClickCallback) {
    this.element = element;
    this.id = element.id;
    this.isActive = element.classList.contains("active");
    this.onClickCallback = onClickCallback;

    this.element.addEventListener("click", () => this.onClick());
  }

  /**
   * Handles the click event for the button.
   * Deactivates all buttons, activates the clicked button, and calls the onClickCallback function.
   */
  onClick() {
    FilterButton.allInstances.forEach((btn) => btn.deactivate());
    this.activate();
    if (this.onClickCallback) {
      this.onClickCallback(this.id);
    }
  }

  /**
   * Activates the button by adding the "active" class and setting isActive to true.
   */
  activate() {
    this.element.classList.add("active");
    this.isActive = true;
  }

  /**
   * Deactivates the button by removing the "active" class and setting isActive to false.
   */
  deactivate() {
    this.element.classList.remove("active");
    this.isActive = false;
  }

  /**
   * Static property to hold all instances of FilterButton.
   */
  static allInstances = [];

  /**
   * Static method to initialize all instances of FilterButton.
   * @param {string} selector - The CSS selector to find the elements.
   * @param {function} onClickCallback - The callback function to be called when a button is clicked.
   */
  static initializeAll(selector, onClickCallback) {
    const elements = document.querySelectorAll(selector);
    FilterButton.allInstances = Array.from(elements).map(
      (el) => new FilterButton(el, onClickCallback)
    );
  }
}
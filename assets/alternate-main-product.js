class Accordion {
  constructor(domNode) {
    this.rootEl = domNode;
    this.buttonEl = this.rootEl.querySelector("button[aria-expanded]");

    const controlsId = this.buttonEl.getAttribute("aria-controls");
    this.contentEl = document.getElementById(controlsId);

    this.open = this.buttonEl.getAttribute("aria-expanded") === "true";

    // add event listeners
    this.buttonEl.addEventListener("click", this.onButtonClick.bind(this));
  }

  onButtonClick() {
    this.toggle(!this.open);
  }

  toggle(open) {
    // don't do anything if the open state doesn't change
    if (open === this.open) {
      return;
    }

    // update the internal state
    this.open = open;

    // handle DOM updates
    this.buttonEl.setAttribute("aria-expanded", `${open}`);
    if (open) {
      this.contentEl.removeAttribute("hidden");
    } else {
      this.contentEl.setAttribute("hidden", "");
    }
  }

  // Add public open and close methods for convenience
  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }
}

const form = document.getElementById("product-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetch(event.target.action + ".js", {
    method: event.target.method,
    body: new FormData(event.target),
    headers: {
      "X-Request-Width": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then(response => {
      console.log(response)
      const event = new CustomEvent('cart:added', {
        detail: {
          header: response.sections['alternate-header'],
        },
        bubbles: true
      })

      form.dispatchEvent(event)
    })
    .catch(console.error);
});

Shopify.theme.sections.register("alternate-main-product", {
  // customElement: null,
  accordion: null,

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function () {
    // Do something when a section instance is loaded
    console.log("Section loaded:", this);
    const accordions = document.querySelectorAll(
      ".collapsible-tabe .collapsible-item"
    );
    accordions.forEach((accordionEl) => {
      this.accordion = new Accordion(accordionEl);
    });
    // this.customElement = this.container.getElementsByTagName('custom-element')[0] || null
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function () {
    // Do something when a section instance is unloaded
    console.log("Section unloaded:", this);

    // this.accordion.destroy()
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function () {
    // this.accordion.stop()
    // Do something when a section instance is selected
    // if (!this.customElement) return;
    // this.customElement.select()
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function () {
    this.accordion.close();
    // Do something when a section instance is deselected
  },

  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect: function (event) {
    console.log("dfdf", this.accordion);
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect: function (event) {
    // Do something when a section block is deselected
  },
});

// Alpine.js dropdown fix
// This script fixes the dropdown functionality for Alpine.js generated dropdowns
// It should be loaded after Alpine.js and Bootstrap

// Function to initialize dropdowns
function initDropdowns() {
  // Find all dropdown toggle elements
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Initialize Bootstrap dropdowns
  dropdownToggles.forEach(toggle => {
    // Remove existing event listeners
    toggle.removeEventListener('click', toggleDropdown);
    toggle.removeEventListener('mouseenter', handleDropdownHover);

    // Add click event listener to toggle dropdown
    toggle.addEventListener('click', toggleDropdown);

    // Add hover event listener for desktop
    if (window.innerWidth >= 992) {
      toggle.addEventListener('mouseenter', handleDropdownHover);

      // Add hover event to parent dropdown
      const dropdownItem = toggle.closest('.dropdown');
      if (dropdownItem) {
        dropdownItem.removeEventListener('mouseenter', handleParentHover);
        dropdownItem.removeEventListener('mouseleave', handleParentLeave);

        dropdownItem.addEventListener('mouseenter', handleParentHover);
        dropdownItem.addEventListener('mouseleave', handleParentLeave);
      }
    }
  });

  // Also initialize dropdown menus for hover
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  dropdownMenus.forEach(menu => {
    if (window.innerWidth >= 992) {
      menu.removeEventListener('mouseenter', handleMenuHover);
      menu.addEventListener('mouseenter', handleMenuHover);
    }
  });

}

// Function to toggle dropdown on click
function toggleDropdown(e) {
  e.preventDefault();
  e.stopPropagation();

  // Find parent dropdown item
  const dropdownItem = this.closest('.dropdown');

  // Toggle dropdown menu
  const dropdownMenu = dropdownItem.querySelector('.dropdown-menu');
  if (dropdownMenu) {
    // Close all other dropdowns
    document.querySelectorAll('.dropdown-menu.show, .dropdown-menu.open').forEach(menu => {
      if (menu !== dropdownMenu) {
        menu.classList.remove('show');
        menu.classList.remove('open');
        const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
        const parent = menu.closest('.dropdown');
        if (parent) {
          parent.classList.remove('open');
        }
      }
    });

    // Toggle current dropdown
    dropdownMenu.classList.toggle('show');
    dropdownMenu.classList.toggle('open');
    this.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));

    // Also toggle open class on parent
    if (dropdownItem) {
      dropdownItem.classList.toggle('open');
    }
  }
}

// Function to handle dropdown hover
function handleDropdownHover(e) {
  if (window.innerWidth < 992) return; // Only apply hover on desktop

  // Find parent dropdown item
  const dropdownItem = this.closest('.dropdown');

  // Show dropdown menu
  const dropdownMenu = dropdownItem.querySelector('.dropdown-menu');
  if (dropdownMenu) {
    // Close all other dropdowns at the same level
    const parentNav = dropdownItem.closest('.navbar-nav');
    if (parentNav) {
      parentNav.querySelectorAll(':scope > .dropdown').forEach(item => {
        if (item !== dropdownItem) {
          const menu = item.querySelector('.dropdown-menu');
          if (menu) {
            menu.classList.remove('show');
            menu.classList.remove('open');
          }
          item.classList.remove('open');
          const toggle = item.querySelector('.dropdown-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    // Show current dropdown
    dropdownMenu.classList.add('show');
    dropdownMenu.classList.add('open');
    this.setAttribute('aria-expanded', 'true');
    dropdownItem.classList.add('open');
  }
}

// Function to handle parent dropdown hover
function handleParentHover(e) {
  if (window.innerWidth < 992) return; // Only apply hover on desktop

  const dropdownMenu = this.querySelector('.dropdown-menu');
  const toggle = this.querySelector('.dropdown-toggle');

  if (dropdownMenu) {
    dropdownMenu.classList.add('show');
    dropdownMenu.classList.add('open');
    this.classList.add('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
  }
}

// Function to handle parent dropdown leave
function handleParentLeave(e) {
  if (window.innerWidth < 992) return; // Only apply hover on desktop

  // Don't close if moving to a child element
  if (e.relatedTarget && this.contains(e.relatedTarget)) return;

  const dropdownMenu = this.querySelector('.dropdown-menu');
  const toggle = this.querySelector('.dropdown-toggle');

  if (dropdownMenu) {
    dropdownMenu.classList.remove('show');
    dropdownMenu.classList.remove('open');
    this.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  }
}

// Function to handle dropdown menu hover
function handleMenuHover(e) {
  if (window.innerWidth < 992) return; // Only apply hover on desktop

  // Keep menu open when hovering over it
  this.classList.add('show');
  this.classList.add('open');

  const parent = this.closest('.dropdown');
  if (parent) {
    parent.classList.add('open');
    const toggle = parent.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.show, .dropdown-menu.open').forEach(menu => {
      menu.classList.remove('show');
      menu.classList.remove('open');
      const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      const parent = menu.closest('.dropdown');
      if (parent) {
        parent.classList.remove('open');
      }
    });
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reinitialize dropdowns when window size changes
  initDropdowns();
});

// Initialize dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dropdowns
  initDropdowns();

  // Re-initialize dropdowns after Alpine.js updates the DOM
  // This is a fallback in case Alpine.js updates the DOM after initial load
  setTimeout(initDropdowns, 1000);

  // Also set up a periodic check for new dropdowns (in case Alpine.js adds them later)
  setInterval(initDropdowns, 2000);
});

// Initialize immediately as well
initDropdowns();

// Log when the script is loaded
// console.log('Alpine.js dropdown fix loaded with hover support');

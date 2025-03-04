/**
 * Initialize UI elements on page load
 */
function initUI() {
    // Initialize color picker with default value
    document.getElementById('arrow-color').value = '#ff0000';
    document.getElementById('arrow-color-text').value = '#ff0000';
    
    // Clear any existing content
    document.getElementById('input-html').value = '';
    document.getElementById('output-html').value = '';
    document.getElementById('preview-container').innerHTML = '<p>No content to preview</p>';
    
    // Initialize dark mode based on user preference
    initThemeToggle();
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check if user previously set a preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Set up theme toggle listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        // Update preview if it exists
        updatePreview();
    });
    
    // Also check system preference if no saved preference
    if (!savedTheme) {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
            localStorage.setItem('theme', 'dark');
        }
    }
}

/**
 * Copy text from an element to clipboard
 * @param {string} elementId - ID of the element containing text to copy
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.select();
    document.execCommand('copy');
    
    // Show feedback
    showFeedback('Copied to clipboard!');
}

/**
 * Show feedback message to user
 * @param {string} message - Message to display
 */
function showFeedback(message) {
    alert(message); // Simple feedback for now
}

/**
 * Toggle a UI element's visibility
 * @param {string} elementId - ID of the element to toggle
 */
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}
/**
 * Check if a string is a valid hex color
 * @param {string} color - Color string to validate
 * @return {boolean} True if valid hex color
 */
function isValidHexColor(color) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

/**
 * Generate a unique ID
 * @return {string} Unique ID string
 */
function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Escape HTML special characters
 * @param {string} html - HTML content to escape
 * @return {string} Escaped HTML
 */
function escapeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Format HTML code with indentation
 * @param {string} html - HTML content to format
 * @return {string} Formatted HTML
 */
function formatHTML(html) {
    let formatted = '';
    let indent = '';
    
    // Simple formatting - this could be improved for production
    html.split(/>\s*</).forEach(function(node) {
        if (node.match(/^\/\w/)) {
            // Closing tag
            indent = indent.substring(2);
        }
        
        formatted += indent + '<' + node + '>\r\n';
        
        if (!node.match(/^(img|hr|br)/)) {
            // Not a self-closing tag
            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                // Opening tag
                indent += '  ';
            }
        }
    });
    
    return formatted.substring(1, formatted.length - 3);
}

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
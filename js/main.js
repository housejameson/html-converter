/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load templates
    loadTemplates().then(() => {
        // Initialize UI elements
        initUI();
        
        // Setup event listeners
        setupEventListeners();
    });
});

/**
 * Load templates from files
 */
async function loadTemplates() {
    try {
        // Fetch the FAQ template
        const faqTemplateResponse = await fetch('templates/faq.html');
        const faqTemplate = await faqTemplateResponse.text();
        
        // Store in template container
        const templateContainer = document.getElementById('template-container');
        const faqDiv = document.createElement('div');
        faqDiv.id = 'faq-template';
        faqDiv.innerHTML = faqTemplate;
        templateContainer.appendChild(faqDiv);
        
        // Fetch the FAQ CSS
        const faqCssResponse = await fetch('css/templates/faq.css');
        const faqCss = await faqCssResponse.text();
        
        // Store CSS in template container
        const faqCssDiv = document.createElement('div');
        faqCssDiv.id = 'faq-template-css';
        faqCssDiv.textContent = faqCss;
        templateContainer.appendChild(faqCssDiv);
        
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Convert button
    document.getElementById('convert-btn').addEventListener('click', function() {
        const inputHtml = document.getElementById('input-html').value;
        const convertedHtml = convertHtmlToTemplate(inputHtml);
        document.getElementById('output-html').value = convertedHtml;
        updatePreview(); // This automatically updates the preview
    });
    
    // Clear input button
    document.getElementById('clear-input-btn').addEventListener('click', function() {
        document.getElementById('input-html').value = '';
    });
    
    // Copy output button
    document.getElementById('copy-output-btn').addEventListener('click', function() {
        copyToClipboard('output-html');
    });
    
    // Automatically update the preview when output changes
    document.getElementById('output-html').addEventListener('input', debounce(updatePreview, 500));
    
    // Preview updates automatically, so no refresh button is needed
    
    // Color picker events
    document.getElementById('arrow-color').addEventListener('input', function() {
        document.getElementById('arrow-color-text').value = this.value;
        updatePreview();
    });
    
    document.getElementById('arrow-color-text').addEventListener('input', function() {
        if (isValidHexColor(this.value)) {
            document.getElementById('arrow-color').value = this.value;
            updatePreview();
        }
    });
}
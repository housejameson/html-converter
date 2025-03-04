/**
 * Template Manager for managing template registration and access
 */
const templateManager = {
    templates: {},
    currentTemplate: 'faq',
    
    /**
     * Register a template with the manager
     * @param {string} id - Template ID
     * @param {Object} config - Template configuration
     */
    registerTemplate: function(id, config) {
        this.templates[id] = {
            config: config,
            name: config.name,
            description: config.description
        };
        console.log(`Template registered: ${id}`);
    },
    
    /**
     * Set the current template
     * @param {string} id - Template ID to set as current
     */
    setCurrentTemplate: function(id) {
        if (this.templates[id]) {
            this.currentTemplate = id;
            console.log(`Current template set to: ${id}`);
            return true;
        }
        console.error(`Template not found: ${id}`);
        return false;
    },
    
    /**
     * Get a template by ID
     * @param {string} id - Template ID
     * @return {Object} Template object or null if not found
     */
    getTemplate: function(id) {
        return this.templates[id] || null;
    },
    
    /**
     * Update template selector dropdown
     */
    updateTemplateSelector: function() {
        const templateSelect = document.getElementById('template-select');
        if (!templateSelect) return;
        
        // Clear existing options
        templateSelect.innerHTML = '';
        
        // Add options for each template
        Object.keys(this.templates).forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = this.templates[id].name;
            templateSelect.appendChild(option);
        });
        
        // Set the current template as selected
        templateSelect.value = this.currentTemplate;
        
        console.log('Template selector updated with options:', Object.keys(this.templates));
    }
};

/**
 * Load templates from files
 */
async function loadTemplates() {
    try {
        // Array of templates to load
        const templates = ['faq', 'srp'];
        
        // Load each template
        for (const templateId of templates) {
            console.log(`Loading template: ${templateId}`);
            
            // Load the template configuration
            const configResponse = await fetch(`templates/${templateId}/config.json`);
            const config = await configResponse.json();
            
            // Load the template HTML
            const templateResponse = await fetch(`templates/${templateId}/template.html`);
            const templateHtml = await templateResponse.text();
            
            // Create template container
            const templateContainer = document.getElementById('template-container');
            const templateDiv = document.createElement('div');
            templateDiv.id = `${templateId}-template`;
            templateDiv.innerHTML = templateHtml;
            templateContainer.appendChild(templateDiv);
            
            // Load the template CSS
            const cssResponse = await fetch(`templates/${templateId}/template.css`);
            const cssContent = await cssResponse.text();
            
            // Create CSS container
            const cssDiv = document.createElement('div');
            cssDiv.id = `${templateId}-template-css`;
            cssDiv.textContent = cssContent;
            templateContainer.appendChild(cssDiv);
            
            // Register template with the template manager
            templateManager.registerTemplate(templateId, config);
        }
        
        // Update the template selector dropdown
        templateManager.updateTemplateSelector();
        
        console.log('All templates loaded successfully');
        
        // Set up template selector change event
        const templateSelect = document.getElementById('template-select');
        templateSelect.addEventListener('change', function() {
            const selectedTemplate = this.value;
            templateManager.setCurrentTemplate(selectedTemplate);
            
            // Show/hide template-specific customization options
            toggleTemplateOptions(selectedTemplate);
            
            // Update preview if output exists
            if (document.getElementById('output-html').value.trim()) {
                updatePreview();
            }
        });
        
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

/**
 * Toggle visibility of template-specific options
 * @param {string} templateId - ID of the selected template
 */
function toggleTemplateOptions(templateId) {
    // Get the template configuration
    const template = templateManager.getTemplate(templateId);
    if (!template) return;
    
    // Toggle arrow color control for FAQ template
    const colorControl = document.querySelector('.color-control');
    if (colorControl) {
        colorControl.style.display = templateId === 'faq' ? 'flex' : 'none';
    }
    
    // You can add more template-specific option toggles here
}
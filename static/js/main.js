// Main JavaScript file for orbital energy web app

document.addEventListener('DOMContentLoaded', function() {
    console.log('Orbital Energy Web App loaded');
    
    // Handle tab switching
    handleTabSwitching();
});

function handleTabSwitching() {
    const tabs = document.querySelectorAll('.nav-tabs .tab');
    const tabContent = document.getElementById('tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('is-active'));
            
            // Add active class to clicked tab
            this.classList.add('is-active');
            
            // Get tab name and load content
            const tabName = this.getAttribute('data-tab');
            console.log('Switching to tab:', tabName);
            
            try {
                const response = await fetch(`/orbitals/tab/${tabName}/`);
                if (response.ok) {
                    const html = await response.text();
                    tabContent.innerHTML = html;
                } else {
                    console.error('Failed to load tab content');
                }
            } catch (error) {
                console.error('Error loading tab content:', error);
            }
        });
    });
}
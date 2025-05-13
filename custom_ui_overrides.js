(function() {
    // Run immediately and set up continuous monitoring
    applyImmediateChanges();
    const observer = new MutationObserver(checkAndApplyChanges);
    setInterval(applyImmediateChanges, 300);
    
    function checkAndHideAddButtons() {
        // Target specifically buttons starting with "Add"
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (btn && btn.innerText && btn.innerText.trim().toLowerCase().startsWith('add')) {
                btn.style.display = 'none';
            }
        });
    }
    
    function hideConnectionsSection() {
        // Hide connections section using the specific class
        const connectionSections = document.querySelectorAll('.row.form-dashboard-section.form-links');
        connectionSections.forEach(section => {
            section.style.display = 'none';
        });
    }
    
    function hideLikeAndCommentSymbols() {
        // Hide like symbols in list view (added like-icon)
        document.querySelectorAll('.like-action, .like-count, .like-icon').forEach(el => {
            el.style.display = 'none';
        });
        
        // Hide comment symbols/counts in list view
        document.querySelectorAll('.comment-count').forEach(el => {
            el.style.display = 'none';
        });
        
        // Hide mx-2 class elements which may be used for spacing these icons
        document.querySelectorAll('.mx-2').forEach(el => {
            // Check if the element is part of the like/comment system (to avoid hiding other mx-2 elements)
            if (el.closest('.list-row-col') || 
                el.closest('.list-row') || 
                el.classList.contains('like-action') || 
                el.classList.contains('comment-count')) {
                el.style.display = 'none';
            }
        });
    }
    
    function checkAndApplyChanges() {
        checkAndHideAddButtons();
        hideConnectionsSection();
        hideLikeAndCommentSymbols();
    }
    
    function applyImmediateChanges() {
        try {
            const route = frappe.get_route_str();
            // Skip if on Workspace/Home
            if (!route || route.toLowerCase().startsWith('workspaces/home')) return;
            
            // Handle form pages
            if (cur_frm) {
                const formSidebar = document.querySelector('.layout-side-section');
                if (formSidebar) formSidebar.style.display = 'none';
                
                const comments = document.querySelector('.comment-input-wrapper');
                if (comments) comments.style.display = 'none';
                
                // Hide primary action button only if it contains "Add"
                if (cur_frm.page && cur_frm.page.btn_primary) {
                    const btnText = cur_frm.page.btn_primary.text();
                    if (btnText && btnText.toLowerCase().startsWith('add')) {
                        cur_frm.page.btn_primary.hide();
                    }
                }
                
                // Hide menu-btn-group
                const menuBtnGroup = document.querySelector('.menu-btn-group');
                if (menuBtnGroup) menuBtnGroup.style.display = 'none';
            }
            
            // Handle list pages
            else if (route.includes('List/')) {
                const listSidebar = document.querySelector('.list-sidebar');
                if (listSidebar) listSidebar.style.display = 'none';
                
                // Hide menu-btn-group
                const menuBtnGroup = document.querySelector('.menu-btn-group');
                if (menuBtnGroup) menuBtnGroup.style.display = 'none';
            }
            
            // This runs on every change for both form and list views
            checkAndApplyChanges();
            
            // Start observing the document for changes
            observer.disconnect();
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } catch (e) {
            console.error("Error in UI customization:", e);
        }
    }
    
    // Listen for page changes and clicks
    $(document).on('page-change', applyImmediateChanges);
    $(document).on('click', () => setTimeout(applyImmediateChanges, 100));
    
    // Additional listeners for Frappe-specific events
    $(document).on('form-refresh', applyImmediateChanges);
    $(document).on('list-refresh', applyImmediateChanges);
    $(document).on('after-render', applyImmediateChanges);
    
    // Also watch for DOM mutations to catch dynamically added buttons
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
    
    // Add CSS that specifically targets "Add" buttons but preserves others
    const style = document.createElement('style');
    style.innerHTML = `
        body:not([data-route*="Workspaces/Home"]) .layout-side-section,
        body:not([data-route*="Workspaces/Home"]) .comment-input-wrapper,
        body:not([data-route*="Workspaces/Home"]) .list-sidebar {
            display: none !important;
        }
        
        body:not([data-route*="Workspaces/Home"]) .menu-btn-group {
            display: none !important;
        }
        
        /* Hide connections section */
        .row.form-dashboard-section.form-links {
            display: none !important;
        }
        
        /* Hide like and comment symbols */
        .like-action, .like-count, .comment-count, .like-icon {
            display: none !important;
        }
        
        /* Hide mx-2 class in list views */
        .list-row .mx-2, .list-row-col .mx-2 {
            display: none !important;
        }
        
        /* Dynamic class that will be added to buttons starting with "Add" */
        .hide-add-button {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log("Enhanced UI script loaded with improved button filtering, connections hiding, and like/comment hiding");
})();
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // --- Element Selections ---
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarLinksContainer = document.getElementById('sidebarLinks');
        const contentArea = document.querySelector('.content-area');
        const topBar = document.getElementById('topBar');
        const allSections = document.querySelectorAll('.page-section');
        const quickActionCards = document.querySelectorAll('.quick-action-card');

        // --- State ---
        let historyStack = ['mainContent'];
        let activeSectionId = 'mainContent';

        // --- Functions ---
        const updateClockAndBattery = () => {
            // Clock
            const now = new Date();
            document.getElementById('currentTime').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Battery (mocked for this example)
            if (navigator.getBattery) {
                navigator.getBattery().then(battery => {
                    document.getElementById('batteryLevel').textContent = `${Math.floor(battery.level * 100)}%`;
                });
            }
        };

        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
            contentArea.classList.toggle('sidebar-open');
            topBar.classList.toggle('sidebar-open');
        };

        const showSection = (sectionId, addToHistory = true) => {
            const sectionToShow = document.getElementById(sectionId);
            if (!sectionToShow || sectionId === activeSectionId) return;

            // Update content
            allSections.forEach(section => section.classList.remove('active'));
            sectionToShow.classList.add('active');
            
            // Update sidebar active link
            document.querySelectorAll('.sidebar-links a').forEach(link => {
                link.classList.toggle('active', link.dataset.section === sectionId);
            });

            if (addToHistory) {
                historyStack.push(sectionId);
            }
            activeSectionId = sectionId;

            // Close sidebar on mobile after navigation
            if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
                toggleSidebar();
            }
        };

        // --- Event Listeners ---
        sidebarToggle.addEventListener('click', toggleSidebar);

        sidebarLinksContainer.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.dataset.section) {
                e.preventDefault();
                showSection(link.dataset.section);
            }
        });
        
        quickActionCards.forEach(card => {
            card.addEventListener('click', () => {
                const sectionId = card.dataset.section;
                if (sectionId) {
                    showSection(sectionId);
                }
            });
        });

        document.getElementById('backButton').addEventListener('click', () => {
            if (historyStack.length > 1) {
                historyStack.pop();
                const previousSectionId = historyStack[historyStack.length - 1];
                showSection(previousSectionId, false);
            }
        });

        // --- Initial Setup ---
        updateClockAndBattery();
        setInterval(updateClockAndBattery, 10000); // Update every 10 seconds
        showSection('mainContent', true); // Show initial section
    });
</script>

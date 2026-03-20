// This file implements accordion functionality for collapsible sections, such as FAQs.

document.addEventListener('DOMContentLoaded', function () {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isActive = accordion.classList.contains('active');

            // Close all accordions
            accordions.forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If the clicked accordion was not active, open it
            if (!isActive) {
                accordion.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});
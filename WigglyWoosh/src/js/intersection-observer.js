// This file uses the Intersection Observer API to trigger animations or effects when elements come into view.

document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const elementsToObserve = document.querySelectorAll('.observe');

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add a class to trigger animations
                observer.unobserve(entry.target); // Stop observing once the element is visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    elementsToObserve.forEach(element => {
        observer.observe(element); // Start observing each element
    });
});
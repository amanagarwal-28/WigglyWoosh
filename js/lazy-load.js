document.addEventListener("DOMContentLoaded", function() {
    const lazyLoadImages = document.querySelectorAll("img.lazy");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                observer.unobserve(img);
            }
        });
    });

    lazyLoadImages.forEach(image => {
        imageObserver.observe(image);
    });
});
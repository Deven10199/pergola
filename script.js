// Mobile Navigation
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Portfolio Data 

 const portfolioItems = [
    {
        id: 1,
        title: "Modern Backyard Oasis",
        description: "A sleek aluminum pergola with motorized louvers and integrated LED lighting, creating the perfect entertainment space.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["residential", "with-louvers"],
        features: ["Motorized Louvers", "LED Lighting", "Outdoor Kitchen Integration"]
    },
    {
        id: 2,
        title: "Commercial Patio Cover",
        description: "Large-scale aluminum pergola for restaurant patio, featuring retractable shades and infrared heaters for year-round use.",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["commercial"],
        features: ["Commercial Grade", "Retractable Shades", "Infrared Heaters"]
    },
    {
        id: 3,
        title: "Poolside Paradise",
        description: "Custom aluminum pergola overlooking the pool, with adjustable louvers and ceiling fans for maximum comfort.",
        image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["residential", "with-louvers"],
        features: ["Poolside Design", "Adjustable Louvers", "Ceiling Fans", "Waterproof Lighting"]
    },
    {
        id: 4,
        title: "Minimalist Garden Retreat",
        description: "Clean-line aluminum pergola with climbing plant integration and subtle downlighting for evening ambiance.",
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["residential"],
        features: ["Minimalist Design", "Plant Integration", "Ambient Lighting"]
    },
    {
        id: 5,
        title: "Rooftop Terrace",
        description: "Urban rooftop pergola with wind-resistant design, built-in seating, and panoramic city views.",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["commercial", "residential"],
        features: ["Wind-Resistant", "Built-in Seating", "City Views", "Space Optimization"]
    },
    {
        id: 6,
        title: "Family Entertainment Area",
        description: "Spacious aluminum pergola with motorized screens, outdoor TV mounting, and full weather protection.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: ["residential", "with-louvers"],
        features: ["Motorized Screens", "TV Mounting", "Full Weather Protection", "Family-Sized"]
    }
];




// Portfolio Gallery
function initializePortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioModal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');

    // Render portfolio items
    function renderPortfolio(filter = 'all') {
        portfolioGrid.innerHTML = '';
        
        const filteredItems = filter === 'all' 
            ? portfolioItems 
            : portfolioItems.filter(item => item.category.includes(filter));
        
        filteredItems.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.dataset.id = item.id;
            portfolioItem.dataset.category = item.category.join(' ');
            
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.features.slice(0, 2).join(' • ')}</p>
                </div>
            `;
            
            portfolioItem.addEventListener('click', () => openModal(item));
            portfolioGrid.appendChild(portfolioItem);
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio
            const filter = button.dataset.filter;
            renderPortfolio(filter);
        });
    });

    // Modal functionality
    function openModal(item) {
        modalImage.src = item.image;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        
        // Clear and add features
        modalFeatures.innerHTML = '';
        item.features.forEach(feature => {
            const span = document.createElement('span');
            span.textContent = feature;
            modalFeatures.appendChild(span);
        });
        
        portfolioModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    modalClose.addEventListener('click', () => {
        portfolioModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    portfolioModal.addEventListener('click', (e) => {
        if (e.target === portfolioModal) {
            portfolioModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Initialize
    renderPortfolio();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePortfolio();
    
    // Add scroll animation for trust items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe trust items
    document.querySelectorAll('.trust-item').forEach(item => {
        observer.observe(item);
    });
});
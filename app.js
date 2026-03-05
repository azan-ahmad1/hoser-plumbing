import { servicesData, reviewsData } from './data.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        this.renderDynamicContent();
        this.setupRouter();
        this.setupMobileMenu();
        this.initIcons();
        this.injectSchema();
        this.setupImageLoading();
    }

    initIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    setupImageLoading() {
        // Add loading animation for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            if (img.complete) {
                img.style.opacity = '1';
            }
        });
    }

    setupRouter() {
        const navLinks = document.querySelectorAll('[data-route]');
        const sections = document.querySelectorAll('.page-section');
        
        const navigate = (route) => {
            // Update UI
            sections.forEach(sec => sec.classList.remove('active'));
            const activeSec = document.getElementById(`page-${route}`);
            if (activeSec) activeSec.classList.add('active');
            
            // Update URL silently
            window.history.pushState({}, '', `#${route}`);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            // Re-init icons for new content
            setTimeout(() => {
                this.initIcons();
            }, 100);
        };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.getAttribute('data-route');
                navigate(route);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.replace('#', '') || 'home';
            navigate(hash);
        });

        // Handle initial load
        const hash = window.location.hash.replace('#', '') || 'home';
        navigate(hash);
    }

    setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        }
    }

    renderDynamicContent() {
        // Render Home Services Grid with enhanced styling
        const homeServicesGrid = document.getElementById('home-services-grid');
        if (homeServicesGrid) {
            homeServicesGrid.innerHTML = servicesData.map(s => `
                <div class="service-card bg-white p-6 rounded-2xl shadow-soft hover-lift group">
                    <div class="relative mb-4 overflow-hidden rounded-xl">
                        <img src="${s.image}" alt="${s.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i data-lucide="${s.icon}" class="w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">${s.title}</h3>
                    <p class="text-slate-600">${s.short}</p>
                </div>
            `).join('');
        }

        // Render Full Services List with images
        const servicesFullList = document.getElementById('services-full-list');
        if (servicesFullList) {
            servicesFullList.innerHTML = servicesData.map(s => `
                <div class="service-card bg-white rounded-2xl shadow-soft overflow-hidden">
                    <div class="relative h-56 overflow-hidden">
                        <img src="${s.image}" alt="${s.title}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 text-white">
                            <div class="flex items-center gap-2">
                                <i data-lucide="${s.icon}" class="w-5 h-5 text-orange-400"></i>
                                <h3 class="text-2xl font-bold">${s.title}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="p-8">
                        <p class="text-slate-600 mb-4">${s.long || s.short}</p>
                        <h4 class="font-semibold mb-3 text-brand-900">Common issues we fix:</h4>
                        <ul class="grid grid-cols-2 gap-2 text-slate-600">
                            ${s.problems.map(p => `
                                <li class="flex items-center gap-2">
                                    <i data-lucide="check-circle" class="w-4 h-4 text-orange-500"></i>
                                    <span>${p}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        }

        // Render Reviews with enhanced styling
        const reviewsList = document.getElementById('reviews-list');
        if (reviewsList) {
            reviewsList.innerHTML = reviewsData.map(r => `
                <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover-lift border border-white/50">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex text-orange-400 gap-1">
                            ${Array(5).fill('<i data-lucide="star" class="w-5 h-5 fill-current"></i>').join('')}
                        </div>
                        <span class="text-sm text-slate-500">${r.date}</span>
                    </div>
                    <p class="text-slate-700 mb-4 italic">"${r.text}"</p>
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span class="text-orange-600 font-bold">${r.name.charAt(0)}</span>
                        </div>
                        <p class="font-semibold ml-3">- ${r.name}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    injectSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Plumber",
            "name": "Hoser Plumbing Inc",
            "image": "https://images.unsplash.com/photo-1621904219178-6e6e7d4b61eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "43 Francis St W",
                "addressLocality": "Creemore",
                "addressRegion": "ON",
                "postalCode": "L0M 1G0",
                "addressCountry": "CA"
            },
            "telephone": "+12897073364",
            "email": "info@hoserplumbing.com",
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "sameAs": [
                "https://www.facebook.com/people/Hoser-Plumbing-Inc/100094127120206/#",
                "https://www.instagram.com/hoserplumbinginc/?hl=en"
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "127"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
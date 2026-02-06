// theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// check local storage for theme setting - default to light
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// navigation link functionality
const navLinks = document.querySelectorAll('.nav-link');
const contentBlocks = document.querySelectorAll('.content-block');

function activateSection(targetId) {
    // remove all active states
    navLinks.forEach(l => l.classList.remove('active'));
    contentBlocks.forEach(block => block.classList.remove('active'));

    const targetBlock = document.getElementById(targetId) || document.getElementById('bio');
    if (!targetBlock) return;

    targetBlock.classList.add('active');

    const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // initialize travel map lazily when Hobbies/Travel tab is opened
    if (targetId === 'travel') {
        initTravelMap();
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        activateSection(targetId);
        // update URL hash without jumping
        history.replaceState(null, '', `#${targetId}`);
    });
});

// default display section based on URL hash (for GitHub Pages deep links)
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : 'bio';
    activateSection(hash);
});

// smooth scrolling for in-page anchors outside nav (if any)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.classList.contains('nav-link')) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// travel map：世界静态图 + ECharts 中国地图
let travelMapInitialized = false;
let chinaChartInstance = null;

function initTravelMap() {
    if (travelMapInitialized) return;

    const worldPanel = document.getElementById('world-map-panel');
    const chinaPanel = document.getElementById('china-map-panel');
    const backBtn = document.getElementById('back-to-world');
    const chinaDot = document.querySelector('.country-dot[data-country="China"]');

    if (!worldPanel || !chinaPanel || !backBtn || !chinaDot) {
        return;
    }

    chinaDot.addEventListener('click', () => {
        worldPanel.classList.add('hidden');
        chinaPanel.classList.remove('hidden');
        initChinaMapChart();
        if (chinaChartInstance) {
            chinaChartInstance.resize();
        }
    });

    backBtn.addEventListener('click', () => {
        chinaPanel.classList.add('hidden');
        worldPanel.classList.remove('hidden');
    });

    travelMapInitialized = true;
}

function initChinaMapChart() {
    if (typeof echarts === 'undefined') {
        return;
    }

    const chinaMapEl = document.getElementById('china-map');
    if (!chinaMapEl) {
        return;
    }

    // 如果中国地图数据没有成功注册，直接返回，避免 regions 报错
    if (!echarts.getMap || !echarts.getMap('china')) {
        console.warn('China map data is not loaded. Please check that china.js is loaded correctly.');
        return;
    }

    if (!chinaChartInstance) {
        chinaChartInstance = echarts.init(chinaMapEl);

        const visitedProvinces = [
            { name: '北京' },
            { name: '天津' },
            { name: '上海' },
            { name: '江苏' },
            { name: '福建' },
            { name: '广东' },
            { name: '香港' },
            { name: '澳门' },
            { name: '广西' },
            { name: '云南' },
            { name: '贵州' },
            { name: '四川' },
            { name: '重庆' },
            { name: '湖北' },
            { name: '湖南' },
            { name: '河南' },
            { name: '陕西' },
            { name: '新疆' }
        ];

        const provinceNameMap = {
            '北京': 'Beijing',
            '天津': 'Tianjin',
            '上海': 'Shanghai',
            '重庆': 'Chongqing',
        
            '河北': 'Hebei',
            '山西': 'Shanxi',
            '辽宁': 'Liaoning',
            '吉林': 'Jilin',
            '黑龙江': 'Heilongjiang',
        
            '江苏': 'Jiangsu',
            '浙江': 'Zhejiang',
            '安徽': 'Anhui',
            '福建': 'Fujian',
            '江西': 'Jiangxi',
            '山东': 'Shandong',
            '河南': 'Henan',
            '湖北': 'Hubei',
            '湖南': 'Hunan',
        
            '广东': 'Guangdong',
            '海南': 'Hainan',
        
            '四川': 'Sichuan',
            '贵州': 'Guizhou',
            '云南': 'Yunnan',
            '陕西': 'Shaanxi',
            '甘肃': 'Gansu',
            '青海': 'Qinghai',
        
            '台湾': 'Taiwan',
        
            '内蒙古': 'Inner Mongolia',
            '广西': 'Guangxi',
            '西藏': 'Tibet',
            '宁夏': 'Ningxia',
            '新疆': 'Xinjiang',
        
            '香港': 'Hong Kong',
            '澳门': 'Macau'
        };
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: params => provinceNameMap[params.name] || params.name
            },
            visualMap: {
                show: false,
                min: 0,
                max: 1
            },
            series: [
                {
                    name: 'Visited Provinces',
                    type: 'map',
                    map: 'china',
                    roam: true,
                    itemStyle: {
                        borderColor: '#ffffff',
                        areaColor: '#e5e7eb'
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: '#3b82f6'
                        }
                    },
                    data: visitedProvinces.map(p => ({ name: p.name, value: 1 }))
                }
            ]
        };

        chinaChartInstance.setOption(option);

        // 点击重庆/广东时弹出对应弹窗
        chinaChartInstance.on('click', params => {
            if (params.name === '重庆') {
                const modal = document.getElementById('sichuan-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.setAttribute('aria-hidden', 'false');
                }
            }
            if (params.name === '广东') {
                const modal = document.getElementById('guangzhou-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.setAttribute('aria-hidden', 'false');
                }
            }
        });

        window.addEventListener('resize', () => {
            if (chinaChartInstance) {
                chinaChartInstance.resize();
            }
        });
    }
}

// 关闭所有自定义弹窗
document.addEventListener('DOMContentLoaded', () => {
    const modalConfigs = [
        { modalId: 'sichuan-modal', closeId: 'sichuan-modal-close' },
        { modalId: 'guangzhou-modal', closeId: 'guangzhou-modal-close' },
        { modalId: 'fish-modal', closeId: 'fish-modal-close' },
        { modalId: 'coffee-modal', closeId: 'coffee-modal-close' },
        { modalId: 'craft-modal', closeId: 'craft-modal-close' },
        { modalId: 'kitten-modal', closeId: 'kitten-modal-close' }
    ];

    modalConfigs.forEach(({ modalId, closeId }) => {
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeId);
        if (!modal || !closeBtn) return;

        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // image lightbox for larger view
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('image-lightbox-img');
    const lightboxClose = document.getElementById('image-lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        // any image with data-enlarge or in research / hobby modals can trigger
        const zoomableImages = document.querySelectorAll('.modal-image, .research-image');
        zoomableImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';
                lightbox.classList.remove('hidden');
                lightbox.setAttribute('aria-hidden', 'false');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    // hobby icons to open modals
    const hobbyButtons = document.querySelectorAll('.hobby-icon[data-modal-target]');
    hobbyButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (!modal) return;
        btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    // simple slider for craft images
    const craftModal = document.getElementById('craft-modal');
    if (craftModal) {
        const slides = craftModal.querySelectorAll('.craft-slide');
        const prevBtn = document.getElementById('craft-prev');
        const nextBtn = document.getElementById('craft-next');
        let currentIndex = 0;

        const showSlide = (index) => {
            if (!slides.length) return;
            slides.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
        };

        showSlide(currentIndex);

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
        }
    }
});

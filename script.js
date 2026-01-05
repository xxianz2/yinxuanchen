// theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// check local storage for theme setting
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

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // remove all active states
        navLinks.forEach(l => l.classList.remove('active'));
        contentBlocks.forEach(block => block.classList.remove('active'));
        
        // add active state to current link
        link.classList.add('active');
        
        // display corresponding content block
        const targetId = link.getAttribute('href').substring(1);
        const targetBlock = document.getElementById(targetId);
        
        if (targetBlock) {
            targetBlock.classList.add('active');
        } else {
            // if there is no corresponding content block, display bio
            document.getElementById('bio').classList.add('active');
        }
    });
});

// default display bio section
window.addEventListener('DOMContentLoaded', () => {
    const bioBlock = document.getElementById('bio');
    if (bioBlock) {
        bioBlock.classList.add('active');
    }
});

// search functionality
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    alert('search functionality to be implemented');
});

// download CV functionality (placeholder)
const downloadBtn = document.getElementById('download-cv');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('please put your CV file in the project directory and update this link');
        // in actual use, you can do this:
        // window.open('path/to/your/cv.pdf', '_blank');
    });
}

// smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});


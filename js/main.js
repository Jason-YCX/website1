// 主JavaScript文件 - 实现导航、论文筛选等功能

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadPapers();
    initializeSmoothScrolling();
    initializeAnimations();
});

// 初始化导航功能
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(30, 136, 229, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// 加载论文数据并显示
function loadPapers() {
    fetch('data/papers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('论文数据加载失败');
            }
            return response.json();
        })
        .then(data => {
            displayPapers(data.papers);
            initializeFilterButtons(data.papers);
        })
        .catch(error => {
            console.error('加载论文数据时出错:', error);
            displayError('论文数据加载失败，请刷新页面重试。');
        });
}

// 显示论文卡片
function displayPapers(papers) {
    const container = document.getElementById('papers-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    papers.forEach(paper => {
        const paperCard = createPaperCard(paper);
        container.appendChild(paperCard);
    });
    
    // 添加进入动画
    setTimeout(() => {
        const cards = document.querySelectorAll('.paper-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
    }, 100);
}

// 创建单个论文卡片
function createPaperCard(paper) {
    const card = document.createElement('div');
    card.className = `paper-card ${paper.language}`;
    card.setAttribute('data-language', paper.language);
    
    // 构建论文信息HTML
    card.innerHTML = `
        <h3 class="paper-title">${paper.title}</h3>
        <div class="paper-meta">
            <span><strong>作者:</strong> ${paper.authors}</span>
            <span><strong>年份:</strong> ${paper.year}</span>
            <span><strong>来源:</strong> ${paper.source}</span>
        </div>
        <p class="paper-abstract">${paper.abstract}</p>
        <div class="paper-links">
            <a href="${paper.onlineLink}" target="_blank" class="paper-link">在线阅读</a>
            ${paper.pdfLink ? `<a href="${paper.pdfLink}" target="_blank" class="paper-link pdf">下载PDF</a>` : ''}
        </div>
    `;
    
    return card;
}

// 初始化筛选按钮功能
function initializeFilterButtons(papers) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前按钮添加active类
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterPapers(papers, filter);
        });
    });
}

// 筛选论文
function filterPapers(papers, filter) {
    let filteredPapers;
    
    switch(filter) {
        case 'chinese':
            filteredPapers = papers.filter(paper => paper.language === 'chinese');
            break;
        case 'english':
            filteredPapers = papers.filter(paper => paper.language === 'english');
            break;
        default:
            filteredPapers = papers;
    }
    
    displayPapers(filteredPapers);
}

// 初始化平滑滚动
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化动画效果
function initializeAnimations() {
    // 观察器配置
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有章节
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 显示错误信息
function displayError(message) {
    const container = document.getElementById('papers-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 窗口大小改变时的响应式处理
window.addEventListener('resize', debounce(function() {
    // 在移动端关闭菜单
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
}, 250));
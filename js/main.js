let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
let editingPostId = null;
let currentPost = null;

function init() {
    loadTheme();
    renderPosts();
    renderCategoryFilter();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'Light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}
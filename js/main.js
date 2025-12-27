let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
let editingPostId = null;
let currentPost = null;

function init() {
    loadTheme();
    renderPosts();
    renderCategoryFilter();
}
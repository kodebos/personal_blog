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

function toggleEditor() {
    const editor = document.getElementById('editorContainer');
    const isActive = editor.classList.contains('active');

    if (isActive) {
        editor.classList.remove('active');
        resetForm();
    } else {
        editor.classList.add('active');
        document.getElementById('editorTitle').textContent = 'Create New Post';
        editingPostId = null;
    }
}

function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('preview').innerHTML = '';
    editingPostId = null;
}

function updatePreview() {
    const content = document.getElementById('postContent').value;
    document.getElementById('preview').innerHTML = content.replace(/\n/g, '<br>');
}
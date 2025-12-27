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

function savePost(event) {
    event.preventDefault();

    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;
    const action = event.submitter.value;
    const status = action === 'draft' ? 'draft' : 'published';

    const post = {
        id: editingPostId || Date.now().toString(),
        title,
        category,
        content,
        status,
        date: new Date().toISOString(),
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    if (editingPostId) {
        const index = posts.findIndex(p => p.id === editingPostId);
        posts[index] = post;
    } else {
        posts.unshift(post);
    }

    localStorage.setItem('blogPosts', JSON.stringify(posts));
    renderPosts();
    renderCategoryFilter();
    toggleEditor();
    resetForm();
}

function renderPosts(filter = null, category = null) {
    const grid = document.getElementById('postsBrid');
    const emptyState = document.getElementById('emptyState');

    let filteredPosts = posts;

    if (filter) {
        filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(filter.toLowerCase()) ||
            post.content.toLowerCase().includes(filter.toLowerCase())
        );
    }

    if (category) {
        filteredPosts = filteredPosts.filter(posts => posts.category === category);
    }

    if (filteredPosts.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    grid.innerHTML = filteredPosts.map(post => `
        <div class="post-card" onclick="openPost('${post.id}')">
            <div class="post-header">
                <span class="post-category">${post.category}</span>
                ${post.status === 'draft' ? '<span class="post-status">Draft</span>' : ''}
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.content.substring(0, 120)}${post.content.length > 120 ? '...' : ''}</p>
            <div class="post-meta">
                <span>${formatDate(post.date)}</span>
                <div class="post-actions" onclick="event.stopPropagation()">
                    <button class="icon-btn" onclick="editPost('${post.id}')" title="Edit">Edit</button>
                    <button class="icon-btn" onclick="deletePost('${post.id}')" title="Delete">Delete</button>
                </div>
            </div>
        </div>
        `).join('');
}
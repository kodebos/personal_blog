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

function renderCategoryFilter(){
    const categories = [...new Set(posts.map(post => post.category))];
    const container = document.getElementById('categoriesFilter');

    container.innerHTML = `
        <span class="category-tag active" onclick="filterByCategory(null, this)">All</span>
        ${categories.map(cat =>
            `<span class="category-tag" onclick="filterByCategory('${cat}', this)">${cat}</span>`
        ).join('')}
    `;
}

function filterByCategory(category, element) {
    document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
    element.classList.add('active');
    renderPosts(null, category);
}

function filterPosts() {
    const search = document.getElementById('searchBar').value;
    renderPosts(search);
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    editingPostId = id;
    document.getElementById('editorTitle').textContent = 'Edit Post';
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postContent').value = post.content;
    updatePreview();

    document.getElementById('editorContainer').classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    renderPosts();
    renderCategoryFilter();
}

function openPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    currentPost = post;
    document.getElementById('modalTitle').textContent = post.title;
    document.getElementById('modalCategory').innerHTML = `<span class="post-category">${post.category}</span>`;
    document.getElementById('modalDate').textContent = formatDate(post.date);
    document.getElementById('modalContent').innerHTML = post.content.replace(/\n/g, '<br>');
    document.getElementById('postModal').classList.add('active');
}

function closeModal() {
    document.getElementById('postModal').classList.remove('active');
    currentPost = null;
}

function sharePost(platform) {
    if (!currentPost) return;

    const url = `${window.location.origin}${window.location.pathname}#${currentPost.slug}`;
    const text = `${currentPost.title} - ${currentPost.content.substring(0, 100)}...`

    let shareUrl = '';

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encondeURIComponent(text + ' ' + url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encondeURIComponent(text)}&url=${encondeURIComponent(url)}`;
            break;
        case 'reddit':
            shareUrl = `https://reddit.com/submit?url=${encondeURIComponent(url)}&title=${encondeURIComponent(currentPost.title)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

function copyLink() {
    if (!currentPost) return;

    const url = `${window.location.origin}${window.location.pathname}#${currentPost.slug}`;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    });
}

init();
// Data
const elements = {
  body: document.body,

  burgerIcon: document.querySelector('.navbar__burger-icon'),
  closeIcon: document.querySelector('.navbar__close-icon'),

  lastPost: document.querySelector('.content__last-post .content__card'),
  allPosts: document.querySelectorAll('.content__all-posts .content__card'),
  popularPosts: document.querySelectorAll('.content__popular-posts .content__card'),
  categories: document.querySelector('.categories__list')
};

const posts = {
  content: [],
  tags: []
};

const env = {
  unsplash_key: 'gwixMwDhROPNnAYd-WgN77aYPL-5bellnMBNYvpHO_M'
};

// Methods
async function getAllPosts() {
  try {
    const response = await fetch('https://dummyjson.com/posts');
    const allPosts = await response.json();

    posts.content = [...allPosts.posts];
    posts.tags = [...new Set(allPosts.posts.flatMap(post => post.tags))];
    posts.tags.sort();
  } catch (error) {
    console.error(error);
  }
};

function mount() {
  setLastPost();
  setAllPosts();
  setPopularPosts();
  setCategories();
};

function setLastPost() {
  const [lastPost] = posts.content;
  createPostCard(elements.lastPost, lastPost);
};

function setAllPosts() {
  elements.allPosts.forEach((card, index) => {
    createPostCard(card, posts.content[index+1]);
  });
};

function setPopularPosts() {
  const popularPosts = posts.content.slice().sort((a, b) => b.reactions - a.reactions);
  const fourMostPopularPosts = popularPosts.slice(0, 4);

  elements.popularPosts.forEach((card, index) => {
    createPostCard(card, fourMostPopularPosts[index]);
  });
};

function setCategories() {
  elements.categories.innerHTML = '';
  
  posts.tags.forEach((category) => {
    const listItem = document.createElement('li');
    const categoryName = document.createElement('label');
    const categoryQuantity = document.createElement('span');

    listItem.className = 'list__item';
    categoryName.innerText = stringCaptalize(category);
    categoryQuantity.innerText = '(2)';

    listItem.appendChild(categoryName);
    listItem.appendChild(categoryQuantity);
    elements.categories.appendChild(listItem);
  });
}

async function createPostCard(card, content) {
  const cardImage = card.querySelector('.card__image');
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${content.title}&client_id=${env.unsplash_key}&page=1&per_page=1/`)
      
  const pictureUrl = await response.json();
  
  cardImage.src = pictureUrl.results.shift().urls.regular;
  cardImage.alt = content.title
  card.onclick = () => window.location.href = `post.html?id=${content.id}`
  card.querySelector('h3').innerText = content.title;

  if (!card.className.includes('small')) {
    const response = await fetch(`https://dummyjson.com/user/${content.userId}/`);
    const user = await response.json();
    
    card.querySelector('.card__category').innerText = content.tags.map(tag => stringCaptalize(tag)).join(', ');
    card.querySelector('.card__author').lastChild.nodeValue = ` ${user.firstName} ${user.lastName}`;
  }

  if (!card.className.includes('big')) {
    card.querySelector('time').innerText = '10/10/2010';
  }

  if (card.className.includes('medium')) {
    card.querySelector('p').innerText = `${content.body.slice(0, 128).trim()}...`;
  }
}

function watchResize() {
  if (innerWidth >= 1024) toggleMobileMenu(false);
};

function stringCaptalize(string) {
  return string.replace(/^\w/, match => match.toUpperCase());
}

function toggleMobileMenu(openMenu) {
  elements.body.className = openMenu ? 'mobile__menu' : '';
  window[`${openMenu ? 'add':'remove'}EventListener`]('resize', watchResize);
};

// Watchers
elements.burgerIcon.onclick = () => toggleMobileMenu(true);
elements.closeIcon.onclick = () => toggleMobileMenu(false);

// On Created - IIFE – Immediately Invoked Function Expression (Função Auto-invocavel)
(async function created() {
  await getAllPosts();
  mount();
})();
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
  tags: [],
};

/**
 * Chave de acesso da api de imagens do unsplash
 * crie sua conta e cole a chave de acesso aqui
 */
const env = {
  unsplash_key: 'SUA CHAVE AQUI'
};

// Methods

/**
 * Essa função pega todas as postagens na api e coloca no objeto posts,
 * pega todas as tags das postagens e faz um array sem repetições
 * e por fim ordena esse array de tags alfabeticamente
 */
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

/**
 * Essa função serve para montar cada section do blog,
 * cada função monta uma section diferente
 * @param {String} page Define qual pagina está sendo montada
 * @param {Number} id Define o id da postagem que será renderizada na página
 */
function mount(page, id) {
  setPopularPosts();
  setCategories();

  switch (page) {
    case 'index':
      setLastPost();
      setAllPosts();
      break;
    case 'post':
      setCurrentPost(id);
      break;
  }

  removeLoader();
};

/**
 * Essa função renderiza o card com o post mais recente
 */
function setLastPost() {
  const [lastPost] = posts.content;
  createPostCard(elements.lastPost, lastPost);
};

/**
 * Essa função renderiza os cards com os demais posts
 */
function setAllPosts() {
  elements.allPosts.forEach((card, index) => {
    createPostCard(card, posts.content[index+1]);
  });
};

/**
 * Essa função renderiza os cards com os posts mais populares
 */
function setPopularPosts() {
  const fourMostPopularPosts = createPopularPostsList();

  elements.popularPosts.forEach((card, index) => {
    createPostCard(card, fourMostPopularPosts[index]);
  });
};

/**
 * Essa função renderiza a lista de categorias dos posts
 */
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

/**
 * Essa função rendeniza a postagem na pagina post
 * @param {Number} id 
 */
async function setCurrentPost(id) {
  const post = {
    header: document.querySelector('.content__main-post h2 em'),
    title: document.querySelector('.post__title'),
    image: document.querySelector('.post__image'),
    author: document.querySelector('.post__author'),
    content: document.querySelector('.post__content'),
    date: document.querySelector('time')
  }

  const currentPost = posts.content.find(item => item.id === id);
  const {firstName, lastName} = await getPostUser(currentPost.userId);
  
  post.header.innerText = currentPost.title;
  post.title.innerText = currentPost.title;
  post.image.src = await getPostImage(currentPost.title);
  post.image.alt = currentPost.title;
  post.author.lastChild.nodeValue = ` ${firstName} ${lastName}`;
  post.content.innerText = currentPost.body;
  post.date.innerText = '20/10/2023';
}

/**
 * Essa função pega na api do unsplash uma imagem de acordo com o titulo da postagem
 * @param {String} title 
 * @returns {String} Url da image
 */
async function getPostImage(title) {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${title}&client_id=${env.unsplash_key}&page=1&per_page=1/`)
    const picture = await response.json();
  
    return picture.results.shift().urls.regular;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Essa função pega na api os dados do usuário referente ao id passado por parametro
 * @param {Number} id 
 * @returns {Object} Dados do usuário
 */
async function getPostUser(id) {
  try {
    const response = await fetch(`https://dummyjson.com/user/${id}/`);
    const user = await response.json();
  
    return user;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Essa função cria uma lista com os 4 posts mais populares
 * @returns {Array}
 */
function createPopularPostsList() {
  return posts.content.slice()
    .sort((a, b) => b.reactions - a.reactions)
    .slice(0, 4);
};

/**
 * Essa função renderiza qualquer um dos três tipos de cards que temos no blog 
 * @param {Element} card 
 * @param {Object} content
 */
async function createPostCard(card, content) {
  const cardImage = card.querySelector('.card__image');
  
  cardImage.src = await getPostImage(content.title);
  cardImage.alt = content.title
  card.onclick = () => window.location.href = `post.html?id=${content.id}`
  card.querySelector('h3').innerText = content.title;

  if (!card.className.includes('small')) {
    const {firstName, lastName} = await getPostUser(content.userId);
    
    card.querySelector('.card__category').innerText = content.tags.map(tag => stringCaptalize(tag)).join(', ');
    card.querySelector('.card__author').lastChild.nodeValue = ` ${firstName} ${lastName}`;
  }

  if (!card.className.includes('big')) {
    card.querySelector('time').innerText = '10/10/2010';
  }

  if (card.className.includes('medium')) {
    card.querySelector('p').innerText = `${content.body.slice(0, 128).trim()}...`;
  }
}

/**
 * Essa função cria um spinner de carregamento
 */
function createLoader() {
  const wrapper = document.createElement('div');
  const loader = document.createElement('div');

  wrapper.className = 'loading-wrapper'
  loader.className = 'loading';

  wrapper.appendChild(loader);
  elements.body.appendChild(wrapper);
}

/**
 * Essa função deleta o spinner de carregamento
 */
function removeLoader() {
  const loader = document.querySelector('.loading-wrapper');
  loader.remove();
}

/**
 * Essa função fecha o menu se a tela ficar maior que 1024px
 */
function watchResize() {
  if (innerWidth >= 1024) toggleMobileMenu(false);
};

/**
 * Essa função usa regex para deixar maiuscula a primeira letra da string passada como parametro
 */
function stringCaptalize(string) {
  return string.replace(/^\w/, match => match.toUpperCase());
}

/**
 * Essa função abre ou fecha o menu mobile de acordo com o parametro recebido
 * @param {Boolean} openMenu true para abrir e false para fechar
 */
function toggleMobileMenu(openMenu) {
  elements.body.className = openMenu ? 'mobile__menu' : '';
  window[`${openMenu ? 'add':'remove'}EventListener`]('resize', watchResize);
};

// Watchers
elements.burgerIcon.onclick = () => toggleMobileMenu(true);
elements.closeIcon.onclick = () => toggleMobileMenu(false);
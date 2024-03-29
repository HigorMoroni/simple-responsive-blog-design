
// IIFE – Immediately Invoked Function Expression (Função Auto-invocavel)

/**
 * Essa função inicia apenas quando a página index é criada,
 * pois esse arquivo só é importado la
 */
(async function created() {
  // cria uma tela de carregamento enquanto as postagens não chegaram
  createLoader();
  // Pega o id da url para buscar na api
  const id = Number(new URLSearchParams(window.location.search).get('id'));

  await getAllPosts();
  mount('post', id);
})();


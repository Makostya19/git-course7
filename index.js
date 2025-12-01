const input = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const repoList = document.getElementById("repoList");

let timer = null;

function debounce(fn, delay = 600) {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function loadRepos(query) {
  if (!query.trim()) {
    suggestions.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&per_page=5`
    );
    const data = await res.json();

    suggestions.innerHTML = "";

    if (!data.items) return;

    data.items.forEach(repo => {
      const option = document.createElement("div");
      option.textContent = repo.full_name;

      option.addEventListener("click", () => {
        addRepoToList(repo);
        suggestions.innerHTML = "";
        input.value = "";
      });

      suggestions.appendChild(option);
    });

  } catch (err) {
    console.warn("Ошибка API:", err);
  }
}

function addRepoToList(repo) {
  const card = document.createElement("div");
  card.className = "repo-card";

  card.innerHTML = `
    <div class="repo-info">
      Name: ${repo.name}
      Owner: ${repo.owner.login}
      Stars: ${repo.stargazers_count}
    </div>
    <button class="delete-btn">✖</button>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();
  });

  repoList.appendChild(card);
}

input.addEventListener("input", debounce(() => loadRepos(input.value)));

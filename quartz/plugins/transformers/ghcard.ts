import fetch from 'node-fetch';

// Define interfaces for GitHub API response data
interface Owner {
  login: string;
  avatar_url: string;
}

interface License {
  name: string;
}

interface RepoData {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: Owner;
  license: License | null;
}

// Async function to fetch GitHub repo data
async function fetchGithubRepoData(repo: string): Promise<RepoData> {
  const response = await fetch(`https://api.github.com/repos/${repo}`);
  
  if (!response.ok) {
    throw new Error('Error fetching repo data');
  }

  const data: RepoData = await response.json();
  return data;
}

// Function to create GitHub card HTML from fetched repo data
function createGithubCardHtml(data: RepoData): string {
  const { owner, full_name, description, stargazers_count, forks_count, language, license } = data;

  return `
    <div class="github-card">
      <div class="github-card-header">
        <img class="github-avatar" src="${owner.avatar_url}" alt="${owner.login}" />
        <a href="https://github.com/${full_name}" target="_blank">${full_name}</a>
      </div>
      <p>${description}</p>
      <ul class="github-stats">
        <li>⭐ ${stargazers_count} stars</li>
        <li>🍴 ${forks_count} forks</li>
        <li>💻 ${language}</li>
        ${license ? `<li>📄 License: ${license.name}</li>` : ''}
      </ul>
    </div>
  `;
}

// Main function to generate the GitHub card
export async function GithubCardComponent(repo: string): Promise<string> {
  try {
    const data = await fetchGithubRepoData(repo);
    return createGithubCardHtml(data);
  } catch (error) {
    return `<div class="github-card-error">Failed to load repo: ${repo}</div>`;
  }
}

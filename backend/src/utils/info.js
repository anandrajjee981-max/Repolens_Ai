import axios from "axios";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is missing");
}

export const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoLens-AI",
  },
});

function getRepoPath(repoUrl) {
  return repoUrl
    .replace("https://github.com/", "")
    .replace(/\/$/, "");
}

export async function getRepoInfo(repoUrl) {
  try {
    const repoPath = getRepoPath(repoUrl);

    const { data } = await githubApi.get(
      `/repos/${repoPath}`
    );

    return {
      repoName: data.name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      defaultBranch: data.default_branch,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Repository not found"
    );
  }
}

export async function getRepoReadme(repoUrl) {
  try {
    const repoPath = getRepoPath(repoUrl);

    const { data } = await githubApi.get(
      `/repos/${repoPath}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
        },
      }
    );

    return data;
  } catch {
    return null;
  }
}

export async function getPackageJson(repoUrl) {
  try {
    const repoPath = getRepoPath(repoUrl);

    const { data } = await githubApi.get(
      `/repos/${repoPath}/contents/package.json`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
        },
      }
    );

    return data;
  } catch {
    return null;
  }
}

export async function getRepoTree(
  repoUrl,
  branch
) {
  try {
    const repoPath = getRepoPath(repoUrl);

    const { data } = await githubApi.get(
      `/repos/${repoPath}/git/trees/${branch}?recursive=1`
    );

    return data.tree || [];
  } catch {
    return [];
  }
}

export async function extractRepoInfo(repoUrl) {
  const repoInfo = await getRepoInfo(repoUrl);

  const [
    readme,
    packageJson,
    fileTree,
  ] = await Promise.all([
    getRepoReadme(repoUrl),
    getPackageJson(repoUrl),
    getRepoTree(
      repoUrl,
      repoInfo.defaultBranch
    ),
  ]);

  return {
    repoInfo,
    readme,
    packageJson,
    fileTree,
  };
}
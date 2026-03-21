const REPO_OWNER = "qkrtkdwns3410";
const REPO_NAME = "qkrtkdwns3410.github.io";
const POSTS_PATH = "src/content/posts";

// GitHub API에서 받은 base64 콘텐츠를 UTF-8 문자열로 변환 (한글 깨짐 방지)
function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

interface GithubFileResponse {
  name: string;
  path: string;
  sha: string;
  content: string;
  download_url: string;
}

interface GithubContentItem {
  name: string;
  path: string;
  sha: string;
  type: string;
}

// GitHub Contents API 공통 래퍼 - PAT 인증 헤더를 자동으로 추가
async function githubApi(
  path: string,
  pat: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export async function listPosts(pat: string): Promise<GithubContentItem[]> {
  const res = await githubApi(POSTS_PATH, pat);
  if (!res.ok) throw new Error("Failed to list posts");
  const items: GithubContentItem[] = await res.json();
  return items.filter(
    (item) => item.name.endsWith(".mdx") || item.name.endsWith(".md")
  );
}

export async function getPost(
  slug: string,
  pat: string
): Promise<{ content: string; sha: string }> {
  const fileName = `${slug}.mdx`;
  const res = await githubApi(`${POSTS_PATH}/${fileName}`, pat);
  if (!res.ok) {
    const resMd = await githubApi(`${POSTS_PATH}/${slug}.md`, pat);
    if (!resMd.ok) throw new Error("Post not found");
    const data: GithubFileResponse = await resMd.json();
    return { content: decodeBase64Utf8(data.content), sha: data.sha };
  }
  const data: GithubFileResponse = await res.json();
  return { content: decodeBase64Utf8(data.content), sha: data.sha };
}

export async function createPost(
  slug: string,
  content: string,
  pat: string
): Promise<void> {
  const res = await githubApi(`${POSTS_PATH}/${slug}.mdx`, pat, {
    method: "PUT",
    body: JSON.stringify({
      message: `post: add ${slug}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: "main",
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create post");
  }
}

export async function updatePost(
  slug: string,
  content: string,
  sha: string,
  pat: string
): Promise<void> {
  const fileName = `${slug}.mdx`;
  const res = await githubApi(`${POSTS_PATH}/${fileName}`, pat, {
    method: "PUT",
    body: JSON.stringify({
      message: `post: update ${slug}`,
      content: btoa(unescape(encodeURIComponent(content))),
      sha,
      branch: "main",
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update post");
  }
}

export async function deletePost(
  slug: string,
  sha: string,
  pat: string
): Promise<void> {
  const fileName = `${slug}.mdx`;
  let res = await githubApi(`${POSTS_PATH}/${fileName}`, pat, {
    method: "DELETE",
    body: JSON.stringify({
      message: `post: delete ${slug}`,
      sha,
      branch: "main",
    }),
  });
  if (!res.ok) {
    res = await githubApi(`${POSTS_PATH}/${slug}.md`, pat, {
      method: "DELETE",
      body: JSON.stringify({
        message: `post: delete ${slug}`,
        sha,
        branch: "main",
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete post");
    }
  }
}

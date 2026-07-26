import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { ArrowLeft, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../utils/api';

// Helper to extract owner and repo name from GitHub URL
const getGithubRepoDetails = (url) => {
  if (!url) return null;
  // Match github.com/owner/repo structure
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    const owner = match[1];
    let repo = match[2];
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    // Remove query parameters, hashes, or trailing/nested paths (e.g., repo/tree/main)
    repo = repo.split(/[?#]/)[0].split('/')[0].trim();
    return { owner, repo };
  }
  return null;
};

const ProjectReadme = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [readmeHtml, setReadmeHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndReadme = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Fetch project details from backend
        const res = await api.get(`/projects/${id}`);
        const projectData = res.data;
        setProject(projectData);

        if (!projectData.githubLink) {
          setError('No GitHub repository is associated with this project.');
          setLoading(false);
          return;
        }

        // 2. Extract owner/repo
        const repoDetails = getGithubRepoDetails(projectData.githubLink);
        if (!repoDetails) {
          setError('The GitHub link associated with this project is invalid or could not be parsed.');
          setLoading(false);
          return;
        }

        const { owner, repo } = repoDetails;

        // 3. Fetch README from GitHub API
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            Accept: 'application/vnd.github.raw',
          },
        });

        if (!githubRes.ok) {
          if (githubRes.status === 404) {
            throw new Error('file not found in the repository.');
          } else if (githubRes.status === 403) {
            throw new Error('GitHub API rate limit exceeded or access forbidden. Please try again later.');
          } else {
            throw new Error(`Failed to fetch (${githubRes.statusText}).`);
          }
        }

        const markdownText = await githubRes.text();

        // 4. Parse markdown to HTML using marked
        const parsedHtml = await marked.parse(markdownText, {
          gfm: true,
          breaks: true,
        });

        setReadmeHtml(parsedHtml);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message || 'An unexpected error occurred while loading the project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndReadme();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 z-10 relative w-full flex-grow flex flex-col">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-medium text-sm rounded-lg transition-all duration-200 cursor-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {project && (
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            {project.title}
          </h1>
          <p className="text-accent/80 font-medium text-lg mb-4">
            {project.subtitle || project.category}
          </p>
          <div className="h-px bg-white/10 w-full" />
        </header>
      )}

      {error ? (
        <div className="glass-panel p-8 text-center rounded-2xl border border-red-500/20 bg-red-950/10">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load README</h3>
          <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">{error}</p>
          {project?.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent hover:bg-white text-bg-primary font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 cursor-none"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      ) : (
        <article className="glass-panel p-4 sm:p-10 rounded-[24px] border border-white/5 flex-grow">
          <div
            className="readme-content text-neutral-300 text-base leading-relaxed break-words"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </article>
      )}
    </div>
  );
};

export default ProjectReadme;

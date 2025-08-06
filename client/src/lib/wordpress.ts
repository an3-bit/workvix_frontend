const WORDPRESS_API_BASE = 'https://workvix.com/blog/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  link: string;
  slug: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  count: number;
  slug: string;
}

export const fetchWordPressPostBySlug = async (slug: string): Promise<WordPressPost | null> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?slug=${slug}&_embed`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (!data || !data.length) return null;

    const post = data[0];

    const featuredImage =
      post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
      'https://via.placeholder.com/600x400?text=WorkVix+Blog';

    const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

    const contentLength = post.content?.rendered?.length || 0;
    const readTime = Math.ceil(contentLength / 200) + ' min read';

    const excerpt =
      post.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
      post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

    return {
      id: post.id,
      title: post.title?.rendered || 'Untitled',
      excerpt,
      content: post.content?.rendered || '',
      category,
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      readTime,
      image: featuredImage,
      author: {
        name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 'https://via.placeholder.com/48?text=WV',
      },
      link: post.link || `https://workvix.com/blog/${post.slug}`,
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

export const fetchWordPressPosts = async (perPage: number = 12): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?_embed&per_page=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map((post: any) => {
      const featuredImage =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
        'https://via.placeholder.com/600x400?text=WorkVix+Blog';

      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';

      const excerpt =
        post.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
        post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt,
        content: post.content?.rendered || '',
        category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 'https://via.placeholder.com/48?text=WV',
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug,
      };
    });
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    throw error;
  }
};

export const fetchWordPressCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      slug: cat.slug,
    }));
  } catch (error) {
    console.error('Error fetching WordPress categories:', error);
    throw error;
  }
};

export const fetchWordPressPostsByCategory = async (
  categorySlug: string,
  perPage: number = 12
): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?categories=${categorySlug}&_embed&per_page=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map((post: any) => {
      const featuredImage =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
        'https://via.placeholder.com/600x400?text=WorkVix+Blog';

      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';

      const excerpt =
        post.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
        post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt,
        content: post.content?.rendered || '',
        category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 'https://via.placeholder.com/48?text=WV',
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug,
      };
    });
  } catch (error) {
    console.error('Error fetching WordPress posts by category:', error);
    throw error;
  }
};

export const searchWordPressPosts = async (
  searchTerm: string,
  perPage: number = 12
): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?search=${encodeURIComponent(searchTerm)}&_embed&per_page=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map((post: any) => {
      const featuredImage =
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
        'https://via.placeholder.com/600x400?text=WorkVix+Blog';

      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';

      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';

      const excerpt =
        post.excerpt?.rendered?.replace(/<[^>]+>/g, '') ||
        post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt,
        content: post.content?.rendered || '',
        category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 'https://via.placeholder.com/48?text=WV',
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug,
      };
    });
  } catch (error) {
    console.error('Error searching WordPress posts:', error);
    throw error;
  }
};

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash, RefreshCcw } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author_id: string;
  published_at: string;
  status: 'draft' | 'published' | 'archived';
  author_profile?: { first_name: string; last_name: string; email: string } | null;
}

const ManageNews: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          author_profile:author_id(first_name, last_name, email)
        `)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNewsArticles(data as NewsArticle[]);
    } catch (err: any) {
      console.error('Error fetching news:', err.message);
      setError('Failed to fetch news: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch news.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = () => {
    setEditingArticle(null);
    setArticleFormData({
      title: '',
      content: '',
      status: 'draft',
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setArticleFormData({
      title: article.title,
      content: article.content,
      status: article.status,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleSubmitArticle = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentAdminId = userData.user?.id;
      if (!currentAdminId) throw new Error('Admin user not found.');

      const payload = {
        title: articleFormData.title,
        content: articleFormData.content,
        status: articleFormData.status,
        author_id: currentAdminId,
        published_at: articleFormData.status === 'published' ? new Date().toISOString() : null, // Set published_at if publishing
      };

      if (editingArticle) {
        // Update existing article
        const { error } = await supabase
          .from('news')
          .update(payload)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'News article updated successfully.' });
      } else {
        // Add new article
        const { error } = await supabase
          .from('news')
          .insert([payload]);

        if (error) throw error;
        toast({ title: 'Success', description: 'News article added successfully.' });
      }
      
      setIsAddEditDialogOpen(false);
      fetchNews();
    } catch (err: any) {
      console.error('Error submitting article:', err.message);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save news article.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = (article: NewsArticle) => {
    setArticleToDelete(article);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', articleToDelete.id);

      if (error) throw error;

      toast({
        title: 'Article Deleted',
        description: `News article "${articleToDelete.title}" has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setArticleToDelete(null);
      fetchNews();
    } catch (err: any) {
      console.error('Error deleting article:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete article: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading news...</div>;
  }

  if (error) {
    return <div className="p-6 text-center font-bold">Your news articles will appear here.</div>;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Manage News & Announcements</CardTitle>
          <div className="space-x-2">
            <Button onClick={fetchNews} variant="outline" className="flex items-center space-x-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleAddArticle} className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Article</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {newsArticles.length === 0 ? (
            <p className="text-center text-gray-500">No news articles found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.author_profile?.first_name || 'N/A'} {article.author_profile?.last_name || ''}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800' // Archived
                        }`}>
                          {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{article.published_at ? new Date(article.published_at).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditArticle(article)}
                          className="mr-1"
                          title="Edit Article"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteArticle(article)}
                          title="Delete Article"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit News Article Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit News Article' : 'Create New News Article'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                value={articleFormData.title}
                onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="article-content">Content</Label>
              <Textarea
                id="article-content"
                value={articleFormData.content}
                onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                rows={8}
                required
              />
            </div>
            <div>
              <Label htmlFor="article-status">Status</Label>
              <Select onValueChange={(value: 'draft' | 'published' | 'archived') => setArticleFormData({ ...articleFormData, status: value })} value={articleFormData.status}>
                <SelectTrigger id="article-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitArticle} disabled={loading || !articleFormData.title || !articleFormData.content}>
              {loading ? 'Saving...' : 'Save Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete news article "{articleToDelete?.title}"?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteArticle} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 mt-8 flex items-center justify-between text-sm text-muted-foreground">
        <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>
    </div>
  );
};

export default ManageNews;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Search,
  HelpCircle, Save, X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { faqsAPI } from '../../utils/api';
import { ConfirmModal } from '../../components/ConfirmModal';

const CATEGORIES = ['Flood Monitoring', 'Alert System', 'Evacuation', 'General', 'Registration'];

export function FAQManagement() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Flood Monitoring',
    question: '',
    answer: '',
    isPublished: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; question: string }>({
    open: false, id: '', question: '',
  });

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await faqsAPI.getAll();
      setFaqs(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (editingFaq) {
        await faqsAPI.update(editingFaq.id, formData);
        toast.success('FAQ updated successfully');
      } else {
        await faqsAPI.create({
          ...formData,
          order: faqs.length + 1,
        });
        toast.success('FAQ added successfully');
      }

      resetForm();
      await loadFaqs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      isPublished: faq.isPublished,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await faqsAPI.delete(id);
      toast.success('FAQ deleted');
      setDeleteConfirm({ open: false, id: '', question: '' });
      await loadFaqs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (faq: any) => {
    try {
      setLoading(true);
      await faqsAPI.togglePublish(faq.id);
      toast.success(faq.isPublished ? 'FAQ unpublished' : 'FAQ published');
      await loadFaqs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle publish status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setShowForm(false);
    setFormData({ category: 'Flood Monitoring', question: '', answer: '', isPublished: true });
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && faq.isPublished) ||
      (filterStatus === 'draft' && !faq.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = faqs.filter((f) => f.isPublished).length;
  const draftCount = faqs.filter((f) => !f.isPublished).length;
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Header row with stats inline */}
      <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-1">
          <span className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-blue-500" />
            <span className="font-semibold text-[#1F2937]">{faqs.length}</span> Total
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-green-500" />
            <span className="font-semibold text-[#1F2937]">{publishedCount}</span> Published
          </span>
          <span className="flex items-center gap-1.5">
            <EyeOff size={14} className="text-yellow-500" />
            <span className="font-semibold text-[#1F2937]">{draftCount}</span> Drafts
          </span>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          size="sm"
          className="bg-[#FF6A00] hover:bg-[#E55F00] flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add FAQ
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-9 h-8 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* FAQ List — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <HelpCircle className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No FAQs found matching your criteria.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-100 transition-colors"
            >
              {/* Desktop: compact single-line row */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-2 hover:bg-gray-50/80">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${faq.isPublished ? 'bg-green-500' : 'bg-yellow-400'}`}
                  title={faq.isPublished ? 'Published' : 'Draft'}
                />
                <Badge variant="outline" className="text-[9px] flex-shrink-0 px-1.5 py-0">
                  {faq.category}
                </Badge>
                <span className="flex-1 min-w-0 text-xs font-medium text-[#1F2937] truncate">
                  {faq.question}
                </span>
                <div className="flex items-center gap-0 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(faq)}
                    disabled={loading}
                    className="p-1 rounded hover:bg-gray-200/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={faq.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {faq.isPublished ? (
                      <EyeOff size={13} className="text-gray-400" />
                    ) : (
                      <Eye size={13} className="text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(faq)}
                    disabled={loading}
                    className="p-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit"
                  >
                    <Pencil size={13} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ open: true, id: faq.id, question: faq.question })}
                    disabled={loading}
                    className="p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Mobile: card layout */}
              <div className="lg:hidden px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">
                    {faq.category}
                  </Badge>
                  {faq.isPublished ? (
                    <Badge className="bg-green-100 text-green-700 text-[10px]">Published</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Draft</Badge>
                  )}
                </div>
                <h4 className="font-semibold text-[#1F2937] text-sm mb-0.5">{faq.question}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{faq.answer}</p>
                <div className="flex items-center gap-1 border-t border-gray-100 pt-2 -mx-1">
                  <button
                    onClick={() => handleTogglePublish(faq)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-xs text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {faq.isPublished ? (
                      <><EyeOff size={14} /> Hide</>
                    ) : (
                      <><Eye size={14} className="text-green-600" /> Publish</>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(faq)}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors text-xs text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setDeleteConfirm({ open: true, id: faq.id, question: faq.question })}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors text-xs text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit FAQ Modal */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#FF6A00] focus:ring-[#FF6A00]"
                  />
                  <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the frequently asked question..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the detailed answer..."
                rows={4}
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#FF6A00] hover:bg-[#E55F00] flex items-center gap-2">
                <Save size={16} />
                {loading ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Save FAQ')}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: '', question: '' })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete FAQ"
        description="This FAQ will be permanently removed. This action cannot be undone."
        detail={deleteConfirm.question}
        confirmLabel="Delete FAQ"
        variant="danger"
      />
    </div>
  );
}

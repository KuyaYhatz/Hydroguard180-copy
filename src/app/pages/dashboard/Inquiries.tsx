import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareText, Mail, Phone, Clock, Search,
  Eye, Reply, Trash2, X, Send, Filter, CircleDot,
  MailOpen, CheckCircle2, User,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { inquiriesAPI } from '../../utils/api';
import { format } from 'date-fns';
import { ConfirmModal } from '../../components/ConfirmModal';

export function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; subject: string }>({
    open: false, id: '', subject: '',
  });

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const data = await inquiriesAPI.getAll();
      setInquiries([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading inquiries:', error);
      toast.error('Failed to load inquiries');
    }
  };

  const handleViewInquiry = async (inquiry: any) => {
    if (inquiry.status === 'unread') {
      try {
        await inquiriesAPI.update(inquiry.id, { status: 'read' });
        await loadInquiries();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    setSelectedInquiry(inquiry);
    setReplyText(inquiry.reply || '');
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please write a reply');
      return;
    }
    try {
      await inquiriesAPI.update(selectedInquiry.id, {
        status: 'replied',
        reply: replyText,
      });
      toast.success('Reply saved successfully');
      setSelectedInquiry({ ...selectedInquiry, status: 'replied', reply: replyText, repliedAt: new Date().toISOString() });
      await loadInquiries();
    } catch (error) {
      console.error('Error saving reply:', error);
      toast.error('Failed to save reply');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inquiriesAPI.delete(id);
      toast.success('Inquiry deleted');
      setDeleteConfirm({ open: false, id: '', subject: '' });
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      await loadInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = inquiries.filter((i) => i.status === 'unread').length;
  const readCount = inquiries.filter((i) => i.status === 'read').length;
  const repliedCount = inquiries.filter((i) => i.status === 'replied').length;

  const statusConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    unread: { color: 'text-orange-700', bg: 'bg-orange-100', icon: CircleDot, label: 'Unread' },
    read: { color: 'text-blue-700', bg: 'bg-blue-100', icon: MailOpen, label: 'Read' },
    replied: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2, label: 'Replied' },
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      {/* Stats + Filter row */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-1">
            <span><span className="font-semibold text-[#1F2937]">{inquiries.length}</span> Total</span>
            <span className="text-orange-600"><span className="font-semibold">{unreadCount}</span> Unread</span>
            <span className="text-blue-600"><span className="font-semibold">{readCount}</span> Read</span>
            <span className="text-green-600"><span className="font-semibold">{repliedCount}</span> Replied</span>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-8 text-sm w-48"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split panel — fills remaining */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Inquiry List */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <MessageSquareText className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No inquiries found.</p>
              </div>
            ) : (
              filteredInquiries.map((inq) => {
                const sc = statusConfig[inq.status];
                const StatusIcon = sc.icon;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleViewInquiry(inq)}
                    className={`bg-white rounded-lg shadow-sm border px-3 py-2.5 cursor-pointer transition-all hover:shadow-md ${
                      selectedInquiry?.id === inq.id
                        ? 'border-[#FF6A00] ring-1 ring-[#FF6A00]/20'
                        : 'border-gray-100'
                    } ${inq.status === 'unread' ? 'border-l-4 border-l-orange-400' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-xs ${inq.status === 'unread' ? 'font-bold' : 'font-medium'} text-[#1F2937] line-clamp-1`}>
                        {inq.subject}
                      </h4>
                      <Badge className={`${sc.bg} ${sc.color} text-[9px] shrink-0`}>
                        {sc.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <User size={10} className="text-gray-400" />
                      <span className="text-[11px] text-gray-600">{inq.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mb-1">{inq.message}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={9} />
                      {format(new Date(inq.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          {selectedInquiry ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2937] mb-1">{selectedInquiry.subject}</h3>
                    <Badge className={`${statusConfig[selectedInquiry.status].bg} ${statusConfig[selectedInquiry.status].color} text-[10px]`}>
                      {statusConfig[selectedInquiry.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDeleteConfirm({ open: true, id: selectedInquiry.id, subject: selectedInquiry.subject })}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><User size={12} className="text-gray-400" />{selectedInquiry.name}</span>
                  <span className="flex items-center gap-1"><Mail size={12} className="text-gray-400" />{selectedInquiry.email}</span>
                  {selectedInquiry.phone && (
                    <span className="flex items-center gap-1"><Phone size={12} className="text-gray-400" />{selectedInquiry.phone}</span>
                  )}
                  <span className="flex items-center gap-1"><Clock size={12} className="text-gray-400" />{format(new Date(selectedInquiry.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {/* Message */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">Message</h4>
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>

                {/* Reply Section */}
                <div className="px-5 py-4">
                  {selectedInquiry.reply && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={12} className="text-green-600" />
                        <span className="text-[10px] font-medium text-green-700">
                          Replied {selectedInquiry.repliedAt ? format(new Date(selectedInquiry.repliedAt), 'MMM d, yyyy h:mm a') : ''}
                        </span>
                      </div>
                      <p className="text-xs text-green-800">{selectedInquiry.reply}</p>
                    </div>
                  )}

                  <h4 className="text-xs font-semibold text-gray-500 mb-2">
                    {selectedInquiry.status === 'replied' ? 'Update Reply' : 'Write Reply'}
                  </h4>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={3}
                    className="mb-3 text-sm"
                  />
                  <Button
                    onClick={handleReply}
                    size="sm"
                    className="bg-[#FF6A00] hover:bg-[#E55F00] flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    {selectedInquiry.status === 'replied' ? 'Update Reply' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquareText className="mx-auto text-gray-300 mb-3" size={48} />
                <h3 className="text-sm font-medium text-gray-500 mb-1">Select an inquiry</h3>
                <p className="text-xs text-gray-400">Click on an inquiry to view details and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: '', subject: '' })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Inquiry"
        description="This inquiry and any reply will be permanently removed. This action cannot be undone."
        detail={deleteConfirm.subject}
        confirmLabel="Delete Inquiry"
        variant="danger"
      />
    </div>
  );
}
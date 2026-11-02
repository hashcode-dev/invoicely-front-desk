import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, SupportTicket, SupportTicketMessage } from '../common/admin-api';

export function Tickets() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: 'Billing',
    priority: 'MEDIUM',
    message: '',
  });

  const { data: tickets = [], isLoading: isLoadingTickets, refetch: refetchTickets } = useQuery<SupportTicket[]>({
    queryKey: ['admin-tickets', statusFilter],
    queryFn: () => adminApi.getSupportTickets(statusFilter),
    refetchInterval: 15000,
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<SupportTicketMessage[]>({
    queryKey: ['admin-ticket-messages', selectedTicket?.id],
    queryFn: () => (selectedTicket ? adminApi.getTicketMessages(selectedTicket.id) : Promise.resolve([])),
    enabled: Boolean(selectedTicket?.id),
    refetchInterval: 10000,
  });

  const replyMutation = useMutation({
    mutationFn: (payload: { ticketId: string; message: string; is_internal_note: boolean; status?: string }) =>
      adminApi.replyToTicket(payload.ticketId, {
        message: payload.message,
        is_internal_note: payload.is_internal_note,
        status: payload.status,
      }),
    onSuccess: () => {
      setReplyMessage('');
      queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages', selectedTicket?.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-platform-metrics'] });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: adminApi.createSupportTicket,
    onSuccess: (newTicket) => {
      setShowCreateModal(false);
      setNewTicketForm({ subject: '', category: 'Billing', priority: 'MEDIUM', message: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-platform-metrics'] });
      setSelectedTicket(newTicket);
    },
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    replyMutation.mutate({
      ticketId: selectedTicket.id,
      message: replyMessage.trim(),
      is_internal_note: isInternalNote,
      status: newStatus || selectedTicket.status,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900';
      case 'HIGH':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'MEDIUM':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
      case 'IN_PROGRESS':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      case 'RESOLVED':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900';
      case 'CLOSED':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const isSlaBreached = (ticket: SupportTicket) => {
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') return false;
    if (!ticket.sla_due_at) return false;
    return new Date(ticket.sla_due_at).getTime() < Date.now();
  };

  return (
    <div className="space-y-6">
      {/* Page Header (DESIGN.md Section 3 & 5.5) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Support Desk & SLA Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resolve customer queries, enforce response SLAs, and publish internal operator notes.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => refetchTickets()}
            className="min-h-[40px] px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh Queue</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="min-h-[40px] px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              statusFilter === filter
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {filter === 'ALL' ? 'All Inquiries' : filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Split Console: Ticket Queue (Left) & Conversation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {isLoadingTickets ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-3xl animate-spin text-blue-600">sync</span>
              <span className="text-sm font-medium">Loading tickets...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">check_circle</span>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Zero active support tickets in this queue.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[720px] pr-1">
              {tickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const breached = isSlaBreached(ticket);
                return (
                  <div
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setNewStatus(ticket.status);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedTicket(ticket)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left card-shadow ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {ticket.subject}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex-shrink-0 ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span>{ticket.company_name || 'Organization'}</span>
                      <span className="font-mono text-[11px]">{ticket.category}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(ticket.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                        {ticket.status}
                      </span>

                      {breached ? (
                        <span className="inline-flex items-center text-xs font-bold text-red-600 dark:text-red-400 gap-1">
                          <span className="material-symbols-outlined text-sm">alarm</span>
                          SLA Breached
                        </span>
                      ) : ticket.sla_due_at ? (
                        <span className="text-[11px] text-slate-400">
                          Due: {new Date(ticket.sla_due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Ticket Conversation & Resolution */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 card-shadow flex flex-col justify-between">
          {selectedTicket ? (
            <div className="flex flex-col h-full space-y-6">
              {/* Ticket Meta Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      Ticket #{selectedTicket.id.slice(0, 8)}
                    </span>
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {selectedTicket.subject}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Organization: <strong className="text-slate-700 dark:text-slate-200">{selectedTicket.company_name}</strong> • Category: {selectedTicket.category}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={newStatus || selectedTicket.status}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message History Thread */}
              <div className="flex-1 overflow-y-auto max-h-[380px] space-y-4 pr-2">
                {isLoadingMessages ? (
                  <div className="py-12 text-center text-slate-400">Loading conversation history...</div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">No message activity recorded yet.</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border ${
                        msg.is_internal_note
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                          : msg.is_platform_admin
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {msg.sender_name || 'Customer'}
                          </span>
                          {msg.is_internal_note ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                              Internal Note
                            </span>
                          ) : msg.is_platform_admin ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                              Support Operator
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Composer (DESIGN.md Section 5.3 & 5.5) */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400" htmlFor="reply-input">
                    {isInternalNote ? 'Confidential Internal Note' : 'Public Customer Response'}
                  </label>
                  <label className="inline-flex items-center cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 gap-1.5">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Post as Internal Note</span>
                  </label>
                </div>

                <textarea
                  id="reply-input"
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Add confidential notes visible only to platform operators...'
                      : 'Compose a message to send directly to the customer organization...'
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all resize-none"
                />

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={replyMutation.isPending || !replyMessage.trim()}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all flex items-center gap-2 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                      isInternalNote
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 focus:ring-amber-500/40'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500/40'
                    }`}
                  >
                    <span>{replyMutation.isPending ? 'Sending...' : isInternalNote ? 'Save Internal Note' : 'Send Response'}</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">forum</span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No Ticket Selected</p>
              <p className="text-xs text-slate-500 text-center max-w-sm">
                Choose a support inquiry from the queue on the left to review communication history and issue responses.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full card-shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Create Support Inquiry
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTicketMutation.mutate(newTicketForm);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="ticket-subject">
                  Subject Line
                </label>
                <input
                  id="ticket-subject"
                  type="text"
                  required
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="e.g. Gateway webhook signature mismatch on subscription billing"
                  className="w-full min-h-[44px] px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="ticket-category">
                    Domain Category
                  </label>
                  <select
                    id="ticket-category"
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="Billing">Billing & Checkout</option>
                    <option value="Integrations">Integrations & API</option>
                    <option value="Tax & Compliance">Tax & Compliance</option>
                    <option value="E-Invoicing">E-Invoicing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="ticket-priority">
                    Priority & SLA
                  </label>
                  <select
                    id="ticket-priority"
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="LOW">Low (48h SLA)</option>
                    <option value="MEDIUM">Medium (24h SLA)</option>
                    <option value="HIGH">High (4h SLA)</option>
                    <option value="URGENT">Urgent (1h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="ticket-details">
                  Detailed Diagnostic Message
                </label>
                <textarea
                  id="ticket-details"
                  rows={4}
                  required
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  placeholder="Provide detailed description of the customer issue..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTicketMutation.isPending}
                  className="min-h-[44px] px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {createTicketMutation.isPending ? 'Logging Ticket...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

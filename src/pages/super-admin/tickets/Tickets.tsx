import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiLifeBuoy,
  FiSend,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from 'react-icons/fi';
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

  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery<SupportTicketMessage[]>({
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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'RESOLVED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'CLOSED':
        return 'bg-slate-700 text-slate-400 border-slate-600';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Desk & Customer Queries</h1>
          <p className="text-sm text-slate-400">
            Track customer issues, communicate directly with tenant admins, and log internal engineering notes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
          <button
            type="button"
            onClick={() => {
              refetchTickets();
              if (selectedTicket) refetchMessages();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Two-Pane Support Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Pane: Ticket Queue */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tickets ({tickets.length})
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {isLoadingTickets ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No tickets found for this view.</div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const isOverdue = t.sla_due_at && new Date(t.sla_due_at).getTime() < Date.now() && t.status !== 'RESOLVED' && t.status !== 'CLOSED';

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTicket(t);
                      setNewStatus(t.status);
                    }}
                    className={`w-full text-left p-4 transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {t.ticket_number}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {isOverdue && (
                          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            SLA BREACHED
                          </span>
                        )}
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                    <h4 className="mt-1.5 text-sm font-semibold text-white line-clamp-1">
                      {t.subject}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                      <span>{t.company_name || 'Organization'}</span>
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Thread & Reply Composer */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-indigo-400">
                        {selectedTicket.ticket_number}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({selectedTicket.company_name})
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Category: {selectedTicket.category}</span>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/30">
                {isLoadingMessages ? (
                  <div className="p-8 text-center text-slate-500 text-sm">Loading message history...</div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No messages yet.</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl text-sm border ${
                        msg.is_internal_note
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                          : msg.is_platform_admin
                          ? 'bg-indigo-950/30 border-indigo-500/30 text-slate-200 ml-4'
                          : 'bg-slate-800/70 border-slate-700 text-slate-200 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold flex items-center space-x-1">
                          {msg.is_internal_note && <FiLock className="w-3 h-3 text-amber-400 inline mr-1" />}
                          <span className={msg.is_internal_note ? 'text-amber-300' : msg.is_platform_admin ? 'text-indigo-400' : 'text-slate-300'}>
                            {msg.sender_name || (msg.is_platform_admin ? 'Support Engineer' : 'Customer')}
                          </span>
                          {msg.is_internal_note && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                              INTERNAL NOTE
                            </span>
                          )}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                    />
                    <span className={isInternalNote ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                      Log as Internal Engineering Note (Private)
                    </span>
                  </label>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Update Status:</span>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? 'Write private engineering note (visible only to platform operators)...'
                        : 'Write public response to customer...'
                    }
                    className={`w-full p-3 rounded-lg text-sm bg-slate-900 border focus:outline-none text-slate-200 placeholder-slate-500 ${
                      isInternalNote
                        ? 'border-amber-500/40 focus:border-amber-400'
                        : 'border-slate-700 focus:border-indigo-500'
                    }`}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!replyMessage.trim() || replyMutation.isPending}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition disabled:opacity-50 ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    <span>{replyMutation.isPending ? 'Sending...' : isInternalNote ? 'Save Note' : 'Send Customer Reply'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
              <FiLifeBuoy className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-medium">Select a ticket from the left queue to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Customer Ticket</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="e.g. Payment gateway webhook failure"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="E-Invoicing">E-Invoicing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Message / Query</label>
                <textarea
                  rows={4}
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  placeholder="Describe customer inquiry..."
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newTicketForm.subject.trim() || !newTicketForm.message.trim() || createTicketMutation.isPending}
                onClick={() => createTicketMutation.mutate(newTicketForm)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md disabled:opacity-50"
              >
                {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

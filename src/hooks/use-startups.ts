import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbStartup {
  id: string;
  name: string;
  category: string;
  blockchain: string;
  mrr: number;
  users: number;
  growth_rate: number;
  sustainability_score: number;
  energy_score: number;
  carbon_score: number;
  tokenomics_score: number;
  governance_score: number;
  verified: boolean;
  logo_url: string | null;
  description: string | null;
  founded_date: string | null;
  website: string | null;
  carbon_offset_tonnes: number;
  energy_per_transaction: string | null;
  token_concentration_pct: number;
  trust_score: number;
  chain_type: string | null;
  inflation_rate: number;
  team_size: number;
  treasury: number;
  energy_consumption: number;
  whale_concentration: number;
  created_at: string;
}

export interface DbMetricsHistory {
  id: string;
  startup_id: string;
  month: string;
  month_date: string;
  revenue: number;
  costs: number;
  mau: number;
  transactions: number;
  carbon_offsets: number;
  growth_rate: number;
}

export interface DbPledge {
  id: string;
  startup_id: string;
  pledge_text: string;
  committed_date: string;
  status: string;
}

export interface DbAuditEntry {
  id: string;
  startup_id: string;
  user_id: string;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  tx_hash: string;
  changed_at: string;
}

export interface DbProposal {
  title: string;
  description: string | null;
  proposer: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  status: string;
  ends_at: string | null;
}

export function useStartups() {
  return useQuery({
    queryKey: ['startups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('mrr', { ascending: false });
      if (error) throw error;
      return data as DbStartup[];
    },
  });
}

export function useStartup(id: string | undefined) {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as DbStartup | null;
    },
    enabled: !!id,
  });
}

export function useMetricsHistory(startupId: string | undefined) {
  return useQuery({
    queryKey: ['metrics_history', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('metrics_history')
        .select('*')
        .eq('startup_id', startupId)
        .order('month_date', { ascending: true });
      if (error) throw error;
      return data as DbMetricsHistory[];
    },
    enabled: !!startupId,
  });
}

export function useStartupPledges(startupId: string | undefined) {
  return useQuery({
    queryKey: ['pledges', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('pledges')
        .select('*')
        .eq('startup_id', startupId)
        .order('committed_date', { ascending: true });
      if (error) throw error;
      return data as DbPledge[];
    },
    enabled: !!startupId,
  });
}

export function useAllPledges() {
  return useQuery({
    queryKey: ['all-pledges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pledges')
        .select('*')
        .order('committed_date', { ascending: true });
      if (error) throw error;
      return data as DbPledge[];
    },
  });
}

export function useProposals() {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbProposal[];
    },
  });
}

export function useAuditLog(startupId: string | undefined) {
  return useQuery({
    queryKey: ['audit_log', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('startup_audit_log')
        .select('*')
        .eq('startup_id', startupId)
        .order('changed_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as DbAuditEntry[];
    },
    enabled: !!startupId,
  });
}

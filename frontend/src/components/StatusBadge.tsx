interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = status?.toUpperCase();
  const cls =
    s === 'APPROVED' || s === 'ACTIVE' ? 'status-approved' :
    s === 'PENDING' ? 'status-pending' :
    s === 'REJECTED' || s === 'INACTIVE' ? 'status-rejected' :
    'status-pending';

  return <span className={cls}>{status}</span>;
};

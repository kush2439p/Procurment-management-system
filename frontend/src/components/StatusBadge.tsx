interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = status?.toUpperCase();
  const cls =
    s === 'APPROVED' ? 'badge-approved' :
      s === 'ACTIVE' ? 'badge-active' :
        s === 'PENDING' ? 'badge-pending' :
          s === 'REJECTED' ? 'badge-rejected' :
            s === 'INACTIVE' ? 'badge-inactive' :
              'badge-pending';

  const dot =
    s === 'APPROVED' ? '🟢' :
      s === 'ACTIVE' ? '🔵' :
        s === 'PENDING' ? '🟡' :
          s === 'REJECTED' ? '🔴' :
            s === 'INACTIVE' ? '⚫' : '🟡';

  return (
    <span className={cls}>
      <span className="text-[8px]">{dot}</span>
      {status}
    </span>
  );
};

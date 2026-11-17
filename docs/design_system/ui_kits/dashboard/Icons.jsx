function Icon({ path, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {path}
    </svg>
  );
}

const Icons = {
  Home: (p) => <Icon {...p} path={<path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />} />,
  Folder: (p) => <Icon {...p} path={<path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />} />,
  Users: (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 19c.7-3 3-4.7 6.5-4.7s5.8 1.7 6.5 4.7" /><circle cx="17" cy="9" r="2.6" /><path d="M15.5 14.4c2.7.3 4.4 1.8 5 4.6" /></>} />,
  Settings: (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10c.1.7.5 1.3 1.1 1.6H20a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" /></>} />,
  Search: (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />,
  Bell: (p) => <Icon {...p} path={<><path d="M9 18a3 3 0 0 0 6 0" /><path d="M5 15v-5a7 7 0 0 1 14 0v5l1.7 2.5a1 1 0 0 1-.8 1.5H4.1a1 1 0 0 1-.8-1.5Z" /></>} />,
  Plus: (p) => <Icon {...p} path={<path d="M12 5v14M5 12h14" />} />,
  ChevronRight: (p) => <Icon {...p} path={<path d="m9 18 6-6-6-6" />} />,
  ChevronLeft: (p) => <Icon {...p} path={<path d="m15 18-6-6 6-6" />} />,
  LogOut: (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>} />,
  Check: (p) => <Icon {...p} path={<path d="M20 6 9 17l-5-5" />} />,
  AlertTriangle: (p) => <Icon {...p} path={<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>} />,
  Trash: (p) => <Icon {...p} path={<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />} />,
  Calendar: (p) => <Icon {...p} path={<><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M16 3v3M8 3v3M3 9.5h18" /></>} />,
  ArrowLeft: (p) => <Icon {...p} path={<path d="m12 19-7-7 7-7M5 12h14" />} />,
  Mail: (p) => <Icon {...p} path={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>} />,
  Lock: (p) => <Icon {...p} path={<><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>} />,
};

window.DBIcons = Icons;

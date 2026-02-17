export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body > header, body > footer { display: none !important; }
      `}</style>
      {children}
    </>
  );
}

export default function PageTitle({ title }: { title: string }) {
  return (
    <div class="flex items-center justify-between space-y-2 mb-2">
      <h2 class="text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-dvh px-4 py-6">
      <h1 className="text-[20px] font-bold">게시글 수정</h1>
      <p className="text-[13px] text-text-muted mt-2">
        상품 ID: {id} (수정 폼은 /products/new 와 동일 구조로 구현 예정)
      </p>
    </main>
  );
}

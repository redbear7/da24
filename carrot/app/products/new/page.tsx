"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "디지털/가전",
  "가구/인테리어",
  "유아동",
  "생활/주방",
  "의류",
  "뷰티/미용",
  "스포츠/레저",
  "취미/게임/음반",
  "도서",
  "반려동물용품",
  "식물",
  "기타 중고물품",
];

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 1) 이미지 업로드 (Supabase Storage)
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${i}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("products")
          .upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("products").getPublicUrl(path);
        uploadedUrls.push(pub.publicUrl);
      }

      // 2) 상품 생성 (API)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          price: Number(price),
          description,
          image_urls: uploadedUrls,
        }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg ?? "등록 실패");
      }

      const { id } = await res.json();
      router.push(`/products/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 bg-white border-b border-border h-14 flex items-center px-4 justify-between">
        <button type="button" onClick={() => router.back()}>취소</button>
        <h1 className="font-bold text-[16px]">내 물건 팔기</h1>
        <button
          type="submit"
          form="product-form"
          disabled={submitting}
          className="text-primary font-medium disabled:opacity-50"
        >
          완료
        </button>
      </header>

      <form id="product-form" onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-4 py-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 10))}
            className="text-[13px]"
          />
          {files.length > 0 && (
            <p className="text-[12px] text-text-muted mt-1">
              {files.length}장 선택됨 (최대 10장)
            </p>
          )}
        </div>

        <input
          type="text"
          placeholder="글 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={2}
          maxLength={60}
          className="h-12 px-4 border-y border-border-subtle text-[16px] focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="h-12 px-4 border-b border-border-subtle text-[16px] focus:outline-none bg-white"
        >
          <option value="">카테고리 선택</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          inputMode="numeric"
          placeholder="₩ 가격 (0 = 나눔)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min={0}
          className="h-12 px-4 border-b border-border-subtle text-[16px] focus:outline-none"
        />

        <textarea
          placeholder="올릴 게시물 내용을 작성해주세요. (구매 시기, 사용감, 하자 여부 등)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={10}
          className="px-4 py-3 text-[15px] focus:outline-none resize-none"
        />

        {error && (
          <p className="px-4 py-2 text-[13px] text-danger">{error}</p>
        )}
      </form>
    </main>
  );
}

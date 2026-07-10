import Background from '@/components/layout/background';
import { IoSearch, IoCloudUpload, IoCheckmarkCircle, IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAllColleges } from '@/services/collegeService';
import { resolveImageUrl } from '@/utils/imageResolver';
import { College } from '@/types';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';
import { API_BASE } from '@/config/env';

export default function AdicionarScreen() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; ok: boolean; msg: string } | null>(null);
  const [hasImageMap, setHasImageMap] = useState<Record<number, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedIdRef = useRef<number | null>(null);

  useEffect(() => {
    getAllColleges().then((data) => {
      setColleges(data);
      const map: Record<number, boolean> = {};
      for (const c of data) {
        map[c.id] = !!resolveImageUrl(c.image);
      }
      setHasImageMap(map);
    });
  }, []);

  const filtered = colleges.filter((c) => {
    if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (onlyMissing && hasImageMap[c.id]) return false;
    return true;
  });

  const handleSelect = (collegeId: number) => {
    selectedIdRef.current = collegeId;
    fileRef.current?.click();
  };

  function randomHex(len: number): string {
    const bytes = new Uint8Array(len / 2);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const collegeId = selectedIdRef.current;
    if (!file || !collegeId) return;

    setUploading(collegeId);
    setFeedback(null);

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const renamed = new File([file], `${randomHex(24)}.${ext}`, { type: file.type });
      const formData = new FormData();
      formData.append('image', renamed);
      const res = await fetch(`${API_BASE}/college/${collegeId}/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFeedback({ id: collegeId, ok: true, msg: 'Imagem enviada com sucesso!' });
      setHasImageMap((prev) => ({ ...prev, [collegeId]: true }));
    } catch (err) {
      setFeedback({ id: collegeId, ok: false, msg: `Erro: ${err instanceof Error ? err.message : 'Falha no envio'}` });
    } finally {
      setUploading(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Background title="Adicionar Imagem" showBackButton>
      <PageTransition>
        <div className="flex-1 p-4">
          <motion.div
            className="relative mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 rounded-2xl"
              placeholder="Buscar faculdade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={(e) => setOnlyMissing(e.target.checked)}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm text-muted-foreground">Apenas sem foto</span>
          </label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          <div className="space-y-3 pb-24">
            {filtered.map((item) => {
              const isUploading = uploading === item.id;
              const fb = feedback?.id === item.id ? feedback : null;
              const hasPhoto = hasImageMap[item.id];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-primary truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${hasPhoto ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <IoImageOutline size={14} />
                          {hasPhoto ? 'Tem foto' : 'Sem foto'}
                        </p>
                      </div>
                      <Button
                        size="lg"
                        variant={hasPhoto ? 'accent' : 'outline'}
                        className="gap-2 shrink-0"
                        disabled={isUploading}
                        onClick={() => handleSelect(item.id)}
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : fb?.ok ? (
                          <IoCheckmarkCircle size={18} />
                        ) : (
                          <IoCloudUpload size={18} />
                        )}
                        {isUploading ? 'Enviando…' : hasPhoto ? 'Trocar' : 'Foto'}
                      </Button>
                    </div>
                    {fb && !fb.ok && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <IoCloseCircle size={14} /> {fb.msg}
                      </p>
                    )}
                  </Card>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-16">
                Nenhuma faculdade encontrada
              </p>
            )}
          </div>
        </div>
      </PageTransition>
    </Background>
  );
}

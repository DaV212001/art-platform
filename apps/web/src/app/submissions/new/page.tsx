'use client';

import { useState, useRef, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Loader2, UploadCloud, FileImage, X, AlertCircle, Coins, CheckCircle2, ImageIcon,
} from 'lucide-react';
import apiClient from '@/lib/api/client';
import AuthGuard from '@/components/auth/auth-guard';

const CREDIT_COST = 3;

function UploadZone({
  file,
  previewUrl,
  onFileChange,
  onRemove,
  fileInputRef,
}: {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      const syntheticEvent = { target: { files: [dropped] } } as any;
      onFileChange(syntheticEvent);
    }
  };

  if (file && previewUrl) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}
      >
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-auto max-h-[480px] object-contain"
        />
        <div
          className="absolute top-0 inset-x-0 p-3 flex justify-between items-center"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'var(--color-foreground)' }}
          >
            <FileImage className="w-3.5 h-3.5" />
            {file.name}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(242,84,125,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div
          className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-2 text-xs"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', color: '#5ddba3' }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Image ready to submit
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center rounded-2xl p-14 text-center cursor-pointer transition-all"
      style={{
        border: `2px dashed ${dragOver ? 'var(--color-brand)' : 'var(--color-border)'}`,
        background: dragOver ? 'var(--color-brand-dim)' : 'var(--color-surface-2)',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all"
        style={{
          background: dragOver ? 'var(--color-brand-dim)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${dragOver ? 'var(--color-brand-border)' : 'var(--color-border)'}`,
        }}
      >
        <UploadCloud
          className="w-7 h-7 transition-colors"
          style={{ color: dragOver ? '#b39fff' : 'var(--color-muted)' }}
        />
      </div>
      <p className="font-semibold mb-1">
        {dragOver ? 'Drop to upload' : 'Click to upload or drag & drop'}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
        JPG, PNG or WEBP · Max 10 MB
      </p>
    </div>
  );
}

function SubmissionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = searchParams.get('exerciseId');
  const chainId = searchParams.get('chainId');

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ notes: string }>();

  if (!exerciseId) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <ImageIcon className="w-9 h-9" style={{ color: 'var(--color-subtle)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-3">No exercise selected</h1>
        <p className="mb-8" style={{ color: 'var(--color-muted)' }}>
          Please select an exercise from the library first.
        </p>
        <button onClick={() => router.push('/exercises')} className="btn btn-primary">
          Browse exercises
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target?.files?.[0];
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10 MB');
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
  };

  const uploadToCloudinary = async (fileToUpload: File): Promise<string> => {
    console.log('[Upload] Requesting signature from backend...');
    const { data: sigData } = await apiClient.post('/submissions/upload-url');
    console.log('[Upload] Signature received:', sigData);

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('api_key', sigData.apiKey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);
    if (sigData.transformation) {
      console.log('[Upload] Appending transformation:', sigData.transformation);
      formData.append('transformation', sigData.transformation);
    }

    const cloudName = sigData.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.error('[Upload] Cloudinary cloudName missing');
      throw new Error('Cloudinary configuration missing');
    }

    console.log(`[Upload] Sending request to Cloudinary (cloudName: ${cloudName})...`);
    console.log('[Upload] FormData entries:', Array.from(formData.entries()).map(([k, v]) => `${k}: ${v instanceof File ? v.name : v}`));

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error(`[Upload] Cloudinary rejected upload with status ${uploadRes.status}:`, errorText);
      throw new Error(`Failed to upload image: ${errorText}`);
    }

    const result = await uploadRes.json();
    console.log('[Upload] Cloudinary upload successful. Public ID:', result.public_id);
    return result.public_id;
  };

  const onSubmit = async (data: { notes: string }) => {
    if (!file) { setError('Please select an image to submit'); return; }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress('uploading');

      const publicId = await uploadToCloudinary(file);
      setUploadProgress('submitting');

      let res;
      if (chainId) {
        res = await apiClient.post(`/submissions/chains/${chainId}/revisions`, {
          imagePublicId: publicId,
          notes: data.notes,
        });
      } else {
        res = await apiClient.post('/submissions', {
          exerciseId,
          imagePublicId: publicId,
          notes: data.notes,
        });
      }

      setUploadProgress('done');
      router.push(`/submissions/chain/${res.data.chainId}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit. Please try again.');
      setUploadProgress('idle');
    } finally {
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || isSubmitting;

  const progressLabel = {
    idle:       'Submit Practice',
    uploading:  'Uploading image...',
    submitting: 'Saving submission...',
    done:       'Done!',
  }[uploadProgress];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <p className="section-label mb-2">{chainId ? 'New Revision' : 'New Submission'}</p>
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-plus-jakarta, var(--font-inter))' }}
        >
          {chainId ? 'Submit Revision' : 'Submit Practice'}
        </h1>
        <p style={{ color: 'var(--color-muted)' }}>
          Upload your artwork to receive structured peer feedback.
        </p>
      </div>

      {/* Credit cost notice */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-8"
        style={{
          background: 'var(--color-credit-dim)',
          border: '1px solid var(--color-credit-border)',
        }}
      >
        <Coins className="w-5 h-5 flex-shrink-0" style={{ color: '#ffc662' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#ffc662' }}>
            This costs {CREDIT_COST} credits
          </p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Credits are deducted when your review is requested. Earn them back by reviewing others.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error */}
        {error && (
          <div
            className="p-4 rounded-xl flex items-start gap-3"
            style={{ background: 'var(--color-danger-dim)', border: '1px solid rgba(242,84,125,0.25)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff82a1' }} />
            <p className="text-sm" style={{ color: '#ff82a1' }}>{error}</p>
          </div>
        )}

        {/* Upload zone */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
            Artwork Image <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <UploadZone
            file={file}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            onRemove={() => { setFile(null); setPreviewUrl(null); }}
            fileInputRef={fileInputRef}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>

        {/* Artist notes */}
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>
            Artist Notes
            <span className="ml-2 font-normal text-xs" style={{ color: 'var(--color-muted)' }}>optional</span>
          </label>
          <p className="text-xs mb-2" style={{ color: 'var(--color-subtle)' }}>
            Tell reviewers what you struggled with or where you want specific feedback.
          </p>
          <textarea
            {...register('notes')}
            rows={4}
            className="input resize-none"
            style={{ borderRadius: 'var(--radius-lg)' }}
            placeholder="e.g. I had trouble getting the foreshortening right on the left arm..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isBusy || !file}
          className="btn btn-primary btn-lg w-full"
        >
          {isBusy ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              {progressLabel}
            </>
          ) : (
            <>
              {progressLabel}
              <span
                className="ml-auto flex items-center gap-1 text-sm opacity-70"
              >
                <Coins className="w-3.5 h-3.5" />
                −{CREDIT_COST}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function NewSubmissionPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-brand)' }} />
          </div>
        }
      >
        <SubmissionForm />
      </Suspense>
    </AuthGuard>
  );
}

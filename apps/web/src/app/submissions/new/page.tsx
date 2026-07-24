'use client';

import { useState, useRef, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, UploadCloud, FileImage, X, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api/client';

function SubmissionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = searchParams.get('exerciseId');
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ notes: string }>();

  if (!exerciseId) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">No exercise selected</h1>
        <p className="text-slate-400 mb-8">Please select an exercise from the library first.</p>
        <button onClick={() => router.push('/exercises')} className="text-violet-400 hover:text-violet-300">
          Go to Library
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const uploadToCloudinary = async (fileToUpload: File): Promise<string> => {
    // Get signature from our backend
    const { data: sigData } = await apiClient.post('/submissions/upload-url');
    
    // Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('api_key', sigData.apikey);
    formData.append('timestamp', sigData.timestamp);
    formData.append('signature', sigData.signature);
    formData.append('folder', sigData.folder);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("Cloudinary configuration missing");

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadRes.ok) {
      throw new Error('Failed to upload image to storage');
    }
    
    const result = await uploadRes.json();
    return result.public_id;
  };

  const onSubmit = async (data: { notes: string }) => {
    if (!file) {
      setError('Please select an image to submit');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      const publicId = await uploadToCloudinary(file);
      
      const res = await apiClient.post('/submissions', {
        exerciseId,
        imagePublicId: publicId,
        notes: data.notes,
      });
      
      // Navigate to the chain view (we'll implement this later)
      router.push(`/submissions/chain/${res.data.chainId}`);
      
    } catch (err: any) {
      setError(err?.message || 'Failed to submit practice. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-extrabold text-white mb-2">Submit Practice</h1>
      <p className="text-slate-400 mb-8">Upload your artwork for this exercise. Make sure the lighting is good and the image is clear.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass-card p-8">
        {error && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-rose-200">{error}</p>
          </div>
        )}

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Artwork Image</label>
          
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-violet-500/50 rounded-xl p-12 text-center cursor-pointer bg-slate-900/50 transition-colors flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-400">JPG, PNG or WEBP (max. 10MB)</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900">
              <img src={previewUrl!} alt="Preview" className="w-full h-auto max-h-[500px] object-contain" />
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
                <div className="flex items-center text-white bg-black/40 px-3 py-1.5 rounded-md backdrop-blur-sm text-sm">
                  <FileImage className="w-4 h-4 mr-2" />
                  {file.name}
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-rose-500/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Artist Notes (Optional)
          </label>
          <p className="text-xs text-slate-400 mb-2">Let reviewers know what specific areas you struggled with or want feedback on.</p>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full bg-slate-900 border border-white/10 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            placeholder="I had trouble capturing the correct proportion of the cranium..."
          />
        </div>

        <button
          type="submit"
          disabled={isUploading || isSubmitting || !file}
          className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-lg text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg font-medium"
        >
          {isUploading || isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {isUploading ? 'Uploading Image...' : 'Submitting...'}
            </>
          ) : (
            'Submit Practice'
          )}
        </button>
      </form>
    </div>
  );
}

export default function NewSubmissionPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    }>
      <SubmissionForm />
    </Suspense>
  );
}

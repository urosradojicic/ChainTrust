import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const STEPS = ['Basic Information', 'Data Sources', 'Upload & IPFS', 'Review & Submit'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', category: 'Fintech', description: '', website: '',
    stripeKey: '', analyticsEndpoint: '', autoPublish: false,
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const update = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.name && form.category && form.description;
    return true;
  };

  const handleFile = (file: File) => {
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadToIPFS = async () => {
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));
    setIpfsHash('QmX7b5jxn7bqvBuYCfhEqm4DfkNdEzWzqPfeGRhYJFKpvA');
    setUploading(false);
  };

  const submitOnChain = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 3000));
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        {/* Confetti */}
        <div className="relative mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full"
              style={{
                background: ['#534AB7', '#1D9E75', '#BA7517', '#E24B4A', '#3B82F6', '#A855F7'][i % 6],
                left: '50%', top: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * 120,
                y: Math.sin((i / 12) * Math.PI * 2) * 120,
                scale: 0, opacity: 0,
              }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-accent"
          >
            <svg className="h-10 w-10 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold">Registration Successful!</h2>
        <p className="mt-3 text-muted-foreground">Your startup has been registered on-chain. Oracle verification will begin within 24 hours.</p>
        <Link to="/dashboard" className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Register Startup</h1>
      <p className="mt-1 text-muted-foreground">Register your startup on Base blockchain in 4 steps</p>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
              i < step ? 'bg-accent text-accent-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {i < step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 hidden h-0.5 w-8 sm:block ${i < step ? 'bg-accent' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="mt-8 space-y-5"
        >
          {step === 0 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Startup Name</label>
                <input
                  value={form.name} onChange={e => update('name', e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="e.g. PayFlow"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <select
                  value={form.category} onChange={e => update('category', e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  {['Fintech', 'SaaS', 'DeFi', 'Cleantech'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description} onChange={e => update('description', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
                  placeholder="Describe your startup..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Website URL</label>
                <input
                  type="url" value={form.website} onChange={e => update('website', e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Stripe API Key</label>
                <input
                  type="password" value={form.stripeKey} onChange={e => update('stripeKey', e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="sk_live_..."
                />
                <p className="mt-1 text-xs text-muted-foreground">Read-only key. We never store raw keys on-chain.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Analytics Endpoint</label>
                <input
                  type="url" value={form.analyticsEndpoint} onChange={e => update('analyticsEndpoint', e.target.value)}
                  className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  placeholder="https://analytics.example.com/api"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <span className="text-sm font-medium">Auto-publish metrics monthly</span>
                <button
                  onClick={() => update('autoPublish', !form.autoPublish)}
                  className={`relative h-6 w-11 rounded-full transition ${form.autoPublish ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition ${form.autoPublish ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <div className="flex gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800 dark:text-blue-300">After connecting data sources, Chainlink oracles will independently verify your metrics against your Stripe and analytics data.</p>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted'}`}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="mx-auto h-20 w-20 rounded-xl object-cover" />
                ) : (
                  <>
                    <svg className="mx-auto h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">Drag & drop your logo here, or click to browse</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 2MB</p>
                  </>
                )}
                <input id="file-input" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Metadata Preview</h4>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono">
{JSON.stringify({
  name: form.name, category: form.category, description: form.description,
  website: form.website, autoPublish: form.autoPublish,
  hasStripeIntegration: !!form.stripeKey, hasAnalyticsEndpoint: !!form.analyticsEndpoint,
}, null, 2)}
                </pre>
              </div>

              {!ipfsHash ? (
                <button
                  onClick={uploadToIPFS}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {uploading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
                  {uploading ? 'Uploading...' : 'Upload to IPFS'}
                </button>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-accent">Uploaded to IPFS</span>
                  </div>
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{ipfsHash}</p>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="rounded-xl border overflow-hidden">
                {[
                  ['Name', form.name],
                  ['Category', form.category],
                  ['Description', form.description],
                  ['Website', form.website],
                  ['Stripe Key', form.stripeKey ? 'Connected' : 'Not connected'],
                  ['Analytics', form.analyticsEndpoint || 'Not connected'],
                  ['Auto-Publish', form.autoPublish ? 'Yes' : 'No'],
                  ['IPFS Hash', ipfsHash || 'Not uploaded'],
                ].map(([label, value], i) => (
                  <div key={label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
              </div>
              {logoPreview && <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-xl object-cover" />}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                <p className="text-sm text-amber-800 dark:text-amber-300">Registration is free. Verification costs 100 CMT (paid from your wallet upon oracle request).</p>
              </div>
              <button
                onClick={submitOnChain}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
                {submitting ? 'Submitting to Blockchain...' : 'Register Startup On-Chain'}
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="rounded-xl border px-6 py-2.5 font-semibold transition hover:bg-muted">
            Back
          </button>
        ) : <div />}
        {step < 3 && (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-40"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../ui/common.jsx';
import { packages } from '../../data.js';

const umrahPackages = packages.filter(item => item.category === 'Umrah');
const steps = ['Paket', 'Data pendaftar', 'Tinjau'];
const initialForm = {
  packageId: '',
  travelers: '1',
  name: '',
  phone: '',
  note: ''
};
const registrationApiEnabled = import.meta.env.VITE_REGISTRATION_API_ENABLED === 'true';
const returnedFromPayment = new URLSearchParams(window.location.search).get('payment') === 'return';

function formatPackageName(packageItem) {
  return `${packageItem.title} — ${packageItem.departure}`;
}

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [previewComplete, setPreviewComplete] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(registrationApiEnabled);
  const [savingDraft, setSavingDraft] = useState(false);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [paymentConfigLoaded, setPaymentConfigLoaded] = useState(!registrationApiEnabled);
  const [paymentConfig, setPaymentConfig] = useState({ enabled: false, dpEnabled: false });
  const [paymentType, setPaymentType] = useState('full');
  const [apiError, setApiError] = useState('');

  const selectedPackage = umrahPackages.find(item => String(item.id) === form.packageId);

  useEffect(() => {
    if (!registrationApiEnabled) return undefined;
    const controller = new AbortController();

    const loadPaymentConfig = async () => {
      try {
        const response = await fetch('/api/payments/config', {
          credentials: 'same-origin',
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Konfigurasi pembayaran gagal dimuat.');
        if (!controller.signal.aborted) setPaymentConfig(result);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Unable to load payment configuration:', error);
        setApiError(error instanceof Error ? error.message : 'Konfigurasi pembayaran gagal dimuat.');
      } finally {
        if (!controller.signal.aborted) setPaymentConfigLoaded(true);
      }
    };

    const loadDraft = async () => {
      try {
        const response = await fetch('/api/registrations/draft', {
          credentials: 'same-origin',
          signal: controller.signal
        });
        if (response.status === 204) return;
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Draft pendaftaran gagal dimuat.');
        if (controller.signal.aborted) return;

        const registration = result.registration;
        setForm({
          packageId: registration.packageId,
          travelers: registration.travelers,
          name: registration.name,
          phone: registration.phone,
          note: registration.note
        });
        setDraftSaved(true);
        setStep(registration.name && registration.phone ? 2 : 1);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Unable to load registration draft:', error);
        setApiError(error instanceof Error ? error.message : 'Draft pendaftaran gagal dimuat.');
      } finally {
        if (!controller.signal.aborted) setLoadingDraft(false);
      }
    };

    void loadPaymentConfig();
    void loadDraft();
    return () => controller.abort();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  };

  const saveDraft = async () => {
    if (!registrationApiEnabled) return;
    setSavingDraft(true);
    setApiError('');
    try {
      const response = await fetch('/api/registrations/draft', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(result.error || 'Pendaftaran gagal disimpan.');
      setDraftSaved(true);
    } catch (error) {
      console.error('Unable to save registration draft:', error);
      setApiError(error instanceof Error ? error.message : 'Pendaftaran gagal disimpan.');
      throw error;
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingDraft || creatingPayment || loadingDraft || !paymentConfigLoaded) return;
    try {
      await saveDraft();
      if (step < steps.length - 1) {
        setStep(current => current + 1);
        return;
      }

      if (registrationApiEnabled && paymentConfig.enabled) {
        setCreatingPayment(true);
        setApiError('');
        const response = await fetch('/api/registrations/payment', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentType })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Halaman pembayaran gagal dibuat.');
        window.location.assign(result.payment.paymentUrl);
        return;
      }

      setPreviewComplete(true);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Proses pendaftaran gagal.');
    } finally {
      setCreatingPayment(false);
    }
  };

  const restartPreview = () => {
    setForm(initialForm);
    setStep(0);
    setPreviewComplete(false);
    setDraftSaved(false);
    setApiError('');
  };

  return <section className="section registration-section" id="daftar">
    <div className="container registration-layout">
      <div className="registration-intro">
        <SectionHeading
          eyebrow="PENDAFTARAN JAMAAH"
          title={<>Mulai rencanakan<br /><em>perjalanan Anda.</em></>}
          text="Pilih paket dan isi informasi pendaftar. Form dibuat bertahap agar proses pendaftaran lebih mudah diikuti."
          center
        />
        <div className="registration-demo-notice" role="note">
          <strong>{registrationApiEnabled ? 'Penyimpanan draft aktif' : 'Pratinjau form'}</strong>
          <span>
            {registrationApiEnabled
              ? 'Draft disimpan ke server setiap kali Anda melanjutkan. Pembayaran belum tersedia.'
              : 'Form belum terhubung ke server. Jangan masukkan data pribadi sungguhan.'}
          </span>
        </div>
        {returnedFromPayment && <div className="registration-payment-return" role="status">
          Anda kembali dari halaman pembayaran. Status pembayaran akan diperbarui setelah notifikasi resmi gateway diterima.
        </div>}
      </div>

      <div className="registration-card">
        <div className="registration-form-heading">
          <span>FORM PENDAFTARAN</span>
          <strong>Informasi calon jamaah</strong>
        </div>

        <ol className="registration-stepper" aria-label="Langkah pendaftaran">
          {steps.map((label, index) => {
            const isComplete = index < step || previewComplete;
            const isCurrent = index === step && !previewComplete;
            return <li
              className={`registration-step${isCurrent ? ' is-current' : ''}${isComplete ? ' is-complete' : ''}`}
              key={label}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="registration-step-marker" aria-hidden="true">
                {isComplete ? <Check size={15} /> : index + 1}
              </span>
              <span>{label}</span>
            </li>;
          })}
        </ol>

        {loadingDraft ? <div className="registration-preview-result" role="status" aria-live="polite">
          <p>Memeriksa draft pendaftaran…</p>
        </div> : previewComplete ? <div className="registration-preview-result" role="status" aria-live="polite">
          <CheckCircle2 size={38} aria-hidden="true" />
          <h3>{draftSaved ? 'Draft pendaftaran tersimpan' : 'Pratinjau selesai'}</h3>
          <p>{draftSaved
            ? 'Informasi pendaftaran sudah tersimpan. Pembayaran belum tersedia; invoice belum dibuat.'
            : 'Data tidak dikirim atau disimpan. Database dan pembayaran akan disambungkan pada tahap berikutnya.'}</p>
          <button className="button button-outline" type="button" onClick={restartPreview}>Ulangi pratinjau</button>
        </div> : <form className="registration-form" onSubmit={handleSubmit}>
          {step === 0 && <>
            <p className="registration-step-description">Pilih paket yang ingin diikuti dan jumlah jamaah.</p>
            <label className="registration-field">
              <span>Paket umrah</span>
              <select name="packageId" value={form.packageId} onChange={updateField} required>
                <option value="" disabled>Pilih paket</option>
                {umrahPackages.map(item => <option value={item.id} key={item.id}>{formatPackageName(item)}</option>)}
              </select>
            </label>

            {selectedPackage && <div className="registration-package-summary">
              <span>Harga per jamaah</span>
              <strong>{selectedPackage.price}</strong>
              <small>{selectedPackage.date} · {selectedPackage.duration}</small>
            </div>}

            <label className="registration-field">
              <span>Jumlah jamaah</span>
              <input
                name="travelers"
                type="number"
                min="1"
                step="1"
                value={form.travelers}
                onChange={updateField}
                required
              />
            </label>
          </>}

          {step === 1 && <>
            <p className="registration-step-description">Masukkan kontak utama yang dapat dihubungi untuk pendaftaran ini.</p>
            <label className="registration-field">
              <span>Nama pendaftar</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Contoh: Ahmad Jamaah"
                value={form.name}
                onChange={updateField}
                required
              />
            </label>

            <label className="registration-field">
              <span>Nomor WhatsApp</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Contoh: 08xxxxxxxxxx"
                value={form.phone}
                onChange={updateField}
                required
              />
            </label>

            <label className="registration-field">
              <span>Catatan <small>(opsional)</small></span>
              <textarea
                name="note"
                rows="3"
                placeholder="Tulis pertanyaan atau kebutuhan khusus."
                value={form.note}
                onChange={updateField}
              />
            </label>
          </>}

          {step === 2 && <div className="registration-review">
            <p className="registration-step-description">Periksa kembali informasi sebelum melanjutkan.</p>
            <dl>
              <div><dt>Paket</dt><dd>{selectedPackage ? formatPackageName(selectedPackage) : 'Belum dipilih'}</dd></div>
              <div><dt>Keberangkatan</dt><dd>{selectedPackage?.date ?? '—'}</dd></div>
              <div><dt>Jumlah jamaah</dt><dd>{form.travelers}</dd></div>
              <div><dt>Nama pendaftar</dt><dd>{form.name}</dd></div>
              <div><dt>Nomor WhatsApp</dt><dd>{form.phone}</dd></div>
              {form.note && <div><dt>Catatan</dt><dd>{form.note}</dd></div>}
            </dl>
            <button className="registration-edit-link" type="button" onClick={() => setStep(0)}>Ubah pilihan paket</button>
            <button className="registration-edit-link" type="button" onClick={() => setStep(1)}>Ubah data pendaftar</button>
          </div>}

          {step === 2 && registrationApiEnabled && paymentConfig.enabled && <fieldset className="registration-payment-options">
            <legend>Pilih pembayaran</legend>
            {paymentConfig.dpEnabled && <label>
              <input
                type="radio"
                name="paymentType"
                value="dp"
                checked={paymentType === 'dp'}
                onChange={() => setPaymentType('dp')}
              />
              <span>Bayar DP</span>
            </label>}
            <label>
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === 'full'}
                onChange={() => setPaymentType('full')}
              />
              <span>Bayar lunas</span>
            </label>
          </fieldset>}

          {step === 2 && registrationApiEnabled && !paymentConfig.enabled && paymentConfigLoaded &&
            <p className="registration-payment-unavailable">Pembayaran belum dikonfigurasi. Draft tetap dapat disimpan, tetapi belum ada tagihan yang dibuat.</p>}

          <div className="registration-form-actions">
            {step > 0 && <button className="button button-outline" type="button" onClick={() => setStep(current => current - 1)}>
              <ArrowLeft size={17} /> Kembali
            </button>}
            <button className="button button-primary registration-submit" type="submit" disabled={savingDraft || creatingPayment || loadingDraft || !paymentConfigLoaded}>
              {savingDraft ? 'Menyimpan…' : creatingPayment ? 'Membuka pembayaran…' : step === steps.length - 1
                ? registrationApiEnabled && paymentConfig.enabled ? 'Lanjut ke pembayaran' : registrationApiEnabled ? 'Simpan draft' : 'Selesaikan pratinjau'
                : 'Selanjutnya'}
              {!savingDraft && !creatingPayment && step < steps.length - 1 && <ArrowRight size={17} />}
            </button>
          </div>
          {apiError && <p className="registration-api-error" role="alert">{apiError}</p>}
        </form>}
      </div>
    </div>
  </section>;
}

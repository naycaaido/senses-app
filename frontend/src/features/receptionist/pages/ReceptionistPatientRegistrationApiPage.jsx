import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
} from "../components/ui.jsx";
import {
  createReceptionistPatient,
  getReceptionistPatientProfile,
  updateReceptionistPatient,
} from "../../../shared/services/receptionistPatientApi.js";

const empty = {
  name: "",
  phone: "",
  email: "",
  password: "",
  gender: "",
  birthPlace: "",
  birthDate: "",
  education: "",
  job: "",
  maritalStatus: "",
  religion: "",
  address: "",
  city: "",
};
function Section({ title, children }) {
  return (
    <Card pad='lg'>
      <h2 className='font-bold'>{title}</h2>
      <div className='mt-4 grid gap-4 sm:grid-cols-2'>{children}</div>
    </Card>
  );
}

export default function ReceptionistPatientRegistrationApiPage() {
  const { id } = useParams();
  const email = id ? decodeURIComponent(id) : "";
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!editing) return;
    (async () => {
      try {
        setForm({ ...empty, ...(await getReceptionistPatientProfile(email)) });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [email, editing]);
  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const patient = editing
        ? await updateReceptionistPatient(email, form)
        : await createReceptionistPatient(form);
      navigate(`/resepsionis/data-pasien/${encodeURIComponent(patient.email)}`);
    } catch (requestError) {
      setError(requestError.message || "Pasien tidak dapat disimpan.");
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return <p className='py-10 text-center text-sm'>Memuat pasien…</p>;
  return (
    <form onSubmit={submit} className='mx-auto flex max-w-4xl flex-col gap-5'>
      <div>
        <h1 className='text-[28px] font-bold'>
          {editing ? "Edit Pasien" : "Pendaftaran Pasien Baru"}
        </h1>
        <p className='mt-1 text-sm text-[#434655]'>
          {editing ? "Perbarui data pasien." : "Buat akun dan biodata pasien."}
        </p>
      </div>
      <Section title='Akun & Kontak'>
        <Field label='Nama Lengkap' required>
          <Input value={form.name} onChange={set("name")} />
        </Field>
        <Field label='Nomor Telepon' required>
          <Input value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label='Email' required>
          <Input
            type='email'
            readOnly={editing}
            value={form.email}
            onChange={set("email")}
          />
        </Field>
        {!editing && (
          <Field label='Password awal' required>
            <Input
              type='password'
              value={form.password}
              onChange={set("password")}
            />
          </Field>
        )}
      </Section>
      <Section title='Biodata'>
        <Field label='Jenis Kelamin'>
          <Select value={form.gender} onChange={set("gender")}>
            <option value=''>Pilih</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </Select>
        </Field>
        <Field label='Tempat Lahir'>
          <Input value={form.birthPlace} onChange={set("birthPlace")} />
        </Field>
        <Field label='Tanggal Lahir'>
          <Input
            type='date'
            value={form.birthDate}
            onChange={set("birthDate")}
          />
        </Field>
        <Field label='Pendidikan'>
          <Input value={form.education} onChange={set("education")} />
        </Field>
        <Field label='Pekerjaan'>
          <Input value={form.job} onChange={set("job")} />
        </Field>
        <Field label='Status Perkawinan'>
          <Input value={form.maritalStatus} onChange={set("maritalStatus")} />
        </Field>
        <Field label='Agama'>
          <Input value={form.religion} onChange={set("religion")} />
        </Field>
      </Section>
      <Section title='Alamat'>
        <Field label='Alamat Domisili' className='sm:col-span-2'>
          <Textarea rows={3} value={form.address} onChange={set("address")} />
        </Field>
        <Field label='Kota'>
          <Input value={form.city} onChange={set("city")} />
        </Field>
      </Section>
      {error && (
        <p className='rounded-lg bg-[#fdf1f1] p-3 text-sm text-[#a03d4a]'>
          {error}
        </p>
      )}
      <div className='flex justify-end gap-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() =>
            navigate(
              editing
                ? `/resepsionis/data-pasien/${encodeURIComponent(email)}`
                : "/resepsionis/data-pasien",
            )
          }
        >
          Batal
        </Button>
        <Button
          type='submit'
          disabled={
            saving ||
            !form.name ||
            !form.phone ||
            !form.email ||
            (!editing && !form.password)
          }
        >
          {saving ? "Menyimpan…" : "Simpan Pasien"}
        </Button>
      </div>
    </form>
  );
}

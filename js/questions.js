// Bank pertanyaan. String = butir skala 1-4 (id otomatis huruf+urutan). Objek = jenis lain.
const SCALE_LEGEND = "1 = Sangat Tidak Setuju · 2 = Tidak Setuju · 3 = Setuju · 4 = Sangat Setuju · atau pilih “Tidak tahu / Tidak berlaku”.";
const o = (t, o2, max, opt) => ({ t, o: o2, max, opt });
const SEC = [];
function def(id, title, items, core, note) {
  const q = items.map((it, i) => {
    const base = { id: id + (i + 1) };
    if (typeof it === "string") return { ...base, type: "s", t: it };
    return { ...base, ...it };
  });
  SEC.push({ id, title, q, core: !!core, note });
}
const C = (t, opts, extra) => ({ type: "c", t, o: opts, ...extra });
const M = (t, opts, max, extra) => ({ type: "m", t, o: opts, max, ...extra });
const T = (t) => ({ type: "t", t, opt: true });
const Y = (t) => ({ type: "c", t, o: ["Ya", "Tidak"] });

def("Z", "Persetujuan", [C("Saya bersedia mengisi angket ini.", ["Ya", "Tidak"])]);
def("A", "Identitas (tanpa nama)", [
  C("Jenis organisasi yang paling aktif kamu ikuti.", ["UKM", "HIMA", "BEM", "DPK", "Organisasi lain"]),
  { type: "t", t: "Fakultas / program studi", opt: true },
  C("Posisi kamu sekarang.", ["Ketua atau wakil ketua", "Sekretaris atau bendahara", "Koordinator atau ketua divisi", "Anggota"]),
  C("Lama berorganisasi di kampus.", ["Kurang dari 1 tahun", "1 sampai 2 tahun", "Lebih dari 2 tahun"]),
  C("Jumlah organisasi atau kepanitiaan yang kamu ikuti saat ini.", ["1", "2", "3", "4 atau lebih"]),
], 0, "Jika posisimu bukan anggota, setelah Bagian 1 kamu akan lanjut ke Bagian 2.");
def("B", "Esensi dan dampak", [
  "Saya bisa menjelaskan alasan organisasi saya berdiri tanpa menyebut nama kegiatannya.",
  "Sebagian besar pengurus di organisasi saya memahami tujuan organisasi, bukan hanya daftar proker.",
  "Organisasi saya punya rumusan tujuan atau nilai tertulis yang dikenal anggotanya.",
  "Kegiatan yang kami buat selaras dengan alasan organisasi berdiri.",
  "Saya bisa menyebut dampak nyata dari kegiatan terakhir organisasi saya bagi sasarannya.",
  "Keberhasilan kegiatan di organisasi saya lebih sering diukur dari “sudah terlaksana” daripada “sudah bermanfaat”.",
  "Ada kegiatan di organisasi saya yang dilaksanakan sekadar untuk menggugurkan proker.",
]);
def("C", "Proker unggulan", [
  "Organisasi saya punya proker unggulan yang menjadi ciri khasnya.",
  "Proker unggulan itu selaras dengan alasan organisasi berdiri.",
  "Kualitas proker unggulan ditingkatkan dari satu periode ke periode berikutnya.",
  "Proker unggulan menjadi pusat bagi program-program lain di organisasi saya.",
  T("Sebutkan jenis proker unggulan organisasimu, tanpa menyebut nama organisasi."),
]);
def("D", "Peran ketua", [
  "Ketua di organisasi saya lebih fokus membangun sistem kerja daripada tampil di depan.",
  "Ketua hadir pada acara-acara penting organisasi.",
  "Ketua mau menerima kritik dari pengurus dan anggota.",
  "Ketua sering mengerjakan sendiri pekerjaan yang seharusnya dibagi.",
  "Hubungan ketua dengan anggota akrab, namun ketua tetap dihormati.",
  "Ketika organisasi bermasalah, yang pertama disalahkan adalah ketuanya.",
  "Ketika organisasi berjalan baik, yang dipuji adalah organisasinya.",
]);
def("E", "Konteks kampus", [
  "Organisasi saya mengenali jumlah dan karakter SDM yang dimiliki sebelum merancang program.",
  "Banyak pengurus di organisasi saya merangkap jabatan atau peran di tempat lain.",
  "Organisasi saya memanfaatkan jejaring alumni, dosen, atau mitra lokal.",
  "Kedekatan antarmahasiswa membuat koordinasi di organisasi saya lebih mudah.",
  "Organisasi saya bergantung pada beberapa orang tertentu untuk menjalankan kegiatan.",
  "Gagasan dari organisasi atau kampus lain kami sesuaikan dulu sebelum dipakai.",
]);
def("F", "Seleksi pengurus dan pertemanan", [
  "Ada kriteria atau mekanisme yang jelas dalam memilih pengurus.",
  "Pengurus dipilih berdasarkan kemampuan, bukan kedekatan dengan ketua.",
  "Pengurus ditempatkan sesuai kekuatannya.",
  "Ada pengurus yang tidak menjalankan tugasnya karena segan ditegur.",
  "Teman dekat ketua lebih sulit ditegur dalam struktur organisasi.",
  "Ada kesepakatan yang memisahkan hubungan pertemanan dan peran di organisasi.",
  "Pertemanan pernah renggang karena persoalan organisasi.",
  M("Faktor yang paling menentukan saat susunan pengurus dibuat.", ["Kemampuan", "Kedekatan", "Ketersediaan waktu", "Kemauan", "Senioritas", "Hasil seleksi tertulis", "Lainnya"], 2),
]);
def("G", "Konflik, motivasi, dan apresiasi", [
  "Konflik antarpengurus biasanya diselesaikan lewat cara yang disepakati.",
  "Saya merasa dilibatkan dalam pengambilan keputusan.",
  "Kontribusi kecil anggota dihargai di organisasi saya.",
  "Banyak pengurus atau anggota yang menghilang di tengah periode.",
  "Anggota yang pasif didekati dan diajak kembali.",
  M("Penyebab utama anggota menghilang.", ["Kesibukan kuliah", "Kurang motivasi", "Konflik", "Tidak merasa dilibatkan", "Peran tidak jelas", "Kesibukan di luar kampus", "Lainnya"], 2),
  M("Bentuk apresiasi yang paling bermakna bagimu.", ["Ucapan langsung", "Disebut namanya di forum", "Unggahan media sosial", "Sertifikat", "Kesempatan peran yang lebih besar", "Lainnya"], 2),
]);
def("H", "Komunikasi", [
  "Keputusan penting di organisasi saya dicatat secara tertulis.",
  "Informasi organisasi sampai ke seluruh anggota tepat waktu.",
  "Ada jalur yang jelas untuk berkomunikasi dengan pembina dan pihak kampus.",
  "Saya pernah diajak bicara secara personal oleh ketua atau pengurus tentang kondisi saya di organisasi.",
  "Saya merasa dipahami oleh pengurus.",
  "Saya menjalani organisasi karena merasa memilikinya, bukan sekadar kewajiban.",
  "Ketua memperlakukan semua anggota secara adil.",
  "Komunikasi di organisasi saya lebih banyak mengandalkan obrolan lisan daripada catatan tertulis.",
]);
def("I", "Rapat", [
  "Poin pembahasan disiapkan sebelum rapat dimulai.",
  "Rapat di organisasi saya menghasilkan keputusan tertulis.",
  "Setiap rapat punya notulensi yang dibagikan.",
  "Rapat pertama kepanitiaan memuat sosialisasi program dan pembagian tugas.",
  "Tindak lanjut rapat (RTL) punya penanggung jawab dan tenggat.",
  "Rapat sering dimulai terlambat dan melebar tanpa hasil.",
  "Ada pengingat atau hitung mundur menjelang acara.",
  C("Rapat di organisasi saya lebih sering berupa:", ["Sosialisasi saja", "Pembahasan saja", "Sosialisasi lebih dulu, lalu pembahasan setelah RTL", "Tidak jelas tujuannya"]),
]);
def("J", "Penerimaan anggota baru (PAB) dan pemateri", [
  Y("Organisasi saya melaksanakan PAB."),
  "Materi PAB mencakup dasar berorganisasi (kepemimpinan, manajemen, konflik, etika).",
  "Materi PAB lebih banyak membahas bidang khusus organisasi daripada dasar berorganisasi.",
  "Setelah PAB, anggota baru paham alasan berorganisasi.",
  "PAB di organisasi saya bermakna, bukan sekadar seremonial.",
  "Pemateri pada kegiatan organisasi saya kompeten di bidangnya.",
  "Sulit mencari pemateri yang kompeten untuk kegiatan organisasi saya.",
  "Organisasi saya memanfaatkan alumni, dosen, atau praktisi lokal sebagai pemateri.",
  "Anggota senior dilibatkan sebagai pemateri.",
  M("Materi dasar yang paling dibutuhkan anggota baru.", ["Arti dan tujuan berorganisasi", "Kepemimpinan", "Manajemen organisasi", "Manajemen konflik", "Etika dan komunikasi", "Kerja tim", "Administrasi (proposal dan LPJ)", "Manajemen waktu", "Lainnya"], 3),
], 0, "Jika organisasimu tidak melaksanakan PAB, butir J2 sampai J5 otomatis dilewati.");
def("K", "Perancangan program dan keterhubungan program", [
  "Program dirancang berdasarkan kebutuhan sasarannya.",
  "Program punya indikator keberhasilan sebelum dilaksanakan.",
  "Risiko kegiatan diidentifikasi sebelum pelaksanaan.",
  "Ada penilaian kelayakan sebelum sebuah program dijalankan.",
  "Program-program di organisasi saya saling berkaitan, sehingga satu program menjadi bekal atau lanjutan program lain.",
  "Peserta pelatihan atau pembekalan diarahkan ke program inti.",
  "Organisasi saya punya acara puncak tahunan yang menampilkan hasil program-programnya.",
  "Hasil program (karya, laporan, dokumentasi) dipakai sebagai bahan perencanaan periode berikutnya.",
  "Program di organisasi saya berjalan sendiri-sendiri tanpa keterkaitan.",
  "Peserta kegiatan organisasi kemudian bergabung menjadi anggota atau pengurus.",
]);
def("M", "Pendanaan (pengurus inti)", [
  "Sebagian besar kegiatan organisasi saya bergantung pada dana kampus.",
  "Kegiatan organisasi saya pernah tertunda atau batal karena dana terlambat.",
  "Organisasi saya punya sumber dana alternatif di luar dana kampus.",
  "Organisasi saya tetap bisa menjalankan program inti walau dana kampus tidak cair.",
  "Pengelolaan dana dilaporkan secara transparan kepada anggota.",
  "Saya mengetahui peluang pendanaan di luar kampus (hibah, kerja sama, dan sejenisnya).",
  M("Sumber dana alternatif yang pernah dicoba (pilih semua yang sesuai).", ["Iuran anggota", "Sponsor atau kerja sama", "Usaha organisasi", "Penjualan karya atau produk", "Hibah eksternal", "Donasi", "Belum pernah mencoba"], 99),
  T("Kendala terbesar dalam mencari dana selain dari kampus."),
], 1);
def("N", "Kepanitiaan dan manajemen konten (pengurus inti)", [
  "Peran dan jobdesk panitia jelas sejak awal.",
  "Jalur koordinasi antarpanitia jelas.",
  "Setelah acara, panitia dievaluasi dan serah terima dilakukan dengan rapi.",
  "Organisasi saya membuat rencana konten media sosial untuk acara (jadwal, penanggung jawab, status).",
  "Tugas tim media (pengambil gambar, desain, penjadwal unggahan) dibagi dengan jelas.",
  "Media sosial organisasi dikelola konsisten (jadwal dan identitas visual).",
  "Dokumentasi acara diarsipkan rapi untuk periode berikutnya.",
  "Izin, hak cipta musik, dan privasi dipertimbangkan dalam membuat konten.",
  T("Platform media sosial utama yang dipakai organisasi."),
], 1);
def("O", "Administrasi dan arsip (pengurus inti)", [
  "Proposal dan LPJ sering terlambat atau kualitasnya kurang.",
  "Pengurus baru kesulitan memahami format proposal dan LPJ.",
  "Organisasi saya punya templat dokumen standar.",
  "Arsip periode sebelumnya mudah ditemukan saat serah terima.",
  "Arsip disimpan secara digital per periode kepengurusan.",
  "LPJ mencerminkan kondisi kegiatan yang sebenarnya.",
  "Pembina rutin mendampingi penyusunan dokumen organisasi.",
], 1);
def("P", "Evaluasi, sistem, dan regenerasi (pengurus inti)", [
  "Evaluasi kegiatan dilakukan secara tertulis dan didokumentasikan.",
  "Hasil evaluasi ditindaklanjuti pada kegiatan berikutnya.",
  "Kinerja pengurus dievaluasi secara berkala.",
  "Jika ketua tidak ada, organisasi saya tetap bisa berjalan.",
  "Organisasi saya punya SOP atau pedoman kerja tertulis.",
  "Ada pekerjaan di organisasi saya yang hanya bisa dilakukan oleh satu orang.",
  "Proses regenerasi dan serah terima berjalan terencana.",
  "Calon pengganti dipersiapkan sebelum pergantian pengurus.",
  "Ada pendampingan dari ketua lama kepada ketua baru.",
  "Anggota punya jenjang pembinaan menjadi kader.",
  T("Satu hal yang dulu ingin kamu ketahui sebelum menjadi pengurus inti."),
], 1);
def("L", "Penutup: kebutuhan terhadap buku", [
  M("Bagian yang paling kamu butuhkan.", ["Esensi dan tujuan organisasi", "Peran ketua", "Seleksi dan pengelolaan SDM", "Konflik, motivasi, dan apresiasi", "Komunikasi dan rapat", "PAB dan pemateri", "Program berdampak dan program yang saling terhubung", "Pendanaan mandiri", "Humas dan manajemen konten", "Administrasi, arsip, dan evaluasi", "Regenerasi dan sistem organisasi"], 5),
  M("Format yang paling membantu (pilih semua yang sesuai).", ["Bacaan singkat", "Studi kasus", "Templat dokumen", "Daftar periksa (checklist)", "Contoh dokumen", "Infografis atau video pendamping"], 99),
  "Saya akan memakai buku panduan ini jika tersedia untuk ormawa saya.",
  C("Bentuk buku yang kamu pilih.", ["Cetak", "E-book", "Keduanya"]),
  T("Masalah terbesar di organisasimu yang menurutmu belum ada solusinya."),
  T("Topik lain yang ingin kamu lihat dibahas di buku ini."),
  Y("Bersedia diwawancarai lebih lanjut? (Kontak diisi lewat formulir terpisah supaya jawaban tetap anonim.)"),
]);

const Q = {}; SEC.forEach(s => s.q.forEach(q => Q[q.id] = q));
const REV = new Set("B6 B7 D4 E5 F4 F5 F7 G4 H8 I6 J3 J7 K9 M1 M2 O1 O2 P6".split(" "));
const DESC = new Set("D6 D7 E2 E4 L3".split(" "));

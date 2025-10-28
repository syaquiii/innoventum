-- CreateTable
CREATE TABLE `Pengguna` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nama_lengkap` VARCHAR(100) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `nomor_telepon` VARCHAR(15) NOT NULL,
    `role` ENUM('mahasiswa', 'admin') NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `Pengguna_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mahasiswa` (
    `mahasiswa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nim` VARCHAR(20) NOT NULL,
    `institusi` VARCHAR(100) NOT NULL,
    `program_studi` VARCHAR(100) NOT NULL,
    `jumlah_kursus_selesai` INTEGER NOT NULL DEFAULT 0,
    `foto_profil` VARCHAR(255) NULL,

    UNIQUE INDEX `Mahasiswa_user_id_key`(`user_id`),
    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`mahasiswa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrator` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nik` VARCHAR(20) NOT NULL,
    `jabatan` VARCHAR(50) NOT NULL,
    `level_akses` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Administrator_user_id_key`(`user_id`),
    UNIQUE INDEX `Administrator_nik_key`(`nik`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kursus` (
    `kursus_id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(200) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `kategori` VARCHAR(50) NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `durasi_menit` INTEGER NOT NULL,
    `level` ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    `created_by` INTEGER NOT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL,

    PRIMARY KEY (`kursus_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materi` (
    `materi_id` INTEGER NOT NULL AUTO_INCREMENT,
    `kursus_id` INTEGER NOT NULL,
    `judul_materi` VARCHAR(200) NOT NULL,
    `urutan` INTEGER NOT NULL,
    `tipe_konten` ENUM('video', 'dokumen', 'latihan') NOT NULL,
    `url_konten` VARCHAR(255) NOT NULL,
    `durasi_menit` INTEGER NULL,

    PRIMARY KEY (`materi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `enrollment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `kursus_id` INTEGER NOT NULL,
    `tanggal_mulai` TIMESTAMP NOT NULL,
    `tanggal_selesai` TIMESTAMP NULL,
    `progres_persen` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('ongoing', 'completed', 'dropped') NOT NULL,

    PRIMARY KEY (`enrollment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentor` (
    `mentor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `bio` TEXT NOT NULL,
    `keahlian` VARCHAR(255) NOT NULL,
    `foto` VARCHAR(255) NULL,
    `email_kontak` VARCHAR(100) NOT NULL,
    `linkedin` VARCHAR(255) NULL,
    `status` ENUM('aktif', 'nonaktif') NOT NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`mentor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thread` (
    `thread_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `judul` VARCHAR(200) NOT NULL,
    `isi` TEXT NOT NULL,
    `jumlah_views` INTEGER NOT NULL DEFAULT 0,
    `jumlah_komentar` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`thread_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Komentar` (
    `komentar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `thread_id` INTEGER NOT NULL,
    `mahasiswa_id` INTEGER NOT NULL,
    `isi_komentar` TEXT NOT NULL,
    `tanggal_dibuat` TIMESTAMP NOT NULL,

    PRIMARY KEY (`komentar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProyekBisnis` (
    `proyek_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswa_id` INTEGER NOT NULL,
    `nama_proyek` VARCHAR(200) NOT NULL,
    `deskripsi` TEXT NULL,
    `status_proyek` ENUM('ideas', 'perencanaan', 'eksekusi', 'selesai') NOT NULL,
    `dokumen` VARCHAR(255) NULL,

    PRIMARY KEY (`proyek_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Pengguna`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrator` ADD CONSTRAINT `Administrator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Pengguna`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kursus` ADD CONSTRAINT `Kursus_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materi` ADD CONSTRAINT `Materi_kursus_id_fkey` FOREIGN KEY (`kursus_id`) REFERENCES `Kursus`(`kursus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`mahasiswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_kursus_id_fkey` FOREIGN KEY (`kursus_id`) REFERENCES `Kursus`(`kursus_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mentor` ADD CONSTRAINT `Mentor_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Administrator`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thread` ADD CONSTRAINT `Thread_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`mahasiswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `Thread`(`thread_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`mahasiswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProyekBisnis` ADD CONSTRAINT `ProyekBisnis_mahasiswa_id_fkey` FOREIGN KEY (`mahasiswa_id`) REFERENCES `Mahasiswa`(`mahasiswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Pengguna`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Pengguna`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

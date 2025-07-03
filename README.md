# PrismaX Auto BOT

Bot otomatis untuk klaim **daily login** poin di [Prismax.ai](https://app.prismax.ai/) menggunakan banyak akun email. Mendukung proxy dan pengaturan tanggal fleksibel.

---

## 🚀 Instalasi

```bash
git clone https://github.com/Boren4anzz/PrismaX-Auto-BOT.git
cd PrismaX-Auto-BOT
npm install
````

---

## 🛠️ Persiapan

1. **account.txt**
   Daftar email akun Prismax (satu per baris):

   ```
   email1@youremail.com
   email1@youremail.com
   ```

2. **proxy.txt** *(opsional)*
   Format proxy:

   ```
   username:password@ip:port
   ```

3. **config.json**
   Contoh isi:

   ```json
   {
     "startDate": "2024-01-01",
     "endDate": "2024-12-31",
     "delayBetweenRequests": 2000,
     "delayBetweenAccounts": 3000,
     "autoDateRange": true,
     "daysBack": 7
   }
   ```

---

## ▶️ Jalankan Bot

```bash
node bot.js
```

---

## ✅ Catatan

* Tidak mengakses private key atau wallet.
* Aman untuk penggunaan lokal dan akun dummy.
* Output hasil klaim akan ditampilkan di terminal.

---

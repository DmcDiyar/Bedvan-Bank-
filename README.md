# Bedvan-Bank
Modern ve Minimalist Bankacılık Uygulaması

Bedvan Bank 🏦
Bedvan Bank, minimalist bir tasarımla modern bankacılık işlemlerini dijital ortamda sunan bir web uygulamasıdır. Kullanıcılar kolayca hesap açabilir, para transferi yapabilir, kredi talep edebilir ve işlem geçmişlerini yönetebilir. Hızlı, güvenli ve kullanıcı dostu bir deneyim sunar.
🚀 Özellikler

Hesap Yönetimi: Hızlı hesap açma, oturum açma ve hesap kapatma işlemleri.
Para Transferi: Otomatik kullanıcı adı önerileriyle kolay ve güvenli transfer.
Kredi Talebi: Kredi puanı tabanlı dinamik kredi onay sistemi.
İşlem Filtresi: Para yatırma ve çekme işlemlerini filtreleme.
Kalıcı Veri: localStorage ile hesapların kalıcı olarak saklanması.
E-posta Doğrulama: Simüle edilmiş doğrulama kodu ile güvenli hesap oluşturma.
Responsive Tasarım: Mobil ve masaüstü cihazlarla tam uyumluluk.
Modern Arayüz: Yapışkan navigasyon, tembel yükleme (lazy loading) ve kaydırma animasyonları.

🛠 Kullanılan Teknolojiler

HTML5 & CSS3: Yapı ve stil için.
JavaScript (ES6+): Dinamik işlevler ve etkileşimler.
localStorage & sessionStorage: Veri saklama.
Intl API: Para birimi ve tarih formatlama.
Intersection Observer API: Yapışkan navigasyon ve tembel yükleme.
Google Fonts (Poppins): Modern tipografi.

📥 Kurulum

Repoyu klonlayın:git clone https://github.com/kullanici-adi/bedvan-bank.git


Proje dizinine gidin:cd bedvan-bank


Yerel bir sunucu ile projeyi çalıştırın (örneğin, live-server):npx live-server


Tarayıcıda index.html’yi açın ve hesap açarak veya giriş yaparak uygulamayı keşfedin.

📖 Kullanım

Hesap Açma:

index.html’deki “Hesap Aç” butonuna tıklayın.
Ad, soyad ve e-posta girin. Kullanıcı adı (örn. ad için Ayşe Demir) ve şifre (örn. ayde) otomatik oluşturulur.
Doğrulama kodu alert’ini görün ve bank.html’ye yönlendirilin.


Giriş Yapma:

bank.html’de kullanıcı adı (örn. ay) ve şifre (örn. ahya) ile giriş yapın.
Bakiye, işlem geçmişi ve özet görüntülenir.


İşlemler:

Para Transferi: Alıcı kullanıcı adını seçin (otomatik önerilerle) ve miktarı girin.
Kredi Talebi: Kredi puanı hesaplamasına göre onaylanan miktarı talep edin.
Hesap Kapatma: Kullanıcı adı ve şifrenizi doğrulayarak hesabı kapatın.
Filtreleme: İşlem geçmişini tümü, para yatırma veya çekme olarak filtreleyin.


Yeni Hesap Açma:

bank.html’deki “Yeni Hesap Aç” butonu ile başka bir hesap oluşturun.



🧪 Test Senaryoları

Hesap Açma:
Ad: Ayşe, Soyad: Demir, E-posta: ayse@example.com.
Beklenen: Alert ile “Kullanıcı adınız: ad, Şifreniz: ayde, Doğrulama Kodu: [6 haneli kod]” ve bank.html’ye yönlendirme.


Giriş:
Kullanıcı adı: ad, Şifre: ayde.
Beklenen: Hoş geldin mesajı ve UI güncellenmesi.


Transfer:
Alıcı: ek (Elif Kaya), Miktar: 500.
Beklenen: Başarılı transfer alert’i ve bakiye güncellenmesi.


Kredi:
Miktar: 1000.
Beklenen: Kredi puanı uygunsa onay, değilse reddedildi mesajı.



Konsolda test için:
console.log(JSON.parse(localStorage.getItem('accounts')));

🤝 Katkıda Bulunma
Bu açık kaynaklı bir projedir! Katkıda bulunmak için:

Repoyu fork edin.
Yeni bir branch oluşturun: git checkout -b feature/yeni-ozellik.
Değişikliklerinizi yapın ve commit edin: git commit -m "Yeni özellik eklendi".
Push yapın: git push origin feature/yeni-ozellik.
Pull request gönderin.

Önerilen Katkılar:

Çoklu para birimi desteği.
Gerçek zamanlı bildirim sistemi.
Sunucu tarafı entegrasyonu (Node.js, Firebase vb.).
Gelişmiş kredi puanı algoritmaları.

📝 Notlar

Veri Kalıcılığı: Hesaplar localStorage’da saklanır, tarayıcı temizlenene kadar kalıcıdır.
Dosya Yolu: bank.html’ye yönlendirme ./module/final1/bank.html olarak ayarlıdır. Farklıysa, script.js’yi güncelleyin.
Kredi: Bu proje, Jonas Schmedtmann’ın eğitim materyaline dayanır. Öğrenme veya portföy amaçlı kullanılabilir, ancak kendi ürününüz olarak iddia etmeyin.

📸 Ekran Görüntüleri
(İsteğe bağlı: Buraya ekran görüntüleri ekleyebilirsiniz. Örneğin, index.html ve bank.html arayüzleri.)
📧 İletişim
Sorularınız veya önerileriniz için GitHub Issues kullanın veya [kullanici-adi]@example.com adresine e-posta gönderin.
Bedvan Bank ile bankacılığı sadeleştirin!
